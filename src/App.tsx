
import { useState, useMemo, useCallback } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "react-native";
import { NavigationBar } from "@zoontek/react-native-navigation-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Provider } from "react-redux";
import { store } from "./store";
import { CombinedDefaultTheme, CombinedDarkTheme } from "./theme/theme";
import { ThemeContext } from "./theme/context";
import { RootStackScreen, navigationRef } from "./navigation/rootStack";

const App = () => {
    const [isThemeDark, setIsThemeDark] = useState(false);
    let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;
    const toggleTheme = useCallback(() => {
        return setIsThemeDark(!isThemeDark);
    }, [isThemeDark]);

    const preferences = useMemo(
        () => ({
            toggleTheme,
            isThemeDark,
        }),
        [toggleTheme, isThemeDark]
    );

    return (
        <ThemeContext.Provider value={preferences}>
            <Provider store={store}>
                <PaperProvider theme={theme}>
                    <SafeAreaProvider>
                        <StatusBar
                            barStyle={theme.dark ? "light-content" : "dark-content"}
                            backgroundColor={theme.colors.background}
                        />
                        <NavigationContainer theme={theme} ref={navigationRef}>
                            <RootStackScreen />
                        </NavigationContainer>
                        <NavigationBar barStyle={theme.dark ? "light-content" : "dark-content"} />
                    </SafeAreaProvider>
                </PaperProvider>
            </Provider>
        </ThemeContext.Provider>
    );
};

export default App;