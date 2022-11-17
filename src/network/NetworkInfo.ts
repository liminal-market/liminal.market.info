import * as net from "net";
import Network from "./Network";
import Routing from "../Routing";
import UIHelper from "../ui/UIHelper";

export default class NetworkInfo {


    public static Network: Network;

    public static load(chainId?: string | undefined) {
        if (!chainId && this.Network) return this.Network;

        let networks = this.getNetworks();
        networks.forEach((network) => {
            if (network.ChainId == chainId) {
                NetworkInfo.Network = network;
                this.setChainOption(chainId);

                let hash = location.hash;
                if (hash.indexOf('chain/' + chainId) != -1) return;

                if (hash.indexOf('chain') != -1) {
                    let splits = hash.split('/');
                    hash = splits[splits.length - 1];
                }
                hash = '/chain/' + chainId + '/' + hash;

                history.pushState('', '', '/#' + hash)
            }
        })
        if (!NetworkInfo.Network) this.load('137');
    }

    public static getNetworks() {
        let networks: Network[] = [];
        networks.push(new Network('Mumbai', '80001',
            'https://api.thegraph.com/subgraphs/name/liminal-market/liminal-market-mumbai',
            'https://f8t1vrrwtboa.usemoralis.com:2053/server/functions'))
        networks.push(new Network('Polygon', '137',
            'https://api.thegraph.com/subgraphs/name/liminal-market/liminal-market-polygon',
            'https://rokinwgcthqy.grandmoralis.com:2053/server/functions'))
        return networks;
    }

    public static setChainOption(chainId: string) {
        let selectChain = document.getElementById('select_chainId') as HTMLSelectElement;
        if (!selectChain) return;

        for (let i = 0; i < selectChain.options.length; i++) {
            if (selectChain.options[i].value == chainId) {
                selectChain.options[i].selected = true;
                return;
            }
        }
    }

    public static bindEvent(main: any) {
        let selectChain = document.getElementById('select_chainId') as HTMLSelectElement;
        let idx = selectChain.selectedIndex;
        selectChain.outerHTML = selectChain.outerHTML;
        selectChain = document.getElementById('select_chainId') as HTMLSelectElement;
        selectChain.selectedIndex = idx;

        selectChain?.addEventListener('change', async (evt) => {

            evt.preventDefault();
            this.load(selectChain!.value);

            UIHelper.clearContent();
            main.start();
        })
    }
}