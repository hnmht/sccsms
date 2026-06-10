import { useState, useEffect } from "react";
import {
    List,
    ListSubheader,
    Tooltip,
    IconButton,
    DialogActions,
    Button,
} from "@mui/material";
import { RefreshIcon } from "../../PubIcon/PubIcon";
import PubTree from "../ScPub/PubTree";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";
import { useTranslation } from "react-i18next";

const docName = "department";

const DeptPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem }) => {
    const [depts, setDepts] = useState([]);
    const { t } = useTranslation();
    // Get local cache when the component loads.
    useEffect(() => {
        async function getLocalDepts() {
            const newDepts = await GetLocalCache(docName);
            setDepts(newDepts);
        }
        getLocalDepts();
    }, []);

    // Convert the selected array to ID array
    const transforDeptIDs = (dept) => {
        let selectDeptIds = [];
        selectDeptIds.push(dept.id);
        return selectDeptIds;
    };
    // Actions after click refresh button
    const handleDeptRefresh = async () => {
        await InitDocCache(docName);
        const newDepts = await GetLocalCache(docName);
        setDepts(newDepts);
    };

    return (
        <>
            <List
                dense
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader"
                        sx={{
                            borderBottomStyle: "solid", borderBottomWidth: 1, borderBottomColor: "divider",
                            fontWeight: "bold", fontSize: "1.125em", bgcolor: "background.paper",
                            display: "flex", flexDirection: "row", justifyContent: "space-between"
                        }}
                    >
                        {t("chooseDept")}
                        <Tooltip title={t("refresh")} placement="top">
                            <IconButton onClick={handleDeptRefresh}>
                                <RefreshIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    </ListSubheader>
                }
                sx={{ width: 512, minHeight: 256, maxHeight: 512, overflow: "auto", p: 0, borderStyle: "solid", borderWidth: 1, borderColor: "divider", bgcolor: "background.paper" }}
            >
                <PubTree oriDocs={depts} selectDocIDs={transforDeptIDs(currentItem)} onDocClick={clickItemAction} onDocDoubleClick={doubleClickItemAction} />
            </List>
            <DialogActions sx={{ p: 2.5 }}>
                <Button color='error' onClick={cancelClickAction}>{t("cancel")}</Button>
                <Button variant='contained' disabled={currentItem.id === 0 ? true : false} onClick={okClickAction}>{t("ok")}</Button>
            </DialogActions>
        </>
    );
};

export default DeptPicker;