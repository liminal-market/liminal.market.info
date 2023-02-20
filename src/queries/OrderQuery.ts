import QueryBuilder from "./QueryBuilder";
import Query from "./Query";

export default class OrderQuery {
    static properies = `
        id 
        wallet {
            id
        },
        symbol {
            id
            logo
        }
        side
        tsl
        filledQty
        filledAvgPrice
        filledAt
        serviceFee`;


    public static loadNewestOrders(queryBuilder: QueryBuilder) {
        let str = `orders(first: 20, orderBy: filledAt, orderDirection: desc) {` + this.properies + `}`;

        let query = new Query('orders', str);
        queryBuilder.add(query);
    }
    public static loadNewestOrdersBySymbol(queryBuilder: QueryBuilder, symbol : string) {
        let str = `orders(where :{ symbol:"` + symbol.toUpperCase() + `"} first: 20, orderBy: filledAt, orderDirection: desc) {` + this.properies + `}`;

        let query = new Query('orders', str);
        queryBuilder.add(query);
    }
    public static loadOrdersOnWallet(address : string, queryBuilder : QueryBuilder) {
        let str = `
            wallet(id:"` + address.toLowerCase() + `")
            {
                id
                balance
                orders(first: 10, orderBy: filledAt, orderDirection: desc) {
                id
                side
                symbol {
                    id
                    logo
                }
                tsl
                filledQty
                filledAvgPrice
                filledAt
            }
                positions(orderBy: tsl, orderDirection: desc) {
                id
                symbol {
                    id
                    logo
                    pricePerShare
                    priceLastUpdated
                    contract
                    tsl
                }
                tsl
                tslWei
            }
            }
        `;

        let query = new Query('wallet', str);
        queryBuilder.add(query);

    }
}