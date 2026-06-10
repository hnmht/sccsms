import { useState } from "react";
import { Grid, Button, Dialog, DialogContent, DialogActions,DialogTitle } from "@mui/material";
import ScInput from "../../../../component/ScInput";
import { reqAddEOComment } from "../../../../api/executionOrder";
import { cloneDeep } from "lodash";
import { message } from "mui-message";

// Execution Order Comment Input Component
const CommentInput = ({ isOpen, currentRow, onCancel, onOk, t }) => {
    const [commentData, setCommitData] = useState(currentRow);
    // Actions after Click the commit button
    const handelCommit = async () => {
        const addRes = await reqAddEOComment(commentData);
        if (addRes.status) {
            message.success(t("addCommentSuccessful"));
        }
        onOk();
    };
    // Actions after Click  the cancel button
    const handleCancel = () => {
        onCancel();
    };

    // Get the passed data from the ScInput Component
    const handleGetValue = (value, itemkey, positionID, rowIndex, errMsg) => {
        if (!isOpen) {
            return
        }
        setCommitData((prevState) => {
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    };
    return commentData === undefined
        ? null
        : <Dialog
            open={isOpen}
            fullWidth={true}
            maxWidth="md"
            onClose={onCancel}
            closeAfterTransition={false}
        >
            <DialogTitle>
                {t("addComments")}
            </DialogTitle>
            <DialogContent sx={{ width: "100%", height: "100%" }}>
                <Grid container spacing={1}>
                    <Grid item xs={8}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="billNumber"
                            itemKey="billNumber"
                            initValue={commentData.billNumber}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="billnumberinput"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="rowNumber"
                            itemKey="rowNumber"
                            initValue={commentData.rowNumber}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="rowNumber"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={510}
                            allowNull={false}
                            isEdit={true}
                            itemShowName="sendTo"
                            itemKey="sendTo"
                            initValue={commentData.sendTo}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="sendTo"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={true}
                            itemShowName="content"
                            itemKey="content"
                            placeholder="contentPlaceholder"
                            initValue={commentData.content}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={2}
                            key="content"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="error">{t("cancel")}</Button>
                <Button variant="contained" onClick={handelCommit} disabled={commentData?.content === ""}>{t("commit")}</Button>
            </DialogActions>
        </Dialog>
};

export default CommentInput;