export default class QueryBuilder {
    constructor() {
        this.queries = [];
    }
    add(query) {
        this.queries.push(query);
    }
    getQuery() {
        let str = '';
        for (let i = 0; i < this.queries.length; i++) {
            str += this.queries[i].query + '\n';
        }
        return str;
    }
}
//# sourceMappingURL=QueryBuilder.js.map