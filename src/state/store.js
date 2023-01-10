import { configureStore } from '@reduxjs/toolkit'
import navReducer from './navSlice'
import contentReducer from './contentSlice'

export const store = configureStore({
  reducer: {
    nav: navReducer,
    content: contentReducer
  },
})