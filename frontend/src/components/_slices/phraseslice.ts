import { createSlice } from '@reduxjs/toolkit'

export interface PhraseState {
    offers: string[],
    agreement: string[],
    providersrefusal: string[],
    deal: string[],
    breakdeal: string[],
    concessions: string[],
    notenoughmoney: string[],

    refusal: string[],
    lucky: string[],
    wrong: string[],
    noanswer: string[],

}

const initialState: PhraseState = {
    //providers
    offers: [],
    agreement: [],
    providersrefusal: [],
    deal: [],
    breakdeal: [],
    concessions: [],
    notenoughmoney: [],

    //buyer
    refusal: [], // сделка соравалась
    lucky: [], //сделка удачно прошла
    wrong: [], //не тот продукт, что хотел клиент
    noanswer: [] //нет ответа продавца
}

export const Phraseslice = createSlice({
    name: 'base',
    initialState,
    reducers: {

        setoffers: (state, action) => {
            state.offers = action.payload
        },
        setagreement: (state, action) => {
            state.agreement = action.payload
        },
        setprovidersrefusal: (state, action) => {
            state.providersrefusal = action.payload
        },
        setdeal: (state, action) => {
            state.deal = action.payload
        },
        setbreakdeal: (state, action) => {
            state.breakdeal = action.payload
        },
        setconcessions: (state, action) => {
            state.concessions = action.payload
        },
        setnotenoughmoney: (state, action) => {
            state.notenoughmoney = action.payload
        },

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

export const { setrefusal, setlucky, setwrong, setnoanswer, 
    setoffers, setagreement, setprovidersrefusal, setdeal, setbreakdeal, setconcessions, setnotenoughmoney } = Phraseslice.actions //все методы сюда импортировать:3

export default Phraseslice.reducer

