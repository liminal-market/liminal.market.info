import QueryBuilder from "./QueryBuilder";
import Query from "./Query";

export default class UserQuery {

    public static loadUserPositionsNewestFirst(queryBuilder : QueryBuilder) {
        let str = `
  users(first: 10, orderBy: lastOrderAt, orderDirection: desc) {
    id
    orders(first: 10, orderBy: filledAt, orderDirection: desc){
      filledQty
      filledAvgPrice
      filledAt
      side
    }
    positions(orderBy:qty, orderDirection: desc) {
      symbol {
        id 
        logo
        pricePerShare
        pricePerShareWei
        priceLastUpdated
      }
      qty
      aUSDAmount
    }
  }

`
        let queue = new Query('users', str);
        queryBuilder.add(queue);
    }

}