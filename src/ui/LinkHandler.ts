import Wallet from "./Wallet";
import SymbolPage from "./SymbolPage";

export default class LinkHandler {

    public bind() {

        let walletLinks = document.querySelectorAll('a.wallet');
        for (let i=0;i<walletLinks.length;i++) {
            walletLinks[i].addEventListener('click', async (evt) => {
                evt.preventDefault();

                let search = document.getElementById('search') as HTMLInputElement;
                if (!search) return;

                let element = evt.currentTarget as HTMLElement;
                let address = element.dataset['address']!.toString();
                search.value = address;

                let wallet = new Wallet();
                await wallet.render(address);
                window.scrollTo(0, 0);

                let linkHandler = new LinkHandler();
                linkHandler.bind();
            })
        }

        let symbolLink = document.querySelectorAll('a.symbol');
        for (let i=0;i<symbolLink.length;i++) {
            symbolLink[i].addEventListener('click', async (evt) => {
                evt.preventDefault();

                let search = document.getElementById('search') as HTMLInputElement;
                if (!search) return;

                let element = evt.currentTarget as HTMLElement;
                search.value = element.innerText;

                let symbolPage = new SymbolPage();
                await symbolPage.render(element.innerText);
                window.scrollTo(0, 0);

                let linkHandler = new LinkHandler();
                linkHandler.bind();
            })
        }

        let allSymbols = document.getElementById('allSymbols');
        if (allSymbols) {
            allSymbols.addEventListener('click', async (evt) => {
                evt.preventDefault();

                let search = document.getElementById('search') as HTMLInputElement;
                if (!search) return;

                let element = evt.currentTarget as HTMLElement;
                search.value = 'Symbols';

                let symbolPage = new SymbolPage();
                await symbolPage.render();
                window.scrollTo(0, 0);

                let linkHandler = new LinkHandler();
                linkHandler.bind();
            })
        }
    }

}