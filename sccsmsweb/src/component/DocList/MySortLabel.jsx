import { Stack, Typography } from "@mui/material";
import { UpIcon, DownIcon } from "../PubIcon/PubIcon";

const MySortLabel = ({ active = true, direction = "asc", sortNumber = 0, children }) => {
    return (
        <Stack sx={{ display: "flex", flexDirection: "row" }}>
            {children}
            {
                active
                    ? <Stack sx={{ display: "flex", direction: "row", alignItems: "center", justifyContent: "center", paddingLeft: 1 }}>
                        {direction === "asc" ? <UpIcon color={"success"} fontSize="small" sx={{ padding: 0, margin: 0 }} /> : <DownIcon color={"success"} fontSize="small" sx={{ padding: 0, margin: 0 }} />}
                        <Typography variant="body2" sx={{ color: "primary" }}>{sortNumber}</Typography>
                    </Stack>
                    : null
            }
        </Stack>
    );
};

export default MySortLabel;