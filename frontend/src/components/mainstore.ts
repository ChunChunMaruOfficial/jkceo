import { configureStore } from '@reduxjs/toolkit'
import { BaseSlice } from './_slices/baseslice'
import { PersonsState } from './_slices/personsslice';

export const store = configureStore({
  reducer: {
    base: BaseSlice.reducer,
    persons: PersonsState.reducer
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;