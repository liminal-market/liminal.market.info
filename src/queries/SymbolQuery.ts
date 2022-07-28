import Query from "./Query";
import QueryBuilder from "./QueryBuilder";
import BaseQuery from "./BaseQuery";

export default class SymbolQuery extends BaseQuery {

    public static loadMostPopular(queryBuilder : QueryBuilder) {

        let query = new Query('symbols',
            `symbols (first:10, orderBy: tvl, orderDirection:desc) {
                                id
                                logo
                                pricePerShare
                                pricePerShareWei
                                priceLastUpdated
                                tvl
                                tvlUsd
                            }`);

        queryBuilder.add(query);
    }

    public static loadBySymbolId(symbol : string, queryBuilder : QueryBuilder) {
        let query = new Query('symbol',
            `symbol(id:"` + symbol.toUpperCase() +`") {
            id
            logo
            pricePerShare
            pricePerShareWei
            priceLastUpdated
            tvl
            tvlWei
            tvlUsd
            tvlUsdWei
            contract
            wallets {
              id
            }
        }`);
        queryBuilder.add(query);
    }

    public static loadBySymbols(queryBuilder : QueryBuilder, first = 20, skip = 0) {
        let query = new Query('symbols',
            `symbols(first:` + first + `, skip:` + skip + `, orderBy:"tvl", orderDirection:"desc") {
            id
            logo
            pricePerShare
            pricePerShareWei
            priceLastUpdated
            tvl
            tvlWei
            tvlUsd
            tvlUsdWei
            contract
        }`);
        queryBuilder.add(query);
    }

    public static async loadAllSymbols(queryBuilder? : QueryBuilder) {
        let query = new Query('symbols',
            `symbols {
            id           
        }`);
        if (queryBuilder) {
            queryBuilder.add(query);
        } else {
            return await super.run(query);
        }
    }
    public static async getAllSymbols() {
        return (await this.loadAllSymbols()).symbols;
    }

}