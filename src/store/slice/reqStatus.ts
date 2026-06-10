import { createSlice } from "@reduxjs/toolkit";
import { ReqStatus } from "../../dataType/types/request";

const initialState: ReqStatus = {
    reqLoading: false,
};

export const reqStatusSlice = createSlice({
    name: "reqStatus",
    initialState,
    reducers: {
        requestStart: (state) => {
            state.reqLoading = true;
        },
        requestEnd: (state) => {
            state.reqLoading = false;
        }
    }
});

export const { requestStart, requestEnd } = reqStatusSlice.actions;
export default reqStatusSlice.reducer;