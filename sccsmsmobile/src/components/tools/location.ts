import { useEffect } from 'react';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLoading, setLocation, setError } from '../../store/slice/location';
import { RootState, AppDispatch } from '../../store';
// Get location information once 
export const getLocationWithTimeout = (
    timeout = 3000
): Promise<GeolocationResponse> => {
    return new Promise((resolve, reject) => {
        let finished = false;
        const timer = setTimeout(() => {
            if (!finished) {
                finished = true;
                reject(new Error('LOCATION_TIMEOUT'));
            }
        }, timeout);

        Geolocation.getCurrentPosition(
            (position) => {
                if (!finished) {
                    finished = true;
                    clearTimeout(timer);
                    resolve(position);
                }
            },
            (error) => {
                if (!finished) {
                    finished = true;
                    clearTimeout(timer);
                    reject(error);
                }
            },
            {
                enableHighAccuracy: true,
                timeout,
                maximumAge: 10000, // Key point: Enable caching
            }
        );
    });
};

export const getLocationWithFallback = async (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState().location;
    try {
        dispatch(setLoading(true));

        // Step 1: Prioritize cached data(return immediately if within 1 second)
        if (state.current && Date.now() - state.current.timestamp < 10000) {
            return state.current;
        }

        // Step 2: Attempt high-precision location (3-second timeout)
        const pos = await getLocationWithTimeout(3000);

        dispatch(setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            source: 'gps',
        }));

        return pos.coords;

    } catch (e) {
        //  fallback：use old data;
        if (state.current) {
            dispatch(setLocation({
                ...state.current,
                source: 'fallback',
            }));
            return state.current;
        }

        dispatch(setError('Location failed'));
        throw e;
    }
};

let watchId: number | null = null;

export const startLocationWatch = (dispatch: AppDispatch) => {
    if (watchId !== null) return;


    watchId = Geolocation.watchPosition(
        (pos) => {
            dispatch(setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                source: 'gps',
            }));
        },
        (error) => {
            dispatch(setError(error.message));
        },
        {
            enableHighAccuracy: false, // ⚠️ 平衡电量
            distanceFilter: 10,
            interval: 3000,
        }
    );
};

export const stopLocationWatch = () => {
    if (watchId !== null) {
        Geolocation.clearWatch(watchId);
        watchId = null;
    }
};

