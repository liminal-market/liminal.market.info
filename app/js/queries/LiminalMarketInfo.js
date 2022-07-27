import Query from "./Query";
export default class LiminalMarketInfo {
    getQuery() {
        let q = `{
            liminalMarketInfos {
                id
                txCount
                tvlAUSD
                tvlSymbolUSD
                userCount
                symbolCount
                lastOrderAt
            }
        }`;
        return new Query('liminalMarketInfos', q);
    }
}
//# sourceMappingURL=LiminalMarketInfo.js.map