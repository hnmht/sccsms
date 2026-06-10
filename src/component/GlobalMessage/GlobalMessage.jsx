import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";

function GlobalMessage(props) {
    const { content, duration, type } = props;
    const [open, setOpen] = useState(true);
    const handleClose = (event, reason) => {
        setOpen(false);
    };
    return (<Snackbar
        open={open}
        autoHideDuration={duration}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleClose}>
        <Alert severity={type}>{content}</Alert>
    </Snackbar>
    );
}

export default GlobalMessage;