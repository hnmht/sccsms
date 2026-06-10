import {
    Grid,
    Typography,
    Breadcrumbs as MuiBreadcrumbs,
    Link,
    Box
} from "@mui/material";
import { NavLink } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useTranslation } from "react-i18next";

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

function PageTitle({ pageName, displayHelp, helpUrl }) {
    const {t} = useTranslation();
    return (
        <Grid justifyContent="space-between" direction={"row"} alignItems="center" container>
            <Typography variant="h3" gutterBottom display="inline">
                {t(pageName)}
            </Typography>
            <Box display={"flex"} flexDirection="row" alignItems={"center"}>
                <Breadcrumbs aria-label="Breadcrumb" mt={2}>
                    <Link component={NavLink} to="/">
                        {t("MenuDashboard")}
                    </Link>
                    <Typography>{t(pageName)}</Typography>
                </Breadcrumbs>
            </Box>
        </Grid>
    );
}

export default PageTitle;
