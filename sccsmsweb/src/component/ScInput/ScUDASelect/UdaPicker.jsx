import React,{useState,useEffect,memo} from "react";
import {
    DialogTitle,
    DialogActions,
    Button,
} from "@mui/material";
import DocTable from "../../DocTable/DocTable";
import { columns } from "./tableConstructor";
import { InitDocCache,GetUDACache } from "../../../storage/db/db";
import { useTranslation } from "react-i18next";

const docName = "uda";
const UdaPicker = ({udc,clickItemAction,doubleClickItemAction,cancelClickAction,okClickAction,currentItem}) => {
    const [udas, setUdas] = useState([]);
    const {t} = useTranslation();
    useEffect(() => {
        async function getLocalUDAs() {
            const localUdds = await GetUDACache(udc.id);
            setUdas(localUdds);
        }
        getLocalUDAs();        
    }, [udc]);

    // Refresh the UDA list 
    const handleRefreshUdas = async () => {
        let newUdds = [];
        if (udc && udc.id !== 0 ) {
            await InitDocCache(docName);
            newUdds = await GetUDACache(udc.id);
        }
        setUdas(newUdds);
    };

    return (
        <>
            <DialogTitle>{t("chooseUDA",{udcName:udc.name})}</DialogTitle>
            <DocTable
                columns={columns}
                refreshAction={handleRefreshUdas}
                rows={udas}
                docListTitle="UDAList"
                clickItem={clickItemAction}
                doubleClickItem={doubleClickItemAction}
                isMultiple={false}
            />
            <DialogActions sx={{m:1}}>
                <Button color="error" onClick={cancelClickAction}>{t("cancel")}</Button>
                <Button variant="contained" disabled={currentItem.id === 0} onClick={okClickAction}>{t("ok")}</Button>
            </DialogActions>
        </>
    );
}

export default memo(UdaPicker);