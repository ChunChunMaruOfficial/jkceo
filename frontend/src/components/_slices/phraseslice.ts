import { createSlice } from '@reduxjs/toolkit'

export interface PhraseState {
    refusal: string[],
    lucky: string[],
    wrong: string[],
    noanswer: string[],

}

const initialState: PhraseState = {
    refusal: [], // сделка соравалась
    lucky: [], //сделка удачно прошла
    wrong: [], //не тот продукт, что хотел клиент
    noanswer: [] //нет ответа продавца
}

export const Phraseslice = createSlice({
    name: 'base',
    initialState,
    reducers: {

        setrefusal: (state, action) => {
            state.refusal = action.payload
        },
        setlucky: (state, action) => {
            state.lucky = action.payload
        },
        setwrong: (state, action) => {
            state.wrong = action.payload
        },
        setnoanswer: (state, action) => {
            state.noanswer = action.payload
        },

    },
})

export const { setrefusal, setlucky, setwrong, setnoanswer } = Phraseslice.actions //все методы сюда импортировать:3

export default Phraseslice.reducer

