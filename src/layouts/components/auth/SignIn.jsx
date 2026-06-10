import { useState } from "react";
import styled from "@emotion/styled";

import { useNavigate } from "react-router-dom";
import { spacing } from "@mui/system";

import {
    TextField as MuiTextField,
    Box as MuiBox,
    InputAdornment,
    IconButton,
    CircularProgress
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from 'react-i18next';

import { AccountIcon, PasswordIcon, VisibilityIcon, VisibilityOffIcon } from "../../../component/PubIcon/PubIcon";
import LoginIcon from '@mui/icons-material/Login';
import store from "../../../store";
import { reqGetPublicKey } from "../../../api/security";
import { reqLogin } from "../../../api/login";
import { reqUserInfo } from "../../../api/user";
import { setUserInfo, setUserToken } from "../../../store/slice/user";
import { getDynamicData } from "../../../store/pub";
import { initLocalDb } from "../../../storage/db/db";
import { encryptPassword } from "../../../utils/encrypt";

const TextField = styled(MuiTextField)(spacing);
const Button = styled(LoadingButton)(spacing);
const Box = styled(MuiBox)(spacing);

const SignIn = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [userCode, setUserCode] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const canLogin = userCode && userCode !== "" && password && password !== "";
    const handleLogin = async (event) => {
        setLoading(true);
        event.preventDefault();
        // Request RSA public key from the server.
        const keyRes = await reqGetPublicKey();
        if (!keyRes.status) {
            setLoading(false);
            return
        } 
        const publicKey = keyRes.data;
        // Encrypt the password using the RSA public key.
        let rsaPassword = encryptPassword(publicKey, password);      
        // Request user token from the server        
        let loginRes = await reqLogin({ userCode: userCode.trim(), password: rsaPassword });
        if (!loginRes.status) {
            setLoading(false);
            return
        }
        const token = loginRes.data;
        //Set user token in Redux
        store.dispatch(setUserToken(token));
        // Request user information from the server
        const userInfoRes = await reqUserInfo(token);
        if (!userInfoRes.status) {
            setLoading(false);
            return
        }
        const latestUserInfo = userInfoRes.data;
        // Set user information in Redux
        store.dispatch(setUserInfo(latestUserInfo));
        // Initialize the local database.
        initLocalDb();
        // Fetch dynamic data from the server and store in the local database. 
        getDynamicData();
        setLoading(false);
        // Navigate to the dashboard         
        navigate("/private/dashboard");
    };

    return (
        <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            method="post"
            my={2}
            alignItems="center"
        >
            <TextField
                margin={"normal"}
                required
                fullWidth
                autoComplete="true"
                id="userCode"
                inputProps={{ name: "userCode" }}
                label={t("labelUserCode")}
                name="userCode"
                placeholder={t("codePlaceholder")}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountIcon color="secondary" />
                        </InputAdornment>
                    ),
                }}
                autoFocus
                onChange={(event) => { setUserCode(event.target.value) }}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t("labelPassword")}
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                placeholder={t("inputPasswordPlaceholder")}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <PasswordIcon color="secondary" />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(event) => event.preventDefault}
                        >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                    )
                }}
                onChange={(event) => { setPassword(event.target.value) }}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                mt={4}
                disabled={!canLogin}
                endIcon={loading ? <CircularProgress size={16}/> : <LoginIcon fontSize="16px"/>}
                loading={loading}
                loadingPosition="end"
            >
                {t("login")}
            </Button>
        </Box>
    );
}

export default SignIn;