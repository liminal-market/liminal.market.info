import {Chart, registerables} from "chart.js";
import QueryBuilder from "../queries/QueryBuilder";
import OrderQuery from "../queries/OrderQuery";
import OpenGraphRepository from "../repositories/OpenGraphRepository";
import InfoHtml from '../html/wallet/info.html'
import PositionHtml from '../html/wallet/positions.html'
import HistoryHtml from '../html/wallet/history.html'
import  OrderHtml from '../html/wallet/orders.html'
import UIHelper from "./UIHelper";
import WalletQuery from "../queries/WalletQuery";

export default class Wallet {
    queryBuilder = new QueryBuilder();
    public async render(address: string) {

        Chart.register(...registerables);
        UIHelper.registerHandlebarHelpers();

        OrderQuery.loadOrdersOnWallet(address, this.queryBuilder);
        WalletQuery.loadHistory(address, this.queryBuilder)

        let openGraphRepository = new OpenGraphRepository();
        let result = await openGraphRepository.execute(this.queryBuilder.getQuery())
        let wallet = result.wallet;

        UIHelper.clearContent();
        this.renderInfo(wallet);
        this.renderPositions(wallet.positions)
        this.renderOrders(wallet.orders)
        this.renderHistory(result.walletHistories)
    }

    private renderInfo(wallet: any) {
        const template = Handlebars.compile(InfoHtml);
        let content = template({wallet: wallet, GraphQL:this.queryBuilder.getQueryByName('wallet')});

        UIHelper.addToTopContent(content);
    }

    private renderPositions(positions: any) {
        const template = Handlebars.compile(PositionHtml);
        let content = template({positions: positions, GraphQL:this.queryBuilder.getQueryByName('wallet')});

        UIHelper.appendToMiddleGrid(content);
    }
    private renderHistory(history: any) {
        console.log(history);
        const template = Handlebars.compile(HistoryHtml);
        let content = template({history: history, GraphQL:this.queryBuilder.getQueryByName('history')});

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
}