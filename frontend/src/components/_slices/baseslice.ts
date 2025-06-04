import { createSlice, current } from '@reduxjs/toolkit'
import axios from 'axios'
import { statisticInterface } from '../_Interfaces/statisticInterface'
import { NoteInterface } from '../_Interfaces/NoteInterface'
import { workerInterface } from '../_Interfaces/workerInterface'
import setactiveCharacter from '../_modules/setactiveCharacter'

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
    productionArray: [], //все переменные, что хранятся в слайсе (график)
    workersarray: [], //уже имеющееся работники
    inventory: []
}

export const BaseSlice = createSlice({
    name: 'base',
    initialState,
    reducers: {

        newday: (state) => {
            state.day++
            setactiveCharacter('day', state.day)
        },
        setdays: (state, action) => {
            state.day = action.payload
        },
        setprofessionformulation: (state, action) => { //формулировка профессии
            state.professionformulation = action.payload
        },
        setmoney: (state, action) => {
            state.money = action.payload
            axios.post('http://localhost:3001/setmoney', { money: action.payload })
            setactiveCharacter('money', action.payload)
        },
        setname: (state, action) => {
            state.name = action.payload
        },
        addnewnote: (state, action) => {
            state.notes.push(action.payload)
            setactiveCharacter('notes', current(state.notes))
        },

        deletecurrentnote: (state, action) => {
            const [title, price]: [string, number] = action.payload;
            state.notes = state.notes.filter(v => v.title !== title || v.price != price);
            axios.post('http://localhost:3001/deletecurrentnote', { note: action.payload })
        },
        addworker: (state, action): void => {
            state.workersarray.push(action.payload)
            setactiveCharacter('workers', current(state.workersarray))
        },
        deletemyworker: (state, action) => {
            state.workersarray = state.workersarray.filter(v => v.name !== action.payload.name);
            setactiveCharacter('workers', state.workersarray);
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
                setactiveCharacter('workers', current(state.workersarray))
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
        },
        addtoinventory: (state, action): void => {
            const [product, income]: [string, boolean] = action.payload;
            state.inventory.some(v => v.name.toLocaleLowerCase() == product.toLocaleLowerCase()) ? state.inventory.map(v => (v.name.toLocaleLowerCase() == product.toLocaleLowerCase() ? v.count += 1 : v.count)) : state.inventory.push({ name: product, count: 1 })
            income && (state.productionArray[state.day] = state.productionArray[state.day] ? state.productionArray[state.day] + 1 : 1);
            setactiveCharacter('inventory', current(state.inventory))
            setactiveCharacter('productionArray', current(state.productionArray))
        },
        setinventory: (state, action): void => {
            state.inventory = action.payload
        },
        removefrominventory: (state, action) => {
            const itemName = action.payload;
            // Находим индекс элемента
            const itemIndex = state.inventory.findIndex(v => v.name === itemName);

            if (itemIndex !== -1) {
                const newInventory = [...state.inventory];
                const item = { ...newInventory[itemIndex] };

                if (item.count > 1) {
                    item.count -= 1;
                    newInventory[itemIndex] = item;
                } else {
                    newInventory.splice(itemIndex, 1);
                }
                state.inventory = newInventory;
            }
            setactiveCharacter('inventory', state.inventory);
            axios.post('http://localhost:3001/removefrominventory', { item: action.payload })
        },

        updaterumorsstatus: (state, action): void => {
            state.rumorsstatus += action.payload
        },

    },
})

export const { newday, setmoney, setprofessionformulation, setname, addnewnote, deletecurrentnote, addworker, upgradestatistic, setproduction, addtoinventory, updaterumorsstatus, removefrominventory, setmainproduct, setinventory, deletemyworker,setdays } = BaseSlice.actions //все методы сюда импортировать:3

export default BaseSlice.reducer

