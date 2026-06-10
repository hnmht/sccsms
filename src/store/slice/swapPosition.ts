import { createSlice } from "@reduxjs/toolkit";
import { getEmptySwapPosition } from "../../dataType/dataZero/swapPosition";

const initialState = getEmptySwapPosition();

export const swapPositonSlice = createSlice({
    name: "swapPosition",
    initialState,
    reducers: {
        setSwapPosition: (state, action) => {
            state.buttonPosition = action.payload.buttonPosition;
            state.swapPosition = action.payload.swapPosition;
            state.hiddenPosition = action.payload.hiddenPosition;
            state.orderPosition = action.payload.orderPosition;
            state.bottomDistance = action.payload.bottomDistance;
        },
        changeSwapPosition: (state) => {
            let currentPosition = state.buttonPosition;
            state.buttonPosition = currentPosition === "right" ? "left" : "right";
            state.swapPosition = state.buttonPosition === "right" ? { left: -16 } : { right: -16 };
            state.hiddenPosition = state.buttonPosition === "right" ? { right: -16 } : { left: -16 };
            state.orderPosition = state.buttonPosition === "right" ? { right: 8 } : { left: 8 };
        },
        changeOrderVisible: (state) => {
            state.orderVisible = !state.orderVisible;
        },
        setBottomDistance: (state, action) => {
            state.bottomDistance = action.payload;
        },
    }
});

export const { setSwapPosition, changeSwapPosition, changeOrderVisible,setBottomDistance } = swapPositonSlice.actions;
export default swapPositonSlice.reducer;

