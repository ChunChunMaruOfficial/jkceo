import { NoteInterface } from "./NoteInterface";
import { workerInterface } from "./workerInterface";
export default interface UserInterface {
    key: string
    name: string,
    professionformulation: string,
    notes: NoteInterface[],
    money: number,
    workers: workerInterface[],
    inventory: [],
    productionArray: [],
}