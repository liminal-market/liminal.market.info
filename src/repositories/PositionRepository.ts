import Network from "../network/Network";
import NetworkInfo from "../network/NetworkInfo";

export default class PositionRepository {

    constructor() {

    }

    public async getUserPositions(address : string) {
        let network = NetworkInfo.Network!;
        let url = network.ServerUrl + '/positions';
        let chainId = network.ChainId;
        let obj : any = {
            address, chainId
        }

        return (await (await fetch(url, {
            method: 'POST',
            body : JSON.stringify(obj)
        })).json()).result;


    }

}