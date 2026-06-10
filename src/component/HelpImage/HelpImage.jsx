import { Box, Typography } from "@mui/material";
import ModalImage from "react-modal-image";

const HelpImage = ({uri,footTitle}) => {
    return (
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            <ModalImage
                small={uri}
                large={uri}
                alt={uri}
                showRotate={true}
                hideDownload
            />
            <Typography variant="h6" color="primary">{footTitle}</Typography>
        </Box>
    )
};

export default HelpImage;