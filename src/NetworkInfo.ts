import * as net from "net";

export default class NetworkInfo {
    public static Mumbai = 'mumbai';
    public static Fuji = 'fuji';
    public static Network = NetworkInfo.Mumbai;

    public static load(network?: string | undefined) {

        NetworkInfo.Network = NetworkInfo.Mumbai;

    }

    public static getSubgraphUrl() {
        if (NetworkInfo.Network == NetworkInfo.Mumbai) {
            return 'https://api.thegraph.com/subgraphs/name/liminal-market/liminal-market-mumbai';
        } else {
            return 'https://api.thegraph.com/subgraphs/name/liminal-market/liminal-market-fuji';
        }
    }
}