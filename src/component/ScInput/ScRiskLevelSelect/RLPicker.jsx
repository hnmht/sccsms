import React, { useState, useEffect } from "react";
import {
    DialogTitle,
    DialogActions,
    Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import DocTable from "../../DocTable/DocTable";
import { columns } from "./tableConstructor";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";
const docName = "risklevel";

const RLPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem }) => {
    const [rls, setRLs] = useState([]);
    const { t } = useTranslation();
    // Get local cache when the component loads
    useEffect(() => {
        async function reqLocalRLs() {
            const newRls = await GetLocalCache(docName);
            setRLs(newRls);
        }
        reqLocalRLs();
    }, []);

    // Actions after click refresh button
    const handleRefreshRLs = async () => {
        // Request latest Risk Level front-end cache from server
        await InitDocCache(docName);
        let newRls = await GetLocalCache(docName);
        // Refresh
        setRLs(newRls);
    };

    return (
        <>
            <DialogTitle>{t("chooseRiskLevel")}</DialogTitle>
            <DocTable
                columns={columns}
                refreshAction={handleRefreshRLs}
                rows={rls}
                docListTitle="riskLevel"
                clickItem={clickItemAction}
                doubleClickItem={doubleClickItemAction}
                isMultiple={false}
            />
            <DialogActions sx={{ m: 1 }}>
                <Button color="error" onClick={cancelClickAction}>{t("cancel")}</Button>
                <Button variant="contained" disabled={currentItem.id === 0} onClick={okClickAction}>{t("ok")}</Button>
            </DialogActions>
        </>
    );
};

export default RLPicker;
