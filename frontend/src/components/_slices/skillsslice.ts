import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import setactiveCharacter from '../_modules/setactiveCharacter'


export interface SkillInterface {
    value: number, level: number, price: number
}

export interface SkillsState {
    productcreationspeed: SkillInterface,
    priceagreementwinnings: SkillInterface,
    bulletspeed: SkillInterface,
    inventorymax: SkillInterface,
    workersmax: SkillInterface,
    invadersscale: SkillInterface
}

const initialState: SkillsState = {
    productcreationspeed: { value: 42, level: 0, price: 50 },
    priceagreementwinnings: { value: 1, level: 0, price: 60 }, // надо делить там на 1.2, 1.3, 1.4 и тд
    bulletspeed: { value: 300, level: 0, price: 40 }, // меньше - больше
    inventorymax: { value: 50, level: 0, price: 40 }, // различных предметов
    workersmax: { value: 7, level: 0, price: 30 },
    invadersscale: { value: 1, level: 0, price: 40 }
}

export const SkillsState = createSlice({
    name: 'skills',
    initialState,
    reducers: {

        upgradeskill: (state, action: PayloadAction<string>) => {
            const key = action.payload as keyof SkillsState;
            if (state[key].level < 6) {
                state[key].level += 1
                state[key].price += 15

                switch (action.payload) {
                    case 'productcreationspeed':
                        state.productcreationspeed.value -= 3
                        break;
                    case 'priceagreementwinnings':
                        state.priceagreementwinnings.value += 0.15
                        break;
                    case 'bulletspeed':
                        state.bulletspeed.value -= 25
                        break;
                    case 'inventorymax':
                        state.inventorymax.value += 15
                        break;
                    case 'workersmax':
                        state.workersmax.value += 3
                        break;
                    case 'invadersscale':
                        state.invadersscale.value += .05
                        break;
                }
                setactiveCharacter('skills', state)
            }
        },

        setskills: (state, action: { payload: SkillsState }) => {
            const newValues = Object.values(action.payload);
            (Object.keys(state) as Array<keyof SkillsState>).forEach((key, i) => {
                const skillKey = key as keyof SkillsState;
                state[skillKey] = newValues[i]
            });
        }
    }
})
export const { upgradeskill, setskills } = SkillsState.actions

export default SkillsState.reducer

