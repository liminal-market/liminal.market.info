import Query from "./Query";
import QueryBuilder from "./QueryBuilder";

export default class DayDataQuery {


    public static loadLast365DataDaysNewestFirst(queryBuilder:QueryBuilder, action? : (result : any) => void) {

        let q = `
            dayDatas(first: 365, orderBy: date, orderDirection: desc) {
                id
                date
                tvlUSD
                volumeUsd
                txCount
                walletCount
                symbolCount
            }
        `
        let query = new Query('dayDatas', q);
        query.action = action;

        queryBuilder.add(query);

    }
}