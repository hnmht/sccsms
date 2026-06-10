import { useState, Fragment } from "react";
import {
    Grid,
    Dialog
} from "@mui/material";
import { message } from "mui-message";
import { useTranslation } from "react-i18next";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import UDCList from "./udcList";
import EditUDA from "./editUDA";
import { columns, rowActionsDefine, delMultipleDisabled } from "./construction";
import { GetUDACache, InitDocCache } from "../../../storage/db/db";
import { reqDeleteUDA, reqDeleteUDAs } from "../../../api/uda";

function UserDefineDoc() {
    const [UDAs, setUDAs] = useState([]);
    const [currentUDC, setCurrentUDC] = useState(undefined);
    const [diagStatus, setDiagStatus] = useState({
        currentUDA: undefined,
        isOpen: false,
        isNew: false,
        isModify: false
    });
    const { t } = useTranslation();

    // Refrsh UDA list
    const handleGetUDAList = async (udc) => {
        await InitDocCache("uda");
        handleGetUDACache(udc);
    }
    // Get the UDA list from front-end cache
    const handleGetUDACache = async (udc) => {
        const newUDAs = await GetUDACache(udc.id);
        setUDAs(newUDAs);
    }
    // Actions after select the UDC items
    const handlerSelectUDC = (udc) => {
        setCurrentUDC(udc);
        handleGetUDACache(udc);
    }
    // Close dialog 
    const handleDiagClose = () => {
        setDiagStatus({
            currentUDA: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
    };

    // Actions after click the Ok button in the dialog.
    const handelAddUDAOk = () => {
        setDiagStatus({
            currentUDA: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });    
        handleGetUDAList(currentUDC);
    };

    // Actions after click the Add button in the head.
    const handleAddUDAoc = () => {
        setDiagStatus({
            currentUDA: undefined,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click the Batch delete button in the head.
    const handleDelMultiple = async (udds) => {
        const delRes = await reqDeleteUDAs(udds);
        if (delRes.status) {
            message.success(t("batchDeleteSuccessful"));
            handleGetUDAList(currentUDC);
        } 
    };
    // Actions after click the CopyAdd button in the body.
    const handleRowCopyAdd = (udd) => {
        setDiagStatus({
            currentUDA: udd,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    }
    // Actions after click the view button in the body.
    const handleUDADetail = (udd) => {
        setDiagStatus({
            currentUDA: udd,
            isOpen: true,
            isNew: false,
            isModify: false
        });
    }
    // Actions after click Edit button in the body.
    const handleRowEdit = (udd) => {
        setDiagStatus({
            currentUDA: udd,
            isOpen: true,
            isNew: false,
            isModify: true
        });
    }
    // Actions after click the Delete button in the button.
    const handleRowDelete = async (udd) => {
        const delRes = await reqDeleteUDA(udd);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
            handleGetUDAList(currentUDC);
        }
    }

    return (
        <Fragment>
            <PageTitle pageName={t("MenuUDA")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <Grid container spacing={2} sx={{ height: "100%" }}>
                <Grid item xs={2} >
                    <UDCList isEdit={false} selectOk={handlerSelectUDC} />
                </Grid>
                <Grid item xs={10}>
                    <DocList
                        headAddDisabled={!currentUDC || currentUDC.status !== 0}
                        headRefreshDisabled={!currentUDC}
                        rows={UDAs}
                        columns={columns}
                        rowActionsDefine={rowActionsDefine}
                        delMultipleDisabled={delMultipleDisabled}
                        delMultipleAction={handleDelMultiple}
                        addAction={handleAddUDAoc}
                        refreshAction={() => handleGetUDAList(currentUDC)}
                        rowCopyAdd={handleRowCopyAdd}
                        rowEdit={handleRowEdit}
                        rowDelete={handleRowDelete}
                        rowViewDetail={handleUDADetail}
                    />
                </Grid>
            </Grid>
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleDiagClose}
                open={diagStatus.isOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800 } }}
                closeAfterTransition={false}
            >
                <EditUDA
                    isOpen={diagStatus.isOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriUDA={diagStatus.currentUDA}
                    onCancel={handleDiagClose}
                    onOk={handelAddUDAOk}
                    UDC={currentUDC}
                />

            </Dialog>
        </Fragment>
    );
}

export default UserDefineDoc;