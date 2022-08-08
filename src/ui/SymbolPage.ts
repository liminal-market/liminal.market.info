import {Chart, registerables} from "chart.js";
import QueryBuilder from "../queries/QueryBuilder";
import OpenGraphRepository from "../repositories/OpenGraphRepository";
import UIHelper from "./UIHelper";
import InfoHtml from '../html/symbol/info.html';
import SymbolsHtml from '../html/symbol/symbols.html';
import SymbolQuery from "../queries/SymbolQuery";
import OrderQuery from "../queries/OrderQuery";
import OrdersHtml from '../html/symbol/orders.html';
import ChartHtml from '../html/symbol/chart.html';
import PositionsHtml from '../html/symbol/positions.html';
import PositionQuery from "../queries/PositionQuery";

export default class SymbolPage {
    first = 10;
    skip = 0;
    page = 0;

    public async render(symbol? : string) {

        Chart.register(...registerables);
        UIHelper.registerHandlebarHelpers();

        let queryBuilder = new QueryBuilder();
        if (symbol) {
            SymbolQuery.loadBySymbolId(symbol, queryBuilder);
            OrderQuery.loadNewestOrdersBySymbol(queryBuilder, symbol);
            PositionQuery.loadLargestPositionsBySymbol(queryBuilder, symbol);
        } else {
            SymbolQuery.loadBySymbols(queryBuilder, this.first, this.skip);
        }
        let openGraphRepository = new OpenGraphRepository();
        let result = await openGraphRepository.execute(queryBuilder.getQuery())

        UIHelper.clearContent();
        if (symbol) {
            this.renderSymbol(result);
        } else {
            this.renderSymbols(result.symbols);
        }

    }
    public renderWidget(symbol : string) {

        let src = 'https://s3.tradingview.com/tv.js';
        let script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            this.renderWidget2(symbol);
        }
        document.body.append(script);
    }
    public renderWidget2(symbol : string) {
        // @ts-ignore
        new TradingView.widget(
            {
                "autosize": true,
                "symbol": symbol,
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "light",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "allow_symbol_change": true,
                "container_id": "tradingview_3c6c2"
            }
        );
    }
    private renderSymbol(result: any) {
        let template = Handlebars.compile(InfoHtml);
        let content = template({symbol: result.symbol});

        UIHelper.addToTopContent(content);

        template = Handlebars.compile(ChartHtml);
        content = template({});

        UIHelper.addToTopContent(content);
        this.renderWidget(result.symbol.id);

        template = Handlebars.compile(PositionsHtml);
        content = template({Title: 'Largest holders', positions: result.positions});
        UIHelper.appendToMiddleGrid(content);

        template = Handlebars.compile(OrdersHtml);
        content = template({Title: 'Latest orders', orders: result.orders});
        UIHelper.appendToMiddleGrid(content);
    }



    private renderSymbols(symbols: any) {
        const template = Handlebars.compile(SymbolsHtml);
        let content = template({symbols: symbols});

        UIHelper.addToTopContent(content);
        this.checkPagingButtons();

        let buttons = document.querySelectorAll('.stocks_table .paging');
        for (let i=0;i<buttons.length;i++) {
            buttons[i].addEventListener('click', async (evt) => {
                evt.preventDefault();
                let element = (evt.target as HTMLElement);
                let direction = parseInt(element.dataset["page"]!.toString());
                if (direction > 0) {
                    this.skip = this.first * ++this.page;
                } else {
                    this.skip = this.first * --this.page;
                }

                console.log('skip:', this.skip, 'first', this.first, 'page', this.page);

                let queryBuilder = new QueryBuilder();
                SymbolQuery.loadBySymbols(queryBuilder, this.first, this.skip);

                let openGraphRepository = new OpenGraphRepository();
                let result = await openGraphRepository.execute(queryBuilder.getQuery())
                UIHelper.clearContent();

                this.renderSymbols(result.symbols);

                this.checkPagingButtons();
            })
        }

    }

    private checkPagingButtons() {
        let prevButton = document.querySelector('.stocks_table .prev')! as HTMLElement;
        if (this.page == 0) {
            prevButton.classList.add('none')
        } else if (this.page > 0) {
            prevButton.classList.remove('none')
        }
    }
}