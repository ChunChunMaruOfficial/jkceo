import { configureStore } from '@reduxjs/toolkit'
import { BaseSlice } from './_slices/baseslice'

export const store = configureStore({
  reducer: {
    base: BaseSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;