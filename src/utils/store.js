import { configureStore } from "@reduxjs/toolkit";
import infoReducer from "./infoSlice"

export default configureStore({
    reducer: {
        info: infoReducer
    }
})