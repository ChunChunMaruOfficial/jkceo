import { configureStore } from '@reduxjs/toolkit'
import { BaseSlice } from './_slices/baseslice'
import { PersonsState } from './_slices/personsslice';
import { Phraseslice } from './_slices/phraseslice';
import { SkillsState } from './_slices/skillsslice';

export const store = configureStore({
  reducer: {
    base: BaseSlice.reducer,
    persons: PersonsState.reducer,
    phrase: Phraseslice.reducer,
    skills: SkillsState.reducer
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;