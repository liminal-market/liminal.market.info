import { createClient } from 'urql'

export default class OpenGraphRepository {

    url = 'https://api.thegraph.com/subgraphs/name/liminal-market/liminal-market';

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