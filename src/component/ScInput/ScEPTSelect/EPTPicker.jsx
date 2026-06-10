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

const docName = "ept";

const EPTPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem }) => {
    const [epts, setEpts] = useState([]);
    const {t} = useTranslation();

    // Retrieve the EPT list from the front-end cache when the component loads
    useEffect(() => {
        async function reqLocalEpts() {
            const localEpts = await GetLocalCache(docName);
            setEpts(localEpts);
        }
        reqLocalEpts();
    }, []);

    // Refresh EPT list
    const handleRefreshEpts = async () => {
        // Request Latest EPT from server
        await InitDocCache(docName);
        let newEpts = await GetLocalCache(docName);
        // Refresh
        setEpts(newEpts);
    };

    return (
        <>
            <DialogTitle>{t("chooseEPT")}</DialogTitle>
            <DocTable
                columns={columns}
                refreshAction={handleRefreshEpts}
                rows={epts}
                docListTitle="EPTlist"
                clickItem={clickItemAction}
                doubleClickItem={doubleClickItemAction}
                isMultiple={false}
            />
            <DialogActions sx={{ m: 1 }}>
                <Button color="error" onClick={cancelClickAction}>{t("cancel")}</Button>
                <Button variant="contained" disabled={currentItem.id === 0} onClick={okClickAction}>{t("Ok")}</Button>
            </DialogActions>
        </>
    );
};

export default EPTPicker;