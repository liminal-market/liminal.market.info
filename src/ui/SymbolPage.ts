import {Chart, registerables} from "chart.js";
import QueryBuilder from "../queries/QueryBuilder";
import OpenGraphRepository from "../repositories/OpenGraphRepository";
import UIHelper from "./UIHelper";
import InfoHtml from '../html/symbol/info.html';
import SymbolsHtml from '../html/symbol/symbols.html';
import SymbolQuery from "../queries/SymbolQuery";


export default class SymbolPage {
    first = 5;
    skip = 0;
    page = 0;

    public async render(symbol? : string) {
        Chart.register(...registerables);
        UIHelper.registerHandlebarHelpers();

        let queryBuilder = new QueryBuilder();
        if (symbol) {
            SymbolQuery.loadBySymbolId(symbol, queryBuilder);
        } else {
            SymbolQuery.loadBySymbols(queryBuilder, this.first, this.skip);
        }

        let openGraphRepository = new OpenGraphRepository();
        let result = await openGraphRepository.execute(queryBuilder.getQuery())

        UIHelper.clearContent();
        if (symbol) {
            this.renderSymbol(result.symbol);
        } else {
            this.renderSymbols(result.symbols);
        }

    }

    private renderSymbol(symbol: any) {
        const template = Handlebars.compile(InfoHtml);
        let content = template({symbol: symbol});

        UIHelper.addToTopContent(content);

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
                    this.skip += this.first * ++this.page;
                } else {
                    this.skip -= this.first * --this.page;
                }

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