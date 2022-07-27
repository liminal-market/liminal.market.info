export default class Query {
    name : string;
    query : string;
    action? : (result : any) => void;

    constructor(name : string, query : string) {
        this.name = name;
        this.query = query;
    }
}