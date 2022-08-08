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

        Handlebars.registerHelper('calcValue', (obj: any) => {
            if (obj.symbol) {
                return this.formatCurrency(parseFloat(obj.tsl) * parseFloat(obj.symbol.pricePerShare))
            } else {
                return this.formatCurrency(parseFloat(obj.tsl) * parseFloat(obj.pricePerShare))
            }

        })

    }

    public static formatCurrency(number : any) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
    }
}