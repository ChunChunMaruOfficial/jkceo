import { statisticInterface } from "./statisticInterface"

export interface workerInterface {
    name: string,
    surname: string,
    age: string,
    sex: string,
    prof: string,
    imgsrc: string,
    income: number,
    efficiency: number,

    statistic: statisticInterface,

    production: { name: string, ingredients: string[] }
}
