import { useState, useEffect } from "react";
import { Card, CardContent, Grid, Button, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { message } from "mui-message";
import { cloneDeep } from "lodash";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import Loader from "../../../component/Loader/Loader";
import ScInput from "../../../component/ScInput";
import { reqUserInfo, reqModifyProfile } from "../../../api/user";
import useContentHeight from "../../../hooks/useContentHeight";
import { checkVoucherNoBodyErrors } from "../pub/pubFunction";
import { getUserInfo } from "../../../store/pub";

const Profile = () => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({});
    const {t} = useTranslation();

    const contentHeight = useContentHeight();
    useEffect(() => {
        async function initialData() {
            let userRes = await reqUserInfo();
            let user = {};
            if (userRes.status) {
                user = userRes.data;
            } 
            setCurrentUser(user);
        }
        initialData();
    }, []);

    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (currentUser === undefined || !isEdit) {
            return
        }
        // Change errors value
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        // Change currentUser value
        setCurrentUser((prevState) => {
            return ({
                ...prevState,
                [itemkey]: value,
            });
        });
    };
    // Submit the modified information to the server
    const handleModifyUser = async () => {
        let thisUser = cloneDeep(currentUser);       
        delete thisUser.menuList;
        delete thisUser.createDate;
        delete thisUser.modifyDate;
        delete thisUser.roles;
        const modifyRes = await reqModifyProfile(thisUser);
        if (modifyRes.status) {
            thisUser = modifyRes.data;
            message.success(t("modifySuccessful"));
        } 
        setCurrentUser(thisUser);
        setIsEdit(false);
        // Update Redux
        getUserInfo();

    };

    return (<>
        <PageTitle pageName={t("MenuProfile")} />
        <Divider my={2} />
        <Paper sx={{ width: "100%", minHeight: contentHeight, mt: 2, backgroundColor: "paper" }}>
            {currentUser !== undefined
                ? <Card sx={{ mt: 0, width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <ScInput
                                    dataType={901}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="avatar"
                                    itemKey="avatar"
                                    initValue={currentUser.avatar}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    isBackendTest={false}
                                    key="avatar"
                                />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <ScInput
                                            dataType={301}
                                            allowNull={false}
                                            isEdit={false}
                                            itemShowName="code"
                                            itemKey="code"
                                            initValue={currentUser.code}
                                            pickDone={handleGetValue}
                                            placeholder="codePlaceholder"
                                            isBackendTest={false}
                                            key="code"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ScInput
                                            dataType={301}
                                            allowNull={false}
                                            isEdit={false}
                                            itemShowName="name"
                                            itemKey="name"
                                            initValue={currentUser.name}
                                            pickDone={handleGetValue}
                                            placeholder="namePlaceholder"
                                            isBackendTest={false}
                                            key="name"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ScInput
                                            dataType={401}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="gender"
                                            itemKey="gender"
                                            initValue={currentUser.gender}
                                            pickDone={handleGetValue}
                                            placeholder=""
                                            key="gender"
                                            isBackendTest={false}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ScInput
                                            dataType={520}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="department"
                                            itemKey="department"
                                            initValue={currentUser.department}
                                            pickDone={handleGetValue}
                                            placeholder="deptPlaceholder"
                                            key="department"
                                            isBackendTest={false}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={isEdit}
                                            itemShowName="mobile"
                                            itemKey="mobile"
                                            initValue={currentUser.mobile}
                                            pickDone={handleGetValue}
                                            placeholder="mobilePlaceholder"
                                            key="mobile"
                                            isBackendTest={false}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ScInput
                                            dataType={305}
                                            allowNull={true}
                                            isEdit={isEdit}
                                            itemShowName="email"
                                            itemKey="email"
                                            initValue={currentUser.email}
                                            pickDone={handleGetValue}
                                            placeholder="emailPlaceholder"
                                            key="email"
                                            isBackendTest={false}
                                        />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={isEdit}
                                            itemShowName="description"
                                            itemKey="description"
                                            initValue={currentUser.description}
                                            pickDone={handleGetValue}
                                            placeholder="descriptionPlaceholder"
                                            isBackendTest={false}
                                            isMultiline={true}
                                            rowNumber={4}
                                            key="description"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} mt={5}>
                            <Grid item xs={12} textAlign="right" pr={36}>
                                {isEdit
                                    ? <>
                                        <Button color='error' variant='contained' onClick={() => setIsEdit(false)} sx={{ mr: 5 }}>{t("cancel")}</Button>
                                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleModifyUser}>{t("save")}</Button>
                                    </>
                                    : <Button variant="contained" onClick={() => setIsEdit(true)} >{t("edit")}</Button>
                                }
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                : <Loader />
            }
        </Paper>
    </>);
};

export default Profile;