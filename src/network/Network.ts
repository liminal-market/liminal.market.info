export default class Network {
    Name = "";
    ChainId = "";
    GraphQL = "";
    ServerUrl = "";
    GraphQLPlayground = ''

    constructor(name : string, chainId : string, graphQl : string, graphQlPlayground : string, serverUrl : string) {
        this.Name = name;
        this.ChainId = chainId;
        this.GraphQL = graphQl;
        this.ServerUrl = serverUrl;
        this.ServerUrl = 'https://cloud-mainnet.onrender.com';
        this.GraphQLPlayground = graphQlPlayground;
    }
}