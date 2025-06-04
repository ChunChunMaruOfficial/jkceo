import { NoteInterface } from "./NoteInterface";
import { workerInterface } from "./workerInterface";
import { SkillsState } from "../_slices/skillsslice";

export default interface UserInterface {
    key: string
    name: string,
    day: number,
    skills: SkillsState;
    invadersattemps: number;
    professionformulation: string,
    notes: NoteInterface[],
    money: number,
    workers: workerInterface[],
    inventory: [],
    productionArray: [],
}