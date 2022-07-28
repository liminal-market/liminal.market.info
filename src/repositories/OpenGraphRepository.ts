import { createClient } from 'urql'

export default class OpenGraphRepository {

    url = 'https://api.thegraph.com/subgraphs/name/liminal-market/liminal-market';

    public async getQuery(query: string) {
        let body = '{' + query + '}'
        let result = await fetch(this.url, {
            method: 'POST',
            headers: {
                contentType: 'application/json',
                secFetchDest: 'empty',
                secFetchMode: 'cors',
                secFetchSite: 'cross-site',
                secGpc: '1',
                accessControlRequestHeaders: 'contenttype,secfetchdest,secfetchmode,secfetchsite,secgpc',
                accessControlRequestMethod:'POST'
            },
            mode: 'cors',

            body:body
        });

        return await result.json();

    }

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