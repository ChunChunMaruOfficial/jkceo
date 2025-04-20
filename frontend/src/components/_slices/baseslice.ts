import { createSlice } from '@reduxjs/toolkit'

export interface BaseState {
    messengerrange: number,
    rumorsstatus: number,
    workers: number,
    goodsPerHour: number,
    productionArray: number[],

}

const initialState: BaseState = {
    messengerrange: 1,
    rumorsstatus: 0,
    workers: 6,
    goodsPerHour: 1,
    productionArray: [3,4,5,6,7,2,6,1,9] //все переменные, что хранятся в слайсе
}

export const BaseSlice = createSlice({
    name: 'base',
    initialState,
    reducers: {
        increment: (state) => {
        //    state.value += 1
        }
    },
})

export const { increment } = BaseSlice.actions //все методы сюда импортировать:3

export default BaseSlice.reducer

