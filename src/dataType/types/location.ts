export interface LocationState {
    current: {
        latitude: number;
        longitude: number;
        accuracy?: number;
        timestamp: number;
    } | null;
    loading: boolean;
    error: string | null;
    lastUpdateTime: number | null;
    source: 'gps' | 'cache' | 'fallback' | null;
};