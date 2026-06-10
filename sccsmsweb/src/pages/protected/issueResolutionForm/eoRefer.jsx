import { useEffect, useState } from "react";
import { DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Divider } from "../../../component/ScMui/ScMui";
import DocTable from "../../../component/DocTable/DocTable";
import { transConditionsToString } from "../../../component/QueryPanel";
import { reqReferEO } from "../../../api/executionOrder";
import { columns } from "./eoConstructor";

const EORefer = ({ title, conditions, cancelClickAction, okClickAction, filterAction }) => {
    const [rows, setRows] = useState([]);
    const [currentItem, setCurrentItem] = useState({ id: 0 })
    const {t} = useTranslation();
    useEffect(() => {
        async function reqData() {
            let querystring = transConditionsToString(conditions);
            const res = await reqReferEO({ querystring: querystring });
            let newRows = [];
            if (res.status) {
                newRows = res.data;
            }
            setRows(newRows);
        }
        reqData();
    }, [conditions]);

    const handleClickItem = (item) => {
        setCurrentItem(item);
    };

    const handleDoubleClickItem = (item) => {
        setCurrentItem(item);
        okClickAction(item);
    };
    
    return (
        <>
            <DialogTitle>
                {t(title)}
            </DialogTitle>
            <Divider />
            <DialogContent>
                <DocTable
                    columns={columns}
                    rows={rows}
                    isMultiple={false}
                    dispIncludeDisabled={false}
                    disabledStatus={0}
                    headRefreshVisible={false}
                    headFilterVisible={true}
                    filterAction={filterAction}
                    clickItem={handleClickItem}
                    doubleClickItem={handleDoubleClickItem}
                />
            </DialogContent>
            <Divider />
            <DialogActions sx={{ m: 1 }}>
                <Button color="error" onClick={cancelClickAction}>{t("cancel")}</Button>
                <Button variant="contained" disabled={currentItem.id === 0} onClick={() => handleDoubleClickItem(currentItem)}>{t("ok")}</Button>
            </DialogActions>
        </>
    );
};

export default EORefer;