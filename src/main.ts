import Search from "./ui/Search";
import LinkHandler from "./ui/LinkHandler";
import SymbolLogic from "./queries/SymbolLogic";
import Routing from "./Routing";
import NetworkInfo from "./network/NetworkInfo";

export default class main {

    public static async start() {


        let routing = new Routing();
        await routing.loadRoutes();

        NetworkInfo.bindEvent(this);

        let search = new Search();
        search.listen()

        let linkHandler = new LinkHandler();
        linkHandler.bind();

        let symbolLogic = new SymbolLogic();
        symbolLogic.init();
    }
}

main.start();

