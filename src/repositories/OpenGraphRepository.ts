import { createClient } from 'urql'
import NetworkInfo from "../network/NetworkInfo";

export default class OpenGraphRepository {



    public async execute(query:string) {
        const tokensQuery = 'query {' + query + '}';

        const client = createClient({
            url: NetworkInfo.Network!.GraphQL,
        })
        return await client.query(tokensQuery).toPromise().then(result=> {
            return result.data;
        })
    }

}