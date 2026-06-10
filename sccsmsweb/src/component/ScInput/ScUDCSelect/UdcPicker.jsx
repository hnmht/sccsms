import { useState, useEffect } from "react";
import {
    DialogTitle,
    DialogActions,
    Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import DocTable from "../../DocTable/DocTable";
import { columns } from "./tableConstructor";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";

const docName = "udc";

const UdcPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem }) => {
    const [udcs, setUdcs] = useState([]);
    const { t } = useTranslation();
    // Get User-defined categories from the frontend cache when the component loads.
    useEffect(() => {
        async function getLocalUDCs() {
            const localUdcs = await GetLocalCache(docName);
            setUdcs(localUdcs);
        }
        getLocalUDCs();
    }, []);

    // Actions after click the refresh button in the table head.
    const handleRefreshUdcs = async () => {
        // Refresh the latest frontend cache 
        await InitDocCache(docName);
        let newUdcs = await GetLocalCache(docName);
        // Refresh UDCs
        setUdcs(newUdcs);
    };

    return (
        <>
            <DialogTitle>{t("chooseUDC")}</DialogTitle>
            <DocTable
                columns={columns}
                refreshAction={handleRefreshUdcs}
                rows={udcs}
                docListTitle={t("chooseCategory")}
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

export default UdcPicker;
