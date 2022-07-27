import Frontpage from "./ui/Frontpage";

export default class main {

    public static start() {
        let frontpage = new Frontpage();
        frontpage.render();
    }
}

main.start();

