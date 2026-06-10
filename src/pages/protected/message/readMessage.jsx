import { Grid, Box } from "@mui/material";
import ReactPerfectScrollbar from "react-perfect-scrollbar";
import MessageDisplay from "./messageDisplay";

const ReadMessage = ({ messages, t }) => {
    return (
        <Box sx={{ height: 620, overflow: "auto" }}>
            <ReactPerfectScrollbar>
                <Grid
                    container
                    spacing={3}
                    alignItems="center"
                >
                    {messages.map(msg => {
                        return (
                            <MessageDisplay msg={msg} toReadAction={() => { }} t={t} key={`readmessage${msg.id}`} />
                        );
                    })}
                </Grid>
            </ReactPerfectScrollbar>
        </Box>
    )
};
export default ReadMessage;