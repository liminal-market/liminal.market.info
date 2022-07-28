import {Chart, registerables} from "chart.js";
import QueryBuilder from "../queries/QueryBuilder";
import OrderQuery from "../queries/OrderQuery";
import OpenGraphRepository from "../repositories/OpenGraphRepository";
import InfoHtml from '../html/wallet/info.html'
import PositionHtml from '../html/wallet/positions.html'
import  OrderHtml from '../html/wallet/orders.html'
import UIHelper from "./UIHelper";

export default class Wallet {

    public async render(address: string) {

        Chart.register(...registerables);
        UIHelper.registerHandlebarHelpers();

        let queryBuilder = new QueryBuilder();
        OrderQuery.loadOrdersOnRecipient(address, queryBuilder);

        let openGraphRepository = new OpenGraphRepository();
        let result = await openGraphRepository.execute(queryBuilder.getQuery())
        let user = result.user;

        UIHelper.clearContent();
        this.renderUser(user);
        this.renderPositions(user.positions)
        this.renderOrders(user.orders)
    }

    private renderUser(user: any) {
        const template = Handlebars.compile(InfoHtml);
        let content = template({user: user});

        UIHelper.addToTopContent(content);
    }

    private renderPositions(positions: any) {
        const template = Handlebars.compile(PositionHtml);
        let content = template({positions: positions});

        UIHelper.addToTopContent(content);
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
        let content = template({Title:'Orders', orders: orders});

        UIHelper.appendToMiddleGrid(content);
    }
}