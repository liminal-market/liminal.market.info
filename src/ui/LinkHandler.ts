import Wallet from "./Wallet";
import SymbolPage from "./SymbolPage";
import CopyHelper from "./CopyHelper";
import NetworkInfo from "../network/NetworkInfo";

export default class LinkHandler {

    public bind() {

        let walletLinks = document.querySelectorAll('a.wallet');
        for (let i = 0; i < walletLinks.length; i++) {
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

                history.pushState(null, '', '#/' + address);

                let linkHandler = new LinkHandler();
                linkHandler.bind();
            })
            let address = (walletLinks[i] as HTMLElement).dataset['address']!.toString();

            walletLinks[i].parentElement!.insertAdjacentHTML("beforeend", '&nbsp;<a href="" data-copy="' + address + '" class="copy" data-tooltip="Copy address"><img src="./img/copy.png" /></a>');

        }

        let symbolLink = document.querySelectorAll('a.symbol');
        for (let i = 0; i < symbolLink.length; i++) {
            symbolLink[i].addEventListener('click', async (evt) => {
                evt.preventDefault();

                let search = document.getElementById('search') as HTMLInputElement;
                if (!search) return;

                let element = evt.currentTarget as HTMLElement;
                search.value = element.innerText;

                let symbolPage = new SymbolPage();
                await symbolPage.render(element.innerText);
                window.scrollTo(0, 0);

                history.pushState(null, '', '#/' + element.innerText);

                let linkHandler = new LinkHandler();
                linkHandler.bind();
            })
        }
        let graphQLs = document.querySelectorAll('.graphQL');
        for (let i = 0; i < graphQLs.length; i++) {
            graphQLs[i].addEventListener('click', async (evt) => {
                evt.preventDefault();

                let modal = document.getElementById('modal') as HTMLElement;
                if (!modal) return;

                modal.addEventListener('click', (evt) => {

                    if ((evt.target as HTMLElement).id == 'modal') {
                        evt.preventDefault();
                        evt.stopPropagation();

                        modal.removeAttribute('open');
                    }
                })

                let pre = document.getElementById('graphQLArea') as HTMLTextAreaElement;
                if (!pre) return;
                let graphQL = (evt.target as HTMLElement).dataset['graphql']!;
                pre.innerText = graphQL;
                let copyLink = document.getElementById('copyGraphQL')!;
                copyLink!.addEventListener('click', (evt) => {
                    evt.preventDefault();

                    let copyHelper = new CopyHelper();
                    copyHelper.copyTextToClipboard(graphQL);
                    copyLink.dataset['tooltip'] = 'Copied!';
                    setTimeout(() => {
                        copyLink.dataset['tooltip'] = 'Copy GraphQL';
                        copyLink.blur();
                    }, 2000)
                })
                let subgraph_urls = document.querySelectorAll('.subgraph_url');
                subgraph_urls.forEach((element) => {
                    element.setAttribute('href', NetworkInfo.Network.GraphQLPlayground);
                })
                modal.setAttribute('open', '');
            });
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

        let copyLinks = document.querySelectorAll('a.copy');
        Array.from(copyLinks).forEach((element) => {
            element.addEventListener('click', async (evt) => {
                evt.preventDefault();

                let e = element as HTMLElement;
                await this.copyFunction(e);
                e.dataset['tooltip'] = 'Copied!';
                setTimeout(() => {
                    e.dataset['tooltip'] = 'Copy address';
                    e.blur();
                }, 2000);
            });
        })
    }

    public async copyFunction(element: HTMLElement) {
        let str = element.dataset['copy']!.toString();
        let copyHelper = new CopyHelper();
        if (!await copyHelper.copyTextToClipboard(str)) {
            prompt('Could not copy, this is the address', str)
        }
    }

}