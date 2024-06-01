import { configureStore } from "@reduxjs/toolkit";
import auth from "../slices/auth.js";
import api from "../api/api.js";
import misc from "../slices/misc.js";

const store = configureStore({
    reducer:{
        auth,
        misc,
        [api.reducerPath] : api.reducer,
    },
    middleware:(defaultMiddleware) => [...defaultMiddleware(),api.middleware],
});

export default store