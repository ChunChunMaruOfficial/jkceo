import { createSlice } from '@reduxjs/toolkit'
import { workerInterface } from '../_Interfaces/workerInterface' 
import { AnnouncementsInterface } from '../_Interfaces/AnnouncementsInterface'

export interface PersonsState {
    workers: workerInterface[],
    announcements: AnnouncementsInterface[]
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
        updateannouncements: (state, action) => {            
            state.announcements = action.payload
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

export const { setworkers, deleteworker, addannouncements, setnewprice,updateannouncements } = PersonsState.actions //все методы сюда импортировать:3

export default PersonsState.reducer