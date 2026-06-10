import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocationState } from '../../dataType/types/location';

const initialState: LocationState = {
    current: null,
    loading: false,
    error: null,
    lastUpdateTime: null,
    source: null,
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setLocation(state, action: PayloadAction<{
            latitude: number;
            longitude: number;
            accuracy?: number;
            source: LocationState['source'];
        }>) {
            state.current = {
                ...action.payload,
                timestamp: Date.now(),
            };
            state.loading = false;
            state.error = null;
            state.lastUpdateTime = Date.now();
            state.source = action.payload.source;
        },

        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },

        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setLocation, setLoading, setError } = locationSlice.actions;
export default locationSlice.reducer;