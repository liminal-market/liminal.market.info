export default class Network {
    Name = "";
    ChainId = "";
    GraphQL = "";

    constructor(name : string, chainId : string, graphQl : string) {
        this.Name = name;
        this.ChainId = chainId;
        this.GraphQL = graphQl;
    }
}