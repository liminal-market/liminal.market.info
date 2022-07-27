var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class OpenGraphRepository {
    constructor() {
        this.url = 'https://api.thegraph.com/subgraphs/name/liminal-market/liminal-market';
    }
    getQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = '{"query": {' + query + '}}';
            let result = yield fetch(this.url, {
                method: 'POST',
                headers: {
                    contentType: 'application/json'
                },
                body: body
            });
            return yield result.json();
        });
    }
}
//# sourceMappingURL=OpenGraphRepository.js.map