import { useState } from "react";
import { IconButton, Collapse, Grid, Box, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { ExpandMoreIcon } from "../PubIcon/PubIcon";
import { useTranslation } from "react-i18next";

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const MoreInfo = ({ children }) => {
    const {t} = useTranslation();
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    return (
        <>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
                <Typography component="p" variant="body3">{expanded ? "" : t("more")}</Typography>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon  color="primary"/>
                </ExpandMore>
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Grid container spacing={2}>
                    {children}
                </Grid>
            </Collapse>
        </>

    );
};

export default MoreInfo;