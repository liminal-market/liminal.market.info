import Query from "./Query";

export default class LiminalMarketInfo {


    public getQuery() {
        let q = `
            liminalMarketInfos {
                id
                txCount
                tvlAUSD
                tvlSymbolUSD
                userCount
                symbolCount
                lastOrderAt
            }
        `;
        return new Query('liminalMarketInfos', q)


    }

}