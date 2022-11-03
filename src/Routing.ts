import Frontpage from "./ui/Frontpage";
import SymbolPage from "./ui/SymbolPage";
import Wallet from "./ui/Wallet";


export default class Routing {

    settings: any = {
        show_frontpage: this.showFrontpage,
        show_symbol: this.showSymbol,
        show_wallet: this.showWallet,
    };


    public async loadRoutes() {
        let key = 'frontpage';
        let path = window.location.hash.replace('#', '').replace('/', '');

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


}