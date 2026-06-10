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

const docName = "position";

const PositionPicker = ({id, clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem }) => {
    const [ops, setOps] = useState([]);
    const { t } = useTranslation();

    // Get local cache when the component loads.
    useEffect(() => {
        async function reqLocalOps() {
            const localOps = await GetLocalCache(docName);
            setOps(localOps);
        }
        reqLocalOps();
    }, []);

    // Actions after Click refresh button
    const handleRefreshOps = async () => {
        // Request data from server
        await InitDocCache(docName);
        let newPosition = await GetLocalCache(docName);
        // Refresh
        setOps(newPosition);
    };

    return (
        <>
            <DialogTitle>{t("selectPosition")}</DialogTitle>
            <DocTable
                id={id}
                columns={columns}
                refreshAction={handleRefreshOps}
                rows={ops}
                docListTitle={t("selectPosition")}
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

export default PositionPicker;
