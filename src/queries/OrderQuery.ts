import QueryBuilder from "./QueryBuilder";
import Query from "./Query";

export default class OrderQuery {

    public static loadNewestOrders(queryBuilder: QueryBuilder) {
        let str = `orders(first: 20, orderBy: filledAt, orderDirection: desc) {
        id 
        wallet {
            id
        },
        recipient
        symbol {
            id
            logo
        }
        side
        qty
        filledQty
        filledAvgPrice
        filledAt
        commission
    }`
        let query = new Query('orders', str);
        queryBuilder.add(query);
    }

    public static loadOrdersOnWallet(address : string, queryBuilder : QueryBuilder) {
        let str = `
            wallet(id:"` + address + `")
            {
                id
                currentAUsdBalance
                orders(first: 10, orderBy: filledAt, orderDirection: desc) {
                id
                side
                symbol {
                    id
                    logo
                }
                qty
                filledQty
                filledAvgPrice
                filledAt
            }
                positions(orderBy: qty, orderDirection: desc) {
                id
                symbol {
                    id
                    logo
                    pricePerShare
                    priceLastUpdated
                    contract
                    tvl
                }
                qty
                aUSDAmount
            }
            }
        `;

        let query = new Query('wallet', str);
        queryBuilder.add(query);

    }
}