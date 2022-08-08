import QueryBuilder from "./QueryBuilder";
import Query from "./Query";

export default class WalletQuery {

    public static loadWalletPositionsNewestFirst(queryBuilder : QueryBuilder) {
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
      cost
    }
  }

`
        let queue = new Query('wallet', str);
        queryBuilder.add(queue);
    }

}