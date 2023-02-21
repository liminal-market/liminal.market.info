import QueryBuilder from "./QueryBuilder";
import Query from "./Query";

export default class ServiceContractsQuery {

    public static loadServiceContracts(queryBuilder: QueryBuilder) {
        let str = ` 
  serviceContracts (where:{totalServiceFeeWei_gt:0}) {
    id
    owner
    contractAddress
    serviceFeeAddress
    serviceFeePoints
    txCount
    orderExecutedCount
    orderFailedCount
    totalServiceFeeWei
    totalServiceFee
    name
    url
  }

`
        let queue = new Query('serviceContracts', str);
        queryBuilder.add(queue);
    }


}