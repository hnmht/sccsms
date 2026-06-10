import { useSelector } from "react-redux";
import { Grid, Box } from "@mui/material";
import ReactPerfectScrollbar from "react-perfect-scrollbar";
import MessageDisplay from "./messageDisplay";

const UnReadMessage = ({ toReadAction, t }) => {
    const messages = useSelector(state => state.dynamicData.messages);
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
                            <MessageDisplay msg={msg} toReadAction={toReadAction} t={t} key={`unreadmessage${msg.id}`} />
                        );
                    })
                    }
                </Grid>
            </ReactPerfectScrollbar>
        </Box>
    )
};

export default UnReadMessage;