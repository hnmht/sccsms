import { Dimensions, Platform, PixelRatio, StatusBar } from "react-native";

const { width, height } = Dimensions.get("window");
const OS = Platform.OS;
const ios = OS == "ios";
const android = OS == "android";
const isIphoneX = ios && height == 812 && width == 375;
const statusBarHeight = ios ? (isIphoneX ? 44 : 20) : StatusBar.currentHeight;
const fontScale = PixelRatio.getFontScale();
const isOverSize = fontScale > 1;

export const pubParams = {
    screen: {
        width: width,
        height: height,
        statusBarHeight: statusBarHeight,
        onePixelRatio: 1 / PixelRatio.get(),
        fontScale: fontScale,
        isOverSize: isOverSize
    },
    device: {
        ios: ios,
        android: android,
        isIphoneX: isIphoneX
    }
};