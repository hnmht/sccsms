import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";

import { Paper, Typography } from "@mui/material";
import SignInComponent from "../../layouts/components/auth/SignIn";

const Wrapper = styled(Paper)`
    padding:${(props) => props.theme.spacing(6)};
    ${(props) => props.theme.breakpoints.up("md")} {
        padding:${(props) => props.theme.spacing(10)};
    };  
`;

const LoginScreen = styled("div")`
    width:calc(100vw);
    height: calc(100vh);
    display:flex;
    align-items:center;
    justify-content:center;
`;

function SignIn() {
    const { t } = useTranslation();
    return (
        <LoginScreen>
            <Wrapper>
                <Typography component="h3" variant="h3" align="center" gutterBottom color="primary" mb={4}>
                    {t("systemName")}
                </Typography>
                <SignInComponent />
            </Wrapper>
        </LoginScreen>
    );
}

export default SignIn;