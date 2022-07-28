import moment from "moment";

export default class UIHelper {
    public static addToTopContent(content: string) {
        let topGrid = document.getElementById('topGrid')!;
        topGrid.innerHTML += content;
    }
    public static appendToMiddleGrid(content: string) {
        let middleGrid = document.getElementById('middleGrid')!;
        middleGrid.innerHTML += content;
    }

    public static clearContent() {
        let topGrid = document.getElementById('topGrid')!;
        topGrid.innerHTML = '';

        let middleGrid = document.getElementById('middleGrid')!;
        middleGrid.innerHTML = '';
    }

    public static registerHandlebarHelpers() {
        Handlebars.registerHelper('formatDate', (timestamp: string) => {
            let date = new Date(parseFloat(timestamp));
            let m = moment(date)
            return m.fromNow();
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
            if (obj.qty) {
                return this.formatCurrency(parseFloat(obj.qty) * parseFloat(obj.symbol.pricePerShare))
            } else {
                return this.formatCurrency(parseFloat(obj.tvl) * parseFloat(obj.pricePerShare))
            }
        })

    }

    public static formatCurrency(number : any) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
    }
}