// import cartSlice from "@/Redux-Thunk/reducers/cartSlice";

import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/auth";
import { NewsApi } from "../features/news/news";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [NewsApi.reducerPath]: NewsApi.reducer,
    
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      NewsApi.middleware,
      
    ),
});

export default store;
