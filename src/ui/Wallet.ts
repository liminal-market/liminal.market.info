import {Chart, registerables} from "chart.js";
import QueryBuilder from "../queries/QueryBuilder";
import OrderQuery from "../queries/OrderQuery";
import OpenGraphRepository from "../repositories/OpenGraphRepository";
import InfoHtml from '../html/wallet/info.html'
import PositionHtml from '../html/wallet/positions.html'
import HistoryHtml from '../html/wallet/history.html'
import OrderHtml from '../html/wallet/orders.html'
import UIHelper from "./UIHelper";
import WalletQuery from "../queries/WalletQuery";
import NoInfoHtml from '../html/wallet/no_info.html';
import PositionRepository from "../repositories/PositionRepository";

export default class Wallet {
    queryBuilder = new QueryBuilder();
    userPositions : any;

    public async render(address: string) {

        Chart.register(...registerables);
        UIHelper.registerHandlebarHelpers();

        OrderQuery.loadOrdersOnWallet(address, this.queryBuilder);
        WalletQuery.loadHistory(address, this.queryBuilder)

        let openGraphRepository = new OpenGraphRepository();
        let result = await openGraphRepository.execute(this.queryBuilder.getQuery())
        if (!result || !result.wallet) {
            this.renderNoInfo(address);
            return;
        }

        let positionRepository = new PositionRepository();
        this.userPositions = await positionRepository.getUserPositions(address);

        let wallet = result.wallet;

        UIHelper.clearContent();

        this.renderInfo(wallet, this.userPositions);
        this.renderPositions(wallet.positions, this.userPositions)
        this.renderOrders(wallet.orders)
        this.renderHistory(result.walletHistories)
    }

    private renderInfo(wallet: any, userPositions : any) {
        Handlebars.registerHelper('totalValue', function (wallet: any) {
            let stockValue = 0;
            let positions = wallet.positions;
            for (let i=0;i<positions.length;i++) {
                stockValue += parseFloat(positions[i].symbol.pricePerShare) * parseFloat(positions[i].tsl);
            }

            return UIHelper.formatCurrency(parseFloat(wallet.balance) + stockValue);
        })
console.log('userPositions', userPositions);
        const template = Handlebars.compile(InfoHtml);
        let content = template({wallet: wallet, userPositions: userPositions, GraphQL:this.queryBuilder.getQueryByName('wallet')});

        UIHelper.addToTopContent(content);
    }

    private renderPositions(positions: any, userPositions : any) {
        Handlebars.registerHelper('plCalc', (position: any) => {
            let positions = this.userPositions.positions;
            for (let i=0;i<positions.length;i++) {
                if (positions[i].symbol == position.symbol.id) {
                    return UIHelper.formatCurrency(positions[i].unrealized_pl)
                }
            }
            return '';
        })
        Handlebars.registerHelper('plpcCalc', (position: any) => {
            let positions = this.userPositions.positions;
            for (let i=0;i<positions.length;i++) {
                console.log(positions[i].symbol, position.symbol.id);
                if (positions[i].symbol == position.symbol.id) {
                    return UIHelper.formatPerc(positions[i].unrealized_plpc)
                }
            }
            return '';
        })

        const template = Handlebars.compile(PositionHtml);
        let content = template({positions: positions, userPositions:userPositions, GraphQL:this.queryBuilder.getQueryByName('wallet')});

        UIHelper.appendToMiddleGrid(content);
    }
    private renderHistory(history: any) {
        const template = Handlebars.compile(HistoryHtml);
        let content = template({history: history, GraphQL:this.queryBuilder.getQueryByName('walletHistory')});

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

        const template = Handlebars.compile(OrderHtml);
        let content = template({Title:'Orders', orders: orders, GraphQL:this.queryBuilder.getQueryByName('wallet')});

        UIHelper.appendToMiddleGrid(content);
    }

    private renderNoInfo(address: string) {
        const template = Handlebars.compile(NoInfoHtml);
        let content = template({ethAddress: address});
        UIHelper.addToTopContent(content);
    }
}