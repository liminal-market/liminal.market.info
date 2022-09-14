import { createClient } from 'urql'
import NetworkInfo from "../NetworkInfo";

export default class OpenGraphRepository {

    url = NetworkInfo.getSubgraphUrl();

    public async execute(query:string) {
        const tokensQuery = 'query {' + query + '}';

        const client = createClient({
            url: this.url,
        })
        return await client.query(tokensQuery).toPromise().then(result=> {
            return result.data;
        })
    }

}