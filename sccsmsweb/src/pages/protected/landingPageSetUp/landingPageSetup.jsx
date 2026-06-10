import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Paper, Divider, Card, CardContent, Grid, Typography, Button, } from "@mui/material";
import { useTranslation } from "react-i18next";
import { message } from "mui-message";

import PageTitle from "../../../component/PageTitle/PageTitle";
import Loader from "../../../component/Loader/Loader";
import ScInput from "../../../component/ScInput";

import { reqLandingPageInfo, reqModifyLandingPageInfo } from "../../../api/landingPage";
import { cloneDeep } from "lodash";
import useContentHeight from "../../../hooks/useContentHeight";
import { checkVoucherNoBodyErrors } from "../pub/pubFunction";

const Image = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
  box-shadow: 0 6px 18px 0 rgba(18, 38, 63, 0.075);
  border-radius: 5px;
  transform: perspective(1920px) rotateX(25deg);
  z-index: 0;
  position: relative;
  image-rendering: auto;
  image-rendering: -webkit-optimize-contrast;
  margin-bottom: -100px;
  margin-top: -35px;
  ${(props) => props.theme.breakpoints.up("md")} {
    margin-top: -50px;
  }
`;

const ImageWrapper = styled.div`  
  max-width:80%;
  margin: 0 auto;
  margin-top:50px;
  &:before {
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.02));
    bottom: 0;
    left: 0;
    position: absolute;
    content: " ";
    z-index: 1;
    display: block;
    width: 100%;
    height: 75px;
    pointer-events: none;
  }
`;

// Landing Page Setup
const LandingPageSetUp = () => {
    const [currentSetup, setCurrentSetup] = useState(undefined);
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({});
    const { t } = useTranslation();
    const contentHeight = useContentHeight();

    useEffect(() => {
        async function initialData() {
            let infoRes = await reqLandingPageInfo();
            let info = {};
            if (infoRes.status) {
                info = infoRes.data;
            } else {
                info = undefined;
            }
            setCurrentSetup(info);
        }
        initialData();
    }, []);

    // Check image specifications
    const handleCheckFile = (file) => {
        let err = { isErr: false, msg: "" };
        if (file.isImage === 0) {
            err = { isErr: true, msg: "fileMustBeImage" };
            return err;
        }
        if (file.imageWidth !== 1920 || file.imageHeight !== 1200) {
            err = { isErr: true, msg: t("imageNotRequire", { requireSpec: "1920px*1200px", currentWidth: file.imageWidth, currentHeight: file.imageHeight }) };
            return err;
        }
        return err;
    };

    // Get the value from child component
    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (currentSetup === undefined || !isEdit) {
            return
        }
        // Change the error information
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        // Change the current setup information
        setCurrentSetup((prevState) => {
            return ({
                ...prevState,
                [itemkey]: value,
            });
        });
    };

    // Actions after click the save button
    const handleModifySetup = async () => {
        let newInfo = cloneDeep(currentSetup);
        const modifyRes = await reqModifyLandingPageInfo(newInfo);
        if (modifyRes.status) {
            newInfo = modifyRes.data;
        }
        setCurrentSetup(newInfo);
        setIsEdit(false);
    };

    return (
        <>
            <PageTitle pageName={t("MenuLPS")} displayHelp={false} helpUrl={"#"} />
            <Divider my={2} />
            <Paper sx={{ width: "100%", height: contentHeight, mt: 2, backgroundColor: "paper", overflowX: "hidden", overflowY: "auto" }}>
                {currentSetup !== undefined
                    ? <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Grid item xs={12} textAlign="left" pb={4}>
                                {isEdit
                                    ? <>
                                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleModifySetup}>{t("save")}</Button>
                                        <Button color='error' variant='contained' onClick={() => setIsEdit(false)} sx={{ ml: 4 }}>{t("cancel")}</Button>
                                    </>
                                    : <Button variant="contained" onClick={() => setIsEdit(true)} >{t("edit")}</Button>
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <ScInput
                                    dataType={301}
                                    allowNull={false}
                                    isEdit={isEdit}
                                    itemShowName="sysNameDisp"
                                    itemKey="sysNameDisp"
                                    initValue={currentSetup.sysNameDisp}
                                    pickDone={handleGetValue}
                                    placeholder="namePlaceholder"
                                    isBackendTest={false}
                                    key="sysNameDisp"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ScInput
                                    dataType={301}
                                    allowNull={false}
                                    isEdit={isEdit}
                                    itemShowName="introText"
                                    itemKey="introText"
                                    initValue={currentSetup.introText}
                                    pickDone={handleGetValue}
                                    placeholder="introTextPlaceholder"
                                    isBackendTest={false}
                                    isMultiline={true}
                                    rowNumber={2}
                                    key="introText"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ScInput
                                    dataType={903}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="overviewImage"
                                    itemKey="file"
                                    initValue={currentSetup.file}
                                    pickDone={handleGetValue}
                                    placeholder="chooseAnImage"
                                    isBackendTest={true}
                                    backendTestFunc={handleCheckFile}
                                    key="file"
                                    positionID={0}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">{t("imagePreview")}:</Typography>
                                <ImageWrapper>
                                    <Image
                                        alt="instroduction image review"
                                        src={currentSetup.file.id === 0 ? `/static/img/brands/introduce.jpg` : currentSetup.file.fileUrl}
                                    />
                                </ImageWrapper>
                            </Grid>
                        </Grid>
                    </Grid>
                    : <Loader />
                }
            </Paper>
        </>
    );
};

export default LandingPageSetUp;