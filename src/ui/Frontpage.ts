import LiminalMarketInfo from "../queries/LiminalMarketInfo";
import DailyDataQuery from "../queries/DailyDataQuery";
import OpenGraphRepository from "../repositories/OpenGraphRepository";
import QueryBuilder from "../queries/QueryBuilder";
import TvlHtml from '../html/frontpage/tvl.html'
import VolumeHtml from '../html/frontpage/volume.html'
import SymbolsHtml from '../html/frontpage/symbols.html';
import WalletHtml from '../html/frontpage/wallets.html';
import OrderHtml from '../html/frontpage/orders.html';

import {Chart, registerables} from "chart.js";
import SymbolQuery from "../queries/SymbolQuery";
import WalletQuery from "../queries/WalletQuery";
import OrderQuery from "../queries/OrderQuery";
import UIHelper from "./UIHelper";
import SymbolPage from "./SymbolPage";
import LinkHandler from "./LinkHandler";
import 'chartjs-adapter-moment';
import moment from "moment";

export default class Frontpage {
    queryBuilder = new QueryBuilder();

    public async render() {
        Chart.register(...registerables);
        UIHelper.registerHandlebarHelpers();

    
        LiminalMarketInfo.loadLiminalMarketInfo(this.queryBuilder, (result) => {
            this.renderLiminalInfo(result, result);
        });
        DailyDataQuery.loadLast365DataDaysNewestFirst(this.queryBuilder, (result) => {


        })
        SymbolQuery.loadMostPopular(this.queryBuilder);
        WalletQuery.loadWalletPositionsNewestFirst(this.queryBuilder);
        OrderQuery.loadNewestOrders(this.queryBuilder);

        let openGraphRepository = new OpenGraphRepository();
        let result = await openGraphRepository.execute(this.queryBuilder.getQuery())

        let loading = document.getElementById('loading');
        if (loading) loading.remove();

        let chart1 = this.renderLiminalInfo(result.liminalMarketInfos[0], result.dailyDatas)
        let chart2 = this.renderVolume(result.dailyDatas);
        this.renderSymbols(result.symbols);
        this.renderWallets(result.wallets);
        this.renderOrders(result.orders);
        this.generateChart(...chart1);
        this.generateChart(...chart2);
    }

    public addDays(date: Date, days: number) {
        return new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));
    }

    public renderVolume(dailyDatas: any): [string, string, boolean] {
        const template = Handlebars.compile(VolumeHtml);
        let content = template({Volume: dailyDatas[0].value, GraphQL:this.queryBuilder.getQueryByName('dailyDatas')});

        UIHelper.addToTopContent(content);

        return [dailyDatas, 'volumeCanvas', false];
    }

    public renderLiminalInfo(liminalMarketInfo: any, dailyData: any): [string, string, boolean] {
        let mainDiv = document.getElementById('main');
        if (!mainDiv) return ['', '', false];

        let TVL = parseFloat(liminalMarketInfo.balance) + parseFloat(liminalMarketInfo.value);

        const template = Handlebars.compile(TvlHtml);
        let content = template({TVL:TVL, GraphQL:this.queryBuilder.getQueryByName('liminalMarketInfos')});

        UIHelper.addToTopContent(content);
        return [dailyData, 'tvlCanvas', true];

    }

    private generateChart(dayData: any, elementId: string, isTvl = true) {

        let data: any = [];
        let idx = 0;
        for (let i = dayData.length-1; i >= 0; i--) {
            let day = dayData[i];
            let dateStr = moment(new Date(parseFloat(day.date))).format('YYYY-MM-DD'); ;
            let y = parseFloat(day.cost);
            if (!isTvl) y = parseFloat(day.shares);

            data[idx++] = {x: dateStr, y: y}
        }

        let ctx = (document.getElementById(elementId)! as HTMLCanvasElement).getContext('2d')!;
        const myChart = new Chart(ctx, {
            type: 'bar',
           options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false,
                        text: ''
                    }
                },
               scales : {
                   y: {
                    min:0
                   }
               }
            },
            data: {
                datasets: [{
                    backgroundColor: '#040633',
                    barPercentage: 1,
                    barThickness: 30,
                    label: '',
                    data: data,
                }]
            },
        });

        return myChart;
    }


    private renderSymbols(symbols: any) {
        const template = Handlebars.compile(SymbolsHtml);
        let content = template({Title: 'Top stocks', GraphQL:this.queryBuilder.getQueryByName('symbols'), symbols: symbols});

        UIHelper.appendToMiddleGrid(content);

    }


    public static isOlderThenInMinutes(date: Date, minutes: number) {
        let currentTime = new Date().getTime();
        return (currentTime > (date.getTime() + minutes * 60 * 1000));
    };

    private renderWallets(wallets: any) {
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
            return UIHelper.formatCurrency(total);
        })

        Handlebars.registerHelper('tvl', (positions: any) => {
            let total = 0;
            for (let i = 0; i < positions.length; i++) {
                let position = positions[i];

                let tsl = parseFloat(position.tsl);
                let pricePerShare = parseFloat(position.symbol.pricePerShare);

                total += tsl * pricePerShare;
            }
            return UIHelper.formatCurrency(total);
        })

        Handlebars.registerHelper('logos', (positions: any) => {
            let str = '';
            for (let i = 0; i<10 && i < positions.length; i++) {
                let position = positions[i];

                let qty = parseFloat(position.qty);
                let pricePerShare = parseFloat(position.symbol.pricePerShare);
                let tvl = qty * pricePerShare;
                str += '<img src="' + position.symbol.logo + '" title="TVL:' + tvl + ' in ' + position.symbol.id + '" />';
            }
            return str;
        })

        const template = Handlebars.compile(WalletHtml);
        let content = template({Title: 'Top wallets', GraphQL:this.queryBuilder.getQueryByName('wallets'), wallets: wallets});

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
        let content = template({Title: 'Latest orders', GraphQL:this.queryBuilder.getQueryByName('orders'), orders: orders});

        UIHelper.appendToMiddleGrid(content);
    }
}