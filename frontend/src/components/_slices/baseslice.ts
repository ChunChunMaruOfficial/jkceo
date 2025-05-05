import { createSlice } from '@reduxjs/toolkit'

export interface NoteInterface {
    title: string,
    text: string
}

export interface BaseState {
    name: string,
    professionformulation: string,
    money: number,
    notes: NoteInterface[],
    messengerrange: number,
    rumorsstatus: number,
    workers: number,
    goodsPerHour: number,
    productionArray: number[],

}

const initialState: BaseState = {
    name: '',
    professionformulation: '',
    money: 534,
    notes: [],
    messengerrange: 1,
    rumorsstatus: 0,
    workers: 6,
    goodsPerHour: 1,
    productionArray: [] //все переменные, что хранятся в слайсе
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
        },
        setname: (state, action) => {
            state.name = action.payload
        },
        addnewnote: (state, action) => {
            state.notes.push(action.payload)
        },
        addproductionArray: (state, action) => {
            state.productionArray[action.payload] = state.productionArray[action.payload] ? state.productionArray[action.payload] + 1 : 1
        },
        deletecurrentnote: (state, action) => {
            state.notes = state.notes.filter(v => v.text !== action.payload.text);
            console.log(action.payload);
            console.log(state.notes);
            
        },
    },
})

export const { setmoney, setprofessionformulation, setname, addnewnote, deletecurrentnote,addproductionArray } = BaseSlice.actions //все методы сюда импортировать:3

export default BaseSlice.reducer

