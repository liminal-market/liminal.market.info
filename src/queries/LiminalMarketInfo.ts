import Query from "./Query";
import QueryBuilder from "./QueryBuilder";

export default class LiminalMarketInfo {


    public static loadLiminalMarketInfo(queryBuilder: QueryBuilder, action? : (result : any) => void) {
        let q = `
            liminalMarketInfos {
                  id
                  txCount
                  orderExecutedCount
                  orderFailedCount
                  spenderCount
                  walletCount
                  symbolCount
                  balanceWei
                  balance
                  valueWei
                  value
                  tslWei
                  tsl
                  lastOrderAt
            }
        `;
        let query = new Query('liminalMarketInfos', q);
        query.action = action;
        queryBuilder.add(query);


    }

}