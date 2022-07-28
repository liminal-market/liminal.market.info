import SymbolQuery from "./SymbolQuery";

export default class SymbolLogic {

    static Symbols : string[];

    public async init() {
        if (SymbolLogic.Symbols) return;
        SymbolLogic.Symbols = [];
        let symbol : any;
        let symbols = await SymbolQuery.getAllSymbols();
        for (let i=0;i<symbols.length;i++) {
            symbol = symbols[i];
            SymbolLogic.Symbols.push(symbol.id);
        }
        let i = 0;
    }

    public static isSymbol(str : string) : boolean {
       return SymbolLogic.Symbols.indexOf(str.toUpperCase()) != -1;
    }


}