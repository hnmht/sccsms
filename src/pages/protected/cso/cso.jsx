import { useEffect, useState } from "react";
import {
    Paper,
    Grid
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { isEqual, cloneDeep } from "lodash";
import { message } from "mui-message";
import { Divider, Button } from "../../../component/ScMui/ScMui";
import Loader from "../../../component/Loader/Loader";
import ScInput from '../../../component/ScInput';
import PageTitle from "../../../component/PageTitle/PageTitle";
import { reqGetCSOs, reqEditCSO } from "../../../api/cso";
import { InitDocCache } from "../../../storage/db/db";
import { MultiSortByArr } from "../../../utils/tools";
import useContentHeight from "../../../hooks/useContentHeight";

// Generate Body errors
const generateErrors = (rowNumber) => {
    let errors = [];
    for (let i = 0; i < rowNumber; i++) {
        errors.push({});
    }
    return errors;
};

// Check Errors
const checkError = (errors) => {
    let number = 0;
    for (let key in errors) {
        if (errors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0;
};

// Edit Construction Site Options
const  CSO = () => {
    const [csos, setCsos] = useState([]);
    const [oriCsos, setOriCsos] = useState([]);
    const [errors, setErrors] = useState([]);
    const { t } = useTranslation();
    const contentHeight = useContentHeight();

    // Actions after click the save button
    const handleSave = async (item, index) => {
        const res = await reqEditCSO(item, true);
        if (res.status) {
            message.success(item.name + t("modifySuccessful"));
            handleRefresh(index);
        }
        await InitDocCache("cso");
    };
    // Actions after click the cancel button
    const handleCancel = (index) => {
        const newCso = cloneDeep(oriCsos[index]);
        const newCsos = cloneDeep(csos);
        newCsos[index] = newCso;
        setCsos(newCsos);
    };
    // Refresh Construction site optios UI
    const handleRefresh = async (index) => {
        const res = await reqGetCSOs(true);
        let newOriCsos = [];
        let newCsos = cloneDeep(csos);
        if (res.status) {
            newOriCsos = res.data;
            newOriCsos.sort(MultiSortByArr([{ field: "id", order: "asc" }]));
            let newCso = cloneDeep(newOriCsos[index]);
            newCsos[index] = newCso;
        }
        setCsos(newCsos);
        setOriCsos(newOriCsos);
    };
    // Actions after receiving the value  passed into the ScInput component 
    const handleGetValue = (value, itemkey, positionID, rowIndex, errMsg) => {
        setCsos((prevState) => {
            let newCsos = cloneDeep(prevState);
            newCsos[rowIndex][itemkey] = value;
            return newCsos;
        });

        setErrors((prevState) => {
            let newErrors = cloneDeep(prevState);
            newErrors[rowIndex][itemkey] = errMsg;
            return newErrors;
        });
    };

    useEffect(() => {
        async function getData() {
            const res = await reqGetCSOs(true);
            let newCsos = [];
            if (res.status) {
                newCsos = res.data;
                newCsos.sort(MultiSortByArr([{ field: "id", order: "asc" }]));
            }
            setCsos(newCsos);
            setOriCsos(newCsos);
            setErrors(generateErrors(newCsos.length))
        }
        getData();
    }, []);

    return (csos.length > 0
        ? <>
            <PageTitle pageName={t("MenuCSO")}/>
            <Divider my={2} />
            <Paper sx={{ width: "100%", height: contentHeight, overflow: "auto", pt: 4 }}>
                {csos.map((item, index) => {
                    // Whether the cancel button is available
                    const cancelDisabled = isEqual(item, oriCsos[index]);
                    // Whether the save button is available                   
                    const saveDisabled = cancelDisabled || checkError(errors[index]);
                    // Whether the enable checkbox is availiable
                    const enableEnabled = item.isModify === 0;
                    // Whether the display name field is editable 
                    const displayNameEnable = item.enable === 1;
                    // Whether the UDC field is editable
                    const udcEnable = item.enable === 1 && item.isModify === 0;
                    // Whether the Default value field is editable
                    const defaultValueEnable = item.enable === 1 && item.udc.id > 0;
                    return (
                        <Grid key={index} container spacing={2} sx={{ width: "100%" }}>
                            <Grid item xs={1} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <ScInput
                                    dataType={403}
                                    allowNull={false}
                                    isEdit={enableEnabled}
                                    itemShowName="enable"
                                    itemKey="enable"
                                    initValue={item.enable}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    isBackendTest={false}
                                    key="enable"
                                    rowIndex={index}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <ScInput
                                    dataType={301}
                                    allowNull={false}
                                    isEdit={false}
                                    itemShowName="code"
                                    itemKey="code"
                                    initValue={item.code}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    isBackendTest={false}
                                    key="code"
                                    rowIndex={index}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <ScInput
                                    dataType={301}
                                    allowNull={false}
                                    isEdit={false}
                                    itemShowName="name"
                                    itemKey="name"
                                    initValue={t(item.name)}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    isBackendTest={false}
                                    key="name"
                                    rowIndex={index}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <ScInput
                                    dataType={301}
                                    allowNull={false}
                                    isEdit={displayNameEnable}
                                    itemShowName="displayName"
                                    itemKey="displayName"
                                    initValue={item.displayName}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    isBackendTest={false}
                                    key="displayName"
                                    rowIndex={index}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <ScInput
                                    dataType={530}
                                    allowNull={item.enable === 0}
                                    isEdit={udcEnable}
                                    itemShowName="udc"
                                    itemKey="udc"
                                    initValue={item.udc}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    isBackendTest={false}
                                    key="udc"
                                    rowIndex={index}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <ScInput
                                    dataType={550}
                                    allowNull={true}
                                    isEdit={defaultValueEnable}
                                    itemShowName="defaultValue"
                                    itemKey="defaultValue"
                                    initValue={item.defaultValue}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    isBackendTest={false}
                                    key="defaultValue"
                                    rowIndex={index}
                                    udc={item.udc}
                                />
                            </Grid>
                            <Grid item xs={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Button
                                    variant="contained"
                                    disabled={saveDisabled}
                                    m={1}
                                    onClick={() => handleSave(item, index)}
                                >
                                    {t("save")}
                                </Button>
                                <Button
                                    variant="contained"
                                    m={1}
                                    disabled={cancelDisabled}
                                    onClick={() => handleCancel(index)}
                                >
                                    {t("cancel")}
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider my={2} />
                            </Grid>
                        </Grid>
                    );
                })}
            </Paper>
        </>
        : <Loader />
    );
}

export default CSO;