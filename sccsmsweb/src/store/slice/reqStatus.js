import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reqLoading: false,
};

export const reqStatusSlice = createSlice({
    name: "reqstatus",
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