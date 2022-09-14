import * as net from "net";

export default class NetworkInfo {
    public static Mumbai = 'mumbai';
    public static Fuji = 'fuji';
    public static Network = NetworkInfo.Mumbai;

    public static load(network?: string | undefined) {
        if (network) {
            NetworkInfo.Network = network;
        } else if (window.location.hash.indexOf('fuji') != -1) {
            NetworkInfo.Network = NetworkInfo.Fuji;
        }

        let chainSelector = document.getElementById('chainSelector') as HTMLSelectElement;
        chainSelector.value = NetworkInfo.Network;

        let subgraphUrls = document.querySelectorAll('.subgraph_url');
        for (let i=0;i<subgraphUrls.length;i++) {
            (subgraphUrls[i] as HTMLAnchorElement).href = NetworkInfo.getSubgraphUrl();
        }
    }

    public static getSubgraphUrl() {
        if (NetworkInfo.Network == NetworkInfo.Mumbai) {
            return 'https://api.thegraph.com/subgraphs/name/liminal-market/liminal-market-mumbai';
        } else {
            return 'https://api.thegraph.com/subgraphs/name/liminal-market/liminal-market-fuji';
        }
    }
}