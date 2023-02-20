import Frontpage from "./ui/Frontpage";
import SymbolPage from "./ui/SymbolPage";
import Wallet from "./ui/Wallet";
import NetworkInfo from "./network/NetworkInfo";


export default class Routing {

    settings: any = {
        show_frontpage: this.showFrontpage,
        show_symbol: this.showSymbol,
        show_wallet: this.showWallet,
    };


    public async loadRoutes() {
        let key = 'frontpage';

        let path = window.location.hash.replace('#', '').replace('/', '').replace('#close', '');
        path = this.parseChainFromPath(path);

        if (path !== '' && path.length < 8) {
            key = 'symbol'
        } else if (path !== '') {
            key = 'wallet';
        }

        let fn = this.settings['show_' + key] ?? this.settings['show_frontpage'];

        if (typeof fn === 'function') {
            await fn(this, path);
        }
    }

    public async showFrontpage(routing: Routing) {
        let frontpage = new Frontpage();
        await frontpage.render();
    }

    public async showSymbol(routing: Routing, path : string) {
        let symbolPage = new SymbolPage();
        await symbolPage.render(path)
    }

    public async showWallet(routing: Routing, path : string) {

        let wallet = new Wallet();
        await wallet.render(path)
    }


    private parseChainFromPath(path: string) {
        if (path.indexOf('chain') == -1) {
            NetworkInfo.load();
            return path;
        }

        path = path.replace('chain/', '');
        let chainId = path.substring(0, path.indexOf('/'));

        NetworkInfo.load(chainId);

        path = path.replace(chainId + '/', '');
        return path;
    }
}