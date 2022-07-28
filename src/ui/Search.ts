import Wallet from "./Wallet";
import Frontpage from "./Frontpage";
import LinkHandler from "./LinkHandler";
import UIHelper from "./UIHelper";
import SymbolPage from "./SymbolPage";
import SymbolLogic from "../queries/SymbolLogic";

export default class Search {

    public listen() {

        let search = document.getElementById('search');
        if (!search) return;

        search.addEventListener('keyup', async (evt) => {
            let input = evt.target as HTMLInputElement;
            if (input.value.length == 42) {
                let wallet = new Wallet();
                await wallet.render(input.value);

                let linkHandler = new LinkHandler();
                linkHandler.bind();

                evt.preventDefault();
                evt.stopPropagation();
            }


            if (SymbolLogic.isSymbol(input.value)) {
                let symbolPage = new SymbolPage();
                await symbolPage.render(input.value);

                evt.preventDefault();
                evt.stopPropagation();

                let linkHandler = new LinkHandler();
                linkHandler.bind();
            }

            if (input.value.toLowerCase() == 'symbols') {
                let symbolPage = new SymbolPage();
                await symbolPage.render();
                window.scrollTo(0, 0);

                let linkHandler = new LinkHandler();
                linkHandler.bind();
            }

            if (input.value.length == 0) {
                UIHelper.clearContent();

                let frontPage = new Frontpage();
                await frontPage.render();

                let linkHandler = new LinkHandler();
                linkHandler.bind();
            }


        })

    }


}