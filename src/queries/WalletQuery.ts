import QueryBuilder from "./QueryBuilder";
import Query from "./Query";

export default class WalletQuery {

    public static loadWalletPositionsNewestFirst(queryBuilder: QueryBuilder) {
        let str = `
  wallets(first: 10, orderBy: lastOrderAt, orderDirection: desc) {
    id
    orders(first: 10, orderBy: filledAt, orderDirection: desc){
      filledQty
      filledAvgPrice
      filledAt
      side
    }
    positions(orderBy:tsl, orderDirection: desc) {
      symbol {
        id 
        logo
        pricePerShare
        pricePerShareWei
        priceLastUpdated
      }
      tsl
    }
  }

`
        let queue = new Query('wallets', str);
        queryBuilder.add(queue);
    }

    public static loadHistory(address: string, queryBuilder: QueryBuilder) {
        let str = `
            walletHistories
                (where:{wallet:"` + address.toLowerCase() + `"}
                orderBy: created
                orderDirection: desc)
            {
                id
                wallet {
                    id
                }
                balance
                balanceWei
                diff
                diffWei
                actionName
                created
                createdISO
            }
       `;
        let queue = new Query('walletHistory', str);
        queryBuilder.add(queue);

    }

}