import LiminalMarketInfo from "../queries/LiminalMarketInfo";
import DayDataQuery from "../queries/DayDataQuery";
import OpenGraphRepository from "../repositories/OpenGraphRepository";
import QueryBuilder from "../queries/QueryBuilder";

export default class Frontpage {


    public render() {
        let queryBuilder = new QueryBuilder();

        let liminalMarketInfo = new LiminalMarketInfo();
        let lmInfoQuery = liminalMarketInfo.getQuery();
        lmInfoQuery.action = (result) => {
            this.renderLiminalInfo(result);
        }
        queryBuilder.add(lmInfoQuery);

        let dayDataQuery = new DayDataQuery();
        let dayData = dayDataQuery.getQuery();
        dayData.action = (result) => {
            this.renderDayData(result);
        }
        queryBuilder.add(dayData);

        let openGraphRepository = new OpenGraphRepository();
        let result = openGraphRepository.getQuery(queryBuilder.getQuery())
    }

    public renderLiminalInfo(liminalMarketInfo: any) {

    }

    public renderDayData(dayData: any) {

    }
}