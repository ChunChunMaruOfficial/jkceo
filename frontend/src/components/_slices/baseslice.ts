import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'


export interface NoteInterface {
    title: string,
    text: string
}
export interface statisticInterface {
    drawers: { value: number, level: number, maxlevel: number }, //кулдаун
    lamp: { value: number, level: number, maxlevel: number },
    mug: { value: number, level: number, maxlevel: number },
    table: { value: number, level: number, maxlevel: number } // скорость производства
}

export interface worker {
    name: string,
    surname: string,
    age: string,
    sex: string,
    prof: string,
    imgsrc: string,
    income: number,
    efficiency: number,

    statistic: statisticInterface,

    production: string
}

export interface BaseState {
    day: number,
    name: string,
    professionformulation: string,
    money: number,
    notes: NoteInterface[],
    messengerrange: number,
    rumorsstatus: number,
    workersarray: worker[],
    goodsPerHour: number,
    productionArray: number[],
    inventory: { name: string, count: number }[]
}

const initialState: BaseState = {
    day: 0,

    name: '',
    professionformulation: '',
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
            state.notes = state.notes.filter(v => v.text !== action.payload.text);
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
            const [id, production]: [number, string] = action.payload;
            state.workersarray[id].production = production
        },
        addtoinventory: (state, action): void => {
            state.inventory.some(v => v.name == action.payload) ? state.inventory.map(v => (v.name == action.payload ? v.count += 1 : v.count)) : state.inventory.push({ name: action.payload, count: 1 })
            state.productionArray[state.day] = state.productionArray[state.day] ? state.productionArray[state.day] + 1 : 1
        },
        updaterumorsstatus: (state, action): void => {
            state.rumorsstatus += action.payload
        }
    },
})

export const { newday, setmoney, setprofessionformulation, setname, addnewnote, deletecurrentnote, addworker, upgradestatistic, setproduction, addtoinventory, updaterumorsstatus } = BaseSlice.actions //все методы сюда импортировать:3

export default BaseSlice.reducer

