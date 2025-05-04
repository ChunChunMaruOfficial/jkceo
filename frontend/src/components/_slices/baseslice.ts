import { createSlice } from '@reduxjs/toolkit'

export interface BaseState {
    name: string,
    professionformulation: string,
    money: number,
    messengerrange: number,
    rumorsstatus: number,
    workers: number,
    goodsPerHour: number,
    productionArray: number[],

}

const initialState: BaseState = {
    name: '',
    professionformulation:'',
    money: 534,
    messengerrange: 1,
    rumorsstatus: 0,
    workers: 6,
    goodsPerHour: 1,
    productionArray: [3, 4, 5, 6, 7, 2, 6, 1, 9] //все переменные, что хранятся в слайсе
}

export const BaseSlice = createSlice({
    name: 'base',
    initialState,
    reducers: {
        increment: (state) => {
            //    state.value += 1
        },
        setprofessionformulation: (state, value) => { //формулировка профессии
            state.professionformulation = value.payload
        },
        setmoney: (state, value) => {
            state.money = value.payload
        },
        setname: (state, value) => {
            state.name = value.payload
        }
    },
})

export const { increment, setmoney,setprofessionformulation,setname } = BaseSlice.actions //все методы сюда импортировать:3

export default BaseSlice.reducer

