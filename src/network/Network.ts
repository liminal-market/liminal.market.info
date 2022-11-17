export default class Network {
    Name = "";
    ChainId = "";
    GraphQL = "";
    ServerUrl = "";

    constructor(name : string, chainId : string, graphQl : string, serverUrl : string) {
        this.Name = name;
        this.ChainId = chainId;
        this.GraphQL = graphQl;
        this.ServerUrl = serverUrl;
        this.ServerUrl = 'https://pkkenhl7syns.grandmoralis.com:2053/server/functions';
    }
}