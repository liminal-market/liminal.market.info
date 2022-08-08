import Query from "./Query";

export default class QueryBuilder {

    queries : Query[];

    constructor() {
        this.queries = [];
    }

    public add(query : Query) {
        this.queries.push(query);
    }

    public getQuery() {
        let str = '';
        for (let i=0;i<this.queries.length;i++) {
            str += this.queries[i].query + '\n';
        }
        return str;
    }

    public getQueryByName(name : string) {
        for (let i=0;i<this.queries.length;i++) {
            if (this.queries[i].name == name) return this.queries[i].query;
        }
    }

}