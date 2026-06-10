import { Platform } from "react-native";
import { PERMISSIONS, checkMultiple, RESULTS, requestMultiple } from "react-native-permissions";

const IOS_PERMISSIONS = [
    PERMISSIONS.IOS.CAMERA,
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    PERMISSIONS.IOS.PHOTO_LIBRARY,
];

const ANDROID_PERMISSIONS_BELOW_33 = [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
];

const ANDROID_PERMISSIONS_33_ABOVE = [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
    PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
];

export async function checkPermissions(): Promise<boolean> {
    switch (Platform.OS) {
        case "ios":
            const iosRes = await checkMultiple([...IOS_PERMISSIONS]);
            const denied = Object.values(iosRes).filter(r => r !== RESULTS.GRANTED);
            return denied.length === 0;
        case "android":
            const permissions = Platform.Version >= 33 ? ANDROID_PERMISSIONS_33_ABOVE : ANDROID_PERMISSIONS_BELOW_33;
            const androidRes = await checkMultiple([...permissions]);
            const androidDenied = Object.values(androidRes).filter(r => r !== RESULTS.GRANTED);
            return androidDenied.length === 0;
        default:
            return false;
    }
}

export async function requestPermissions(): Promise<boolean> {
    let granted: boolean = await checkPermissions();
    if (granted) {
        return true;
    }
    switch (Platform.OS) {
        case "ios":
            const iosRes = await requestMultiple([...IOS_PERMISSIONS]);
            const iosDenied = Object.values(iosRes).filter(r => r !== RESULTS.GRANTED);
            return iosDenied.length === 0;
        case "android":
            const permissions = Platform.Version >= 33 ? ANDROID_PERMISSIONS_33_ABOVE : ANDROID_PERMISSIONS_BELOW_33;
            const androidRes = await requestMultiple([...permissions]);
            const androidDenied = Object.values(androidRes).filter(r => r !== RESULTS.GRANTED);
            return androidDenied.length === 0;
        default:
            return false;
    }
}


