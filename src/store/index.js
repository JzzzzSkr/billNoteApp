import { configureStore } from "@reduxjs/toolkit";
import reducer from './modles/billStore'

const store = configureStore({
  reducer: {
    bill: reducer,
  },
});

export default store;