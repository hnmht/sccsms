import { Typography, CircularProgress } from "@mui/material";

function Loader() {
    return (
        <div
            style={{
                display: 'flex',	
                flexDirection: "column",
                position: 'absolute',	
                top: '0px',	
                left: '0px',	
                zIndex: 10,
                height: '100%',	
                width: '100%',	
                background: 'rgba(0,0,0,0.3)',	
                textAlign: 'center',
                justifyContent: "center",
                alignItems: 'center'
            }}>
            <CircularProgress color="primary" size={32} disableShrink />
            <Typography variant="body2" sx={{ mt: 2 }}>Loading...</Typography>
        </div>
    );
}

export default Loader;