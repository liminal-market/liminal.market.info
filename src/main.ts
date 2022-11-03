import Frontpage from "./ui/Frontpage";
import Wallet from "./ui/Wallet";
import Search from "./ui/Search";
import LinkHandler from "./ui/LinkHandler";
import SymbolPage from "./ui/SymbolPage";
import SymbolQuery from "./queries/SymbolQuery";
import SymbolLogic from "./queries/SymbolLogic";
import NetworkInfo from "./NetworkInfo";
import UIHelper from "./ui/UIHelper";
import Routing from "./Routing";

export default class main {

    public static async start() {
        NetworkInfo.load();
        let chainSelector = document.getElementById('chainSelector');
        if (chainSelector) {
            chainSelector.addEventListener('change', async (evt) => {
                let input = evt.target as HTMLSelectElement;
                NetworkInfo.load(input.value);
                UIHelper.clearContent();

                let frontpage = new Frontpage();
                await frontpage.render();
            })
        }

        let routing = new Routing();
        await routing.loadRoutes();

        let search = new Search();
        search.listen()

        let linkHandler = new LinkHandler();
        linkHandler.bind();

        let symbolLogic = new SymbolLogic();
        symbolLogic.init();
    }
}

main.start();

