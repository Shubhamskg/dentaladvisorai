import { configureStore } from "@reduxjs/toolkit";
import user from "./user";
import loading from "./loading";
import history from "./history";
import messages from "./messages";
import radiograph from './vision';
import visionHistory from './visionHistory'
export const store = configureStore({
    reducer: {
        user,
        loading,
        history,
        messages,
        radiograph,
        visionHistory
    }
})