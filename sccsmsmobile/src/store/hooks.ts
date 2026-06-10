import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// Strongly typed dispatch
export const useAppDispatch: () => AppDispatch = useDispatch;

// Strongly typed selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
