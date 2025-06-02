import UserInterface from "../_Interfaces/UserInterface";
import { NoteInterface } from "../_Interfaces/NoteInterface";
import { workerInterface } from "../_Interfaces/workerInterface";

export default class UserClass implements UserInterface {
    key: string;
    name: string;
    invadersattemps: number;
    professionformulation: '';
    notes: NoteInterface[];
    money: number;
    workers: workerInterface[];
    inventory: [];
    productionArray: [];

    constructor(key: string) {
        this.key = key;
        this.name = ''
        this.invadersattemps = 0
        this.professionformulation = ''
        this.notes = []
        this.money = 0
        this.workers = []
        this.inventory = []
        this.productionArray = []
        
    }
}