import { configureStore } from '@reduxjs/toolkit'
import { BaseSlice } from './_slices/baseslice'
import { PersonsState } from './_slices/personsslice';
import { Phraseslice } from './_slices/phraseslice';

export const store = configureStore({
  reducer: {
    base: BaseSlice.reducer,
    persons: PersonsState.reducer,
    phrase: Phraseslice.reducer
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;