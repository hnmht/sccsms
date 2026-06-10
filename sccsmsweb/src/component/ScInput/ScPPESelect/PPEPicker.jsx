import { useState, useEffect } from "react";
import {
    DialogTitle,
    DialogActions,
    Button,
} from "@mui/material";
import DocTable from "../../DocTable/DocTable";
import { columns } from "./tableConstructor";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";
import { useTranslation } from "react-i18next";

const docName = "ppe";

const PPEPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem }) => {
    const [ppes, setPpes] = useState([]);
    const { t } = useTranslation();

    // Get the list from the front-end cache when the component loads.
    useEffect(() => {
        async function reqLocalLps() {
            const localPpes = await GetLocalCache(docName);
            setPpes(localPpes);
        }
        reqLocalLps();
    }, []);

    // Refresh
    const handleRefreshLps = async () => {
        // Request the latest PPE from backend server
        await InitDocCache(docName);
        let newPpes = await GetLocalCache(docName);
        // Refresh
        setPpes(newPpes);
    };

    return (
        <>
            <DialogTitle>{t("choosePPE")}</DialogTitle>
            <DocTable
                columns={columns}
                refreshAction={handleRefreshLps}
                rows={ppes}
                docListTitle="PPEList"
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

export default PPEPicker;
