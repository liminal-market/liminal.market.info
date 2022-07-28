import LiminalMarketInfo from "../queries/LiminalMarketInfo";
import DayDataQuery from "../queries/DayDataQuery";
import OpenGraphRepository from "../repositories/OpenGraphRepository";
import QueryBuilder from "../queries/QueryBuilder";
import TvlHtml from '../html/frontpage/tvl.html'
import VolumeHtml from '../html/frontpage/volume.html'
import TopHtml from '../html/frontpage/top.html';
import UserHtml from '../html/frontpage/users.html';
import OrderHtml from '../html/frontpage/orders.html';

import {Chart, registerables} from "chart.js";
import SymbolQuery from "../queries/SymbolQuery";
import UserQuery from "../queries/UserQuery";
import OrderQuery from "../queries/OrderQuery";
import UIHelper from "./UIHelper";

export default class Frontpage {


    public async render() {
        Chart.register(...registerables);
        UIHelper.registerHandlebarHelpers();

        let queryBuilder = new QueryBuilder();
        LiminalMarketInfo.loadLiminalMarketInfo(queryBuilder, (result) => {
            this.renderLiminalInfo(result, result);
        });
        DayDataQuery.loadLast365DataDaysNewestFirst(queryBuilder, (result) => {

        })
        SymbolQuery.loadMostPopular(queryBuilder);
        UserQuery.loadUserPositionsNewestFirst(queryBuilder);
        OrderQuery.loadNewestOrders(queryBuilder);

        let openGraphRepository = new OpenGraphRepository();
        let result = await openGraphRepository.execute(queryBuilder.getQuery())

        let chart1 = this.renderLiminalInfo(result.liminalMarketInfos[0], result.dayDatas)
        let chart2 = this.renderVolume(result.dayDatas);
        this.renderSymbols(result.symbols);
        this.renderUsers(result.users);
        this.renderOrders(result.orders);
        this.generateChart(...chart1);
        this.generateChart(...chart2);
    }

    public addDays(date: Date, days: number) {
        return new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));
    }

    public renderVolume(dayData: any): [string, string, boolean] {
        const template = Handlebars.compile(VolumeHtml);
        let content = template({Volume: '13900000'});

        UIHelper.addToTopContent(content);

        return [dayData, 'volumeCanvas', false];
    }

    public renderLiminalInfo(liminalMarketInfo: any, dayData: any): [string, string, boolean] {
        let mainDiv = document.getElementById('main');
        if (!mainDiv) return ['', '', false];

        liminalMarketInfo.TVL = parseFloat(liminalMarketInfo.tvlAUSD) + parseFloat(liminalMarketInfo.tvlSymbolUSD);

        const template = Handlebars.compile(TvlHtml);
        let content = template(liminalMarketInfo);

        UIHelper.addToTopContent(content);
        return [dayData, 'tvlCanvas', true];

    }

    private generateChart(dayData: any, elementId: string, isTvl = true) {

        let data: any = [];

        for (let i = 0; i < dayData.length; i++) {
            let day = dayData[i];
            let dateStr = new Date(parseFloat(day.date)).toDateString();
            let y = parseFloat(day.tvlUSD);
            if (!isTvl) y = parseFloat(day.volumeUsd);

            data[i] = {x: dateStr, y: y}
        }


        let ctx = (document.getElementById(elementId)! as HTMLCanvasElement).getContext('2d')!;
        const myChart = new Chart(ctx, {
            type: 'bar',
            options: {},
            data: {
                datasets: [{
                    backgroundColor: '#040633',
                    barPercentage: 0.5,
                    barThickness: 6,
                    label: elementId,
                    data: data
                }]
            }
        });

        return myChart;
    }


    private renderSymbols(symbols: any) {
        const template = Handlebars.compile(TopHtml);
        let content = template({Title: 'Top stocks', symbols: symbols});

        UIHelper.appendToMiddleGrid(content);
    }


    public static isOlderThenInMinutes(date: Date, minutes: number) {
        let currentTime = new Date().getTime();
        return (currentTime > (date.getTime() + minutes * 60 * 1000));
    };

    private renderUsers(users: any) {
        Handlebars.registerHelper('volume24H', (orders: any) => {
            let total = 0;
            for (let i = 0; i < orders.length; i++) {
                let order = orders[i];
                let filledAt = new Date(parseFloat(order.filledAt));
                if (Frontpage.isOlderThenInMinutes(filledAt, 60 * 60 * 24)) {
                    return;
                }
                let amount = parseFloat(order.filledQty) * parseFloat(order.filledAvgPrice);
                if (order.side == 'sell') {
                    total -= amount;
                } else {
                    total += amount;
                }
            }
            return total;
        })

        Handlebars.registerHelper('tvl', (positions: any) => {
            let total = 0;
            for (let i = 0; i < positions.length; i++) {
                let position = positions[i];

                let qty = parseFloat(position.qty);
                let pricePerShare = parseFloat(position.symbol.pricePerShare);

                total += qty * pricePerShare;
            }
            return total;
        })

        Handlebars.registerHelper('logos', (positions: any) => {
            let str = '';
            for (let i = 0; i < positions.length; i++) {
                let position = positions[i];

                let qty = parseFloat(position.qty);
                let pricePerShare = parseFloat(position.symbol.pricePerShare);
                let tvl = qty * pricePerShare;
                str += '<img src="' + position.symbol.logo + '" title="TVL:' + tvl + ' in ' + position.symbol.id + '" />';
            }
            return str;
        })

        const template = Handlebars.compile(UserHtml);
        let content = template({Title: 'Top user', users: users});

        UIHelper.appendToMiddleGrid(content);
    }

    private renderOrders(orders: any) {
        Handlebars.registerHelper('orderDesc', function (order: any) {
            let str = '';
            if (order.side == 'sell') {
                str = 'Selling ' + order.symbol.id + ' for aUSD';
            } else {
                str = 'Buying ' + order.symbol.id + ' using aUSD';
            }

            return '<a href="https://mumbai.polygonscan.com/tx/' + order.id + '" target="_blank">' + str + '</a>';
        })

        UIHelper.registerHandlebarHelpers();

        const template = Handlebars.compile(OrderHtml);
        let content = template({Title: 'Latest transactions', orders: orders});

        UIHelper.appendToMiddleGrid(content);
    }
}