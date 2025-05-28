import { createSlice } from '@reduxjs/toolkit'
import { worker } from './baseslice'

export interface announcements {
    text: string,
    date: number,
    imgsrc: string,
    name: string,
    materials: string[],
    price: number
}

export interface PersonsState {
    workers: worker[],
    announcements: announcements[]
}

const initialState: PersonsState = {
    workers: [], //рабочие на доске объявлений
    announcements: [] //объявления по продаже материалов
}

export const PersonsState = createSlice({
    name: 'base',
    initialState,
    reducers: {

        setworkers: (state, action) => {
            state.workers.push(action.payload)
        },
        addannouncements: (state, action) => {            
            state.announcements = [...state.announcements, action.payload]
        },

        deleteworker: (state, action) => {
            state.workers = state.workers.filter(v => v.name != action.payload.name)
        },
        setnewprice: (state, action) => {
             const [id, newprice]: [number, number] = action.payload;
            state.announcements = state.announcements.map((v, i) =>
                i === id ? { ...v, price: newprice } : v
            );
        },
    },
})

export const { setworkers, deleteworker, addannouncements, setnewprice } = PersonsState.actions //все методы сюда импортировать:3

export default PersonsState.reducer