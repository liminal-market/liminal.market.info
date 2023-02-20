import Query from "./Query";
import QueryBuilder from "./QueryBuilder";

export default class DailyDataQuery {


    public static loadLast365DataDaysNewestFirst(queryBuilder:QueryBuilder) {

        let q = `
            dailyDatas(first: 90, orderBy: date, orderDirection: desc) {
                id
                date
                value
                shares
                aUsdVolume
                txCount
                walletCount
                symbolCount
            }
        `
        let query = new Query('dailyDatas', q);
        queryBuilder.add(query);

    }
}