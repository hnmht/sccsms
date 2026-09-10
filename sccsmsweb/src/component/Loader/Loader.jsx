import { Typography, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

function Loader() {
    const {t} = useTranslation();
    return (
        <div
            style={{
                display: 'flex',	
                flexDirection: "column",
                position: 'absolute',	
                top: '0px',	
                left: '0px',	
                zIndex: 2010,
                height: '100%',	
                width: '100%',	
                background: 'rgba(0,0,0,0.3)',	
                textAlign: 'center',
                justifyContent: "center",
                alignItems: 'center',
            }}>
            <CircularProgress color="primary" size={32} disableShrink />
            <Typography variant="body2" sx={{ mt: 2 }}>{t("loading")}</Typography>
        </div>
    );
}

export default Loader;