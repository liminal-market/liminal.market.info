import Frontpage from "./ui/Frontpage";
import Wallet from "./ui/Wallet";
import Search from "./ui/Search";
import LinkHandler from "./ui/LinkHandler";
import SymbolPage from "./ui/SymbolPage";
import SymbolQuery from "./queries/SymbolQuery";
import SymbolLogic from "./queries/SymbolLogic";

export default class main {

    public static async start() {
        let frontpage = new Frontpage();
        await frontpage.render();

        let wallet = new Wallet();
        //wallet.render('0x93da645082493bbd7116fc057c5b9adfd5363912')

        let symbolPage = new SymbolPage();
        //await symbolPage.render('AAPL')

        let search = new Search();
        search.listen()

        let linkHandler = new LinkHandler();
        linkHandler.bind();

        let symbolLogic = new SymbolLogic();
        symbolLogic.init();
    }
}

main.start();

