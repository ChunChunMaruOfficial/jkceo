import { NoteInterface } from "./NoteInterface";
import { workerInterface } from "./workerInterface";


export default interface UserInterface {
    key: string
    name: string,
    invadersattemps: number;
    professionformulation: string,
    notes: NoteInterface[],
    money: number,
    workers: workerInterface[],
    inventory: [],
    productionArray: [],
}