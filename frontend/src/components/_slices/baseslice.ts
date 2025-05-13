import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'


export interface NoteInterface {
    title: string,
    text: string
}
export interface statisticInterface {
    drawers: { value: number, level: number, maxlevel: number },
    lamp: { value: number, level: number, maxlevel: number },
    mug: { value: number, level: number, maxlevel: number },
    table: { value: number, level: number, maxlevel: number }
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

    statistic: statisticInterface
}

export interface BaseState {
    name: string,
    professionformulation: string,
    money: number,
    notes: NoteInterface[],
    messengerrange: number,
    rumorsstatus: number,
    workersarray: worker[],
    goodsPerHour: number,
    productionArray: number[],
}

const initialState: BaseState = {
    name: '',
    professionformulation: '',
    money: -1,
    notes: [],
    messengerrange: 1,
    rumorsstatus: 0,
    goodsPerHour: 1,
    productionArray: [2, 4, 6, 10, 3, 12, 4, 5, 6], //все переменные, что хранятся в слайсе

    workersarray: [] //уже имеющееся работники
}

export const BaseSlice = createSlice({
    name: 'base',
    initialState,
    reducers: {
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
            axios.post('http://localhost:3001/addnewnote', { note: action.payload })

        },
        addproductionArray: (state, action) => {
            state.productionArray[action.payload] = state.productionArray[action.payload] ? state.productionArray[action.payload] + 1 : 1
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
            workersstatistic.maxlevel < workersstatistic.level ? workersstatistic.level += 1 : ''
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
        },
    },
})

export const { setmoney, setprofessionformulation, setname, addnewnote, deletecurrentnote, addproductionArray, addworker, upgradestatistic } = BaseSlice.actions //все методы сюда импортировать:3

export default BaseSlice.reducer

