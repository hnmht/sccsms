import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    csos: [],
    eoRefs: [],
    messages: [],
    woRefs: []
};

export const dynamicDataSlice = createSlice({
    name: "dynamicData",
    initialState,
    reducers:{
        setDynamicCSOs: (state, action) => {
            state.csos = action.payload;
        },
        setDynamicMessages: (state, action) => {
            state.messages = action.payload;
        },
        setDynamicWORefs: (state, action) => {
            state.woRefs = action.payload;
        },
        updateDynamicWORefs: (state, action) => {
            state.woRefs = action.payload;
        },
        setDynamicEORefs: (state, action) => {
            state.eoRefs = action.payload;
        },
        updateDynamicEORefs: (state, action) => {
            state.eoRefs = action.payload;
        },
        resetDynamicData: (state) => {
            state.csos = [];
            state.eoRefs = [];
            state.messages = [];
            state.woRefs = [];
        }
    }
});

export const { setDynamicEORefs, setDynamicMessages, setDynamicCSOs, setDynamicWORefs, updateDynamicWORefs, resetDynamicData, updateDynamicEORefs } = dynamicDataSlice.actions;
export default dynamicDataSlice.reducer;