import UserInterface from "../_Interfaces/UserInterface";
import { NoteInterface } from "../_Interfaces/NoteInterface";
import { workerInterface } from "../_Interfaces/workerInterface";
import { SkillsState } from "../_slices/skillsslice";




export default class UserClass implements UserInterface {
    key: string;
    name: string;
    time: number;
    invadersattemps: number;
    day: number;
    skills: SkillsState;
    rumors: number;
    professionformulation: '';
    notes: NoteInterface[];
    money: number;
    workers: workerInterface[];
    inventory: [];
    productionArray: [];

    constructor(key: string) {
        this.time = 360
        this.key = key;
        this.name = '';
        this.day = 0;
        this.rumors = 2.5;
        this.skills = {
            productcreationspeed: { value: 42, level: 0, price: 50 },
            priceagreementwinnings: { value: 1, level: 0, price: 60 },
            bulletspeed: { value: 300, level: 0, price: 40 },
            inventorymax: { value: 50, level: 0, price: 40 },
            workersmax: { value: 7, level: 0, price: 30 },
            invadersscale: { value: 1, level: 0, price: 40 }
        }
        this.invadersattemps = 0
        this.professionformulation = ''
        this.notes = []
        this.money = 0
        this.workers = []
        this.inventory = []
        this.productionArray = []

    }
}