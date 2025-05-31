import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { statisticInterface } from '../_Interfaces/statisticInterface'
import { NoteInterface } from '../_Interfaces/NoteInterface'
import { workerInterface } from '../_Interfaces/workerInterface'


export interface BaseState {
    day: number,
    name: string,
    professionformulation: string,
    mainproduct: string[],
    money: number,
    notes: NoteInterface[],
    messengerrange: number,
    rumorsstatus: number,
    workersarray: workerInterface[],
    goodsPerHour: number,
    productionArray: number[],
    inventory: { name: string, count: number }[]
}

const initialState: BaseState = {
    day: 0,
    name: '',
    professionformulation: '',
    mainproduct: [],
    money: -1,
    notes: [],
    messengerrange: 1,
    rumorsstatus: 2.5,
    goodsPerHour: 1,
    productionArray: [], //все переменные, что хранятся в слайсе
    workersarray: [], //уже имеющееся работники
    inventory: []
}

export const BaseSlice = createSlice({
    name: 'base',
    initialState,
    reducers: {

        newday: (state) => {
            state.day++
        },
        setprofessionformulation: (state, action) => { //формулировка профессии
            state.professionformulation = action.payload
        },
        setmoney: (state, action) => {
            state.money = action.payload
            axios.post('http://localhost:3001/setmoney', { money: action.payload })
        },
        setname: (state, action) => {
            state.name = action.payload
        },
        addnewnote: (state, action) => {
            state.notes.push(action.payload)
        },

        deletecurrentnote: (state, action) => {
            const [title, price]: [string, number] = action.payload;
            state.notes = state.notes.filter(v => v.title !== title || v.price != price);
            axios.post('http://localhost:3001/deletecurrentnote', { note: action.payload })
        },
        addworker: (state, action): void => {
            state.workersarray.push(action.payload)
        },
        upgradestatistic: (state, action): void => {
            const [id, characteristic]: [number, string] = action.payload;
            const workersstatistic = state.workersarray[id].statistic[characteristic as keyof statisticInterface];
            if (workersstatistic.maxlevel > workersstatistic.level) {
                workersstatistic.maxlevel > workersstatistic.level ? workersstatistic.level += 1 : ''

                switch (characteristic) {
                    case 'table':
                    case 'drawers':
                        workersstatistic.value -= workersstatistic.value * 0.05
                        break;
                    case 'lamp':
                        workersstatistic.value += 1
                        break;
                    case 'mug':
                        workersstatistic.value -= 1
                        break;
                }
                axios.post('http://localhost:3001/updateworkerstat', { index: id, worker: state.workersarray[id] })
            }
        },

        setproduction: (state, action): void => {
            const [id, production, ingredients]: [number, string, string[]] = action.payload;
            state.workersarray[id].production.name = production
            state.workersarray[id].production.ingredients = ingredients
        },
        setmainproduct: (state, action): void => {
            state.mainproduct.push(action.payload)
            console.log(state.mainproduct);

        },
        addtoinventory: (state, action): void => {
            const [product, income]: [string, boolean] = action.payload;
            state.inventory.some(v => v.name == product) ? state.inventory.map(v => (v.name == product ? v.count += 1 : v.count)) : state.inventory.push({ name: product, count: 1 })
            income && (state.productionArray[state.day] = state.productionArray[state.day] ? state.productionArray[state.day] + 1 : 1);
        },
        setinventory: (state, action): void => {
            state.inventory = action.payload
        },
        removefrominventory: (state, action) => {
            const itemName = action.payload;
            const item = state.inventory.find(v => v.name === itemName);
            if (item) {
                if (item.count > 1) {
                    item.count -= 1;
                } else {
                    state.inventory = state.inventory.filter(v => v.name !== itemName);
                }
            }
            axios.post('http://localhost:3001/removefrominventory', { item: action.payload })
        },
        updaterumorsstatus: (state, action): void => {
            state.rumorsstatus += action.payload
        },

    },
})

export const { newday, setmoney, setprofessionformulation, setname, addnewnote, deletecurrentnote, addworker, upgradestatistic, setproduction, addtoinventory, updaterumorsstatus, removefrominventory, setmainproduct, setinventory } = BaseSlice.actions //все методы сюда импортировать:3

export default BaseSlice.reducer

