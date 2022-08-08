import Query from "./Query";
import QueryBuilder from "./QueryBuilder";

export default class LiminalMarketInfo {


    public static loadLiminalMarketInfo(queryBuilder: QueryBuilder, action? : (result : any) => void) {
        let q = `
            liminalMarketInfos {
                id
                walletCount
                symbolCount                
                txCount
                lastOrderAt
                cash
                cost
                value
            }
        `;
        let query = new Query('liminalMarketInfos', q);
        query.action = action;
        queryBuilder.add(query);


    }

}