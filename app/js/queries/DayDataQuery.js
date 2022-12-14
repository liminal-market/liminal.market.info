import Query from "./Query";
export default class DayDataQuery {
    getQuery() {
        let q = `{
            dayDatas(first: 365, orderBy: date, orderDirection: desc) {
                id
                date
                tvlUSD
                volumeUsd
                txCount
                userCount
                symbolCount
            }
        }`;
        let query = new Query('dayDatas', q);
        return query;
    }
}
//# sourceMappingURL=DayDataQuery.js.map