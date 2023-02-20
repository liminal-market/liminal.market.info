import Search from "./ui/Search";
import LinkHandler from "./ui/LinkHandler";
import SymbolLogic from "./queries/SymbolLogic";
import Routing from "./Routing";
import NetworkInfo from "./network/NetworkInfo";
import Network from "./network/Network";

export default class main {
    static Network : Network;
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

