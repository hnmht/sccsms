import { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { MessageBox } from "mui-message";
import createTheme from "./theme";
import useTheme from "./hooks/useTheme";
import routes from "./routes.jsx";
import store from "./store";
import { initLocalDb } from "./storage/db/db.js";
import { getUserInfo } from "./store/pub.js";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import createEmotionCache from "./utils/createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

function App({ emotionCache = clientSideEmotionCache }) {
  const content = useRoutes(routes);
  const { theme } = useTheme();
  useEffect(()=> {
    getUserInfo();
    initLocalDb();
  },[]);
  return (
    <CacheProvider value={emotionCache}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider store={store}>
          <MuiThemeProvider theme={createTheme(theme)}>
            <MessageBox />
            {content}
          </MuiThemeProvider>
        </Provider>
      </LocalizationProvider>
    </CacheProvider>
  );
}
export default App;