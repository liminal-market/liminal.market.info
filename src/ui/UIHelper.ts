import moment from "moment";
import EmailFormHtml from "../html/emailform.html";

export default class UIHelper {
    static middleCount = 0;


    public static addToTopContent(content: string) {
        let topGrid = document.getElementById('topGrid')!;
        topGrid.innerHTML += content;
    }

    public static appendToMiddleGrid(content: string) {
        let middleGrid = document.getElementById('middleGrid')!;
        middleGrid.innerHTML += content;

        this.middleCount++;
        if (this.middleCount == 1) {
            const template = Handlebars.compile(EmailFormHtml);
            content = template({});
            middleGrid.innerHTML += content;
        }
    }

    public static clearContent() {
        let topGrid = document.getElementById('topGrid')!;
        topGrid.innerHTML = '';

        let middleGrid = document.getElementById('middleGrid')!;
        middleGrid.innerHTML = '';
        this.middleCount = 0;
    }

    public static registerHandlebarHelpers() {
        Handlebars.registerHelper('formatDate', (timestamp: string) => {
            let date = new Date(parseFloat(timestamp));
            let m = moment(date)
            return m.fromNow();
        })

        Handlebars.registerHelper('isoDate', (timestamp: string) => {
            let date = new Date(parseFloat(timestamp));
            return date.toISOString();
        })

        Handlebars.registerHelper('address', (address: string) => {
            return address.substring(0, 5) + '...' + address.substring(address.length - 5);
        })
        Handlebars.registerHelper('currency', (str: any) => {
            return this.formatCurrency(str);
        })

        Handlebars.registerHelper('number', (str: any) => {
            return new Intl.NumberFormat('en-US').format(str);
        })
        Handlebars.registerHelper('perc', (str: any) => {
            return this.formatPerc(str);
        })
        Handlebars.registerHelper('calcValue', (obj: any) => {
            let pricePerShare = (obj.pricePerShare) ? parseFloat(obj.pricePerShare) : parseFloat(obj.symbol.pricePerShare);
            return this.formatCurrency(parseFloat(obj.tsl) * pricePerShare)
        })

        Handlebars.registerHelper('calcCost', (obj: any) => {
            return this.formatCurrency(parseFloat(obj.cost));
        })
        Handlebars.registerHelper('formatGQL', (query : string) => {
            query = this.formatQuery(query);
            return '<a href="" class="graphQL" data-graphql="{\n\t' + query + '\n}">View GraphQL</a>'
        })
        Handlebars.registerHelper('calcPerc', (obj: any) => {
            let pricePerShare = (obj.pricePerShare) ? parseFloat(obj.pricePerShare) : parseFloat(obj.symbol.pricePerShare);

            let value = parseFloat(obj.tsl) * pricePerShare;
            let cost = parseFloat(obj.cost);
            let perc = ((value / cost) - 1);
            let className = (perc >= 0) ? 'green' : 'red';
            return '<span class="' + className + '">' + this.formatPerc(perc) + '</span>'

        })

    }

    public static formatCurrency(number: any) {
        return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(number);
    }

    public static formatPerc(number: number) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    }

    private static formatQuery(query: string) {
        if (!query) return '';
        query = query.replace(/  /g, ' ');
        query = query.replace(/"/gm, '&quot;');
        return query;
    }
}