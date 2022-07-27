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

}