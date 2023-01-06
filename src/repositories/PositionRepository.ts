import Network from "../network/Network";
import NetworkInfo from "../network/NetworkInfo";

export default class PositionRepository {

    constructor() {

    }

    public async getUserPositions(address : string) {
        let network = NetworkInfo.Network!;
        let url = network.ServerUrl + '/positions?address=' + address + '&chainId=' + network.ChainId;

        return (await (await fetch(url, {
            method: 'GET'
        })).json()).result;


    }

}