import Query from "./Query";
import QueryBuilder from "./QueryBuilder";

export default class DailyDataQuery {


    public static loadLast365DataDaysNewestFirst(queryBuilder:QueryBuilder, action? : (result : any) => void) {

        let q = `
            dailyDatas(first: 365, orderBy: date, orderDirection: desc) {
                id
                date
                value
                shares
                txCount
                walletCount
                symbolCount
            }
        `
        let query = new Query('dailyDatas', q);
        query.action = action;

        queryBuilder.add(query);

    }
}