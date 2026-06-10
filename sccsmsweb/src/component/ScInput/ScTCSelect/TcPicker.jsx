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

const docName = "tc";

const TCPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem }) => {
    const [tcs, setTcs] = useState([]);
    const { t } = useTranslation();

    // Get the TC list from the cache on component load.
    useEffect(() => {
        async function reqLoaclTcs() {
            const localTcs = await GetLocalCache(docName);
            setTcs(localTcs);
        }
        reqLoaclTcs();
    }, []);

    // Refresh
    const handleRefreshTcs = async () => {
        // Request latest TC Archive from backend server
        await InitDocCache(docName);
        let newTcs = await GetLocalCache(docName);
        // Refresh
        setTcs(newTcs);
    };

    return (
        <>
            <DialogTitle>{t("chooseTC")}</DialogTitle>
            <DocTable
                columns={columns}
                refreshAction={handleRefreshTcs}
                rows={tcs}
                docListTitle="TrainingCourse"
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

export default TCPicker;
