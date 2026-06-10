import { useState, useEffect } from "react";
import {
    Stack,
    Typography,
    Grid,
    DialogActions,
    Button,
    Tooltip,
    IconButton,
    Box,
    Tabs,
    Tab,
    Dialog
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { AddCommentIcon } from "../../../../component/PubIcon/PubIcon";
import { message } from "mui-message";
import { dayjs } from "../../../../i18n/dayjs";
import { ScVoucherBody, ScVoucherBodyRow } from "../../../../component/ScVoucher";
import Loader from "../../../../component/Loader/Loader";
import ScInput from "../../../../component/ScInput";
import CommentInput from "./commentInput";
import CommentsList from "./commentsList";
import ReviewsList from "./reviewsList";
import { bodyColumns } from "./constructor";
import { reqAddEOReview, reqGetEOComments, reqGetEOReviews } from "../../../../api/executionOrder";

const ReviewEO = ({ isOpen, eoData, startTime, onBack }) => {
    const [comments, setComments] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [commitStatus, setCommitStatus] = useState({
        isOpen: false,
        currentRow: undefined,
    });
    const { t } = useTranslation();

    useEffect(() => {
        async function initVoucher() {
            // Request comments list
            let newComments = [];
            const commentsRes = await reqGetEOComments({ hid: eoData.id })
            if (commentsRes.status) {
                if (commentsRes.comments !== null) {
                    newComments = commentsRes.data.comments;
                }
            }
            setComments(newComments);
            // Request Review Records list
            let newReviews = [];
            const reviewRes = await reqGetEOReviews({ hid: eoData.id });
            if (reviewRes.status) {
                if (reviewRes.data.reviews !== null) {
                    newReviews = reviewRes.data.reviews;
                }
            }
            setReviews(newReviews);
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, eoData]);

    // Get the passed data from the ScInput Component
    const handleGetValue = async (value, itemkey, positionID, rowIndex, errMsg) => {
        return
    };

    // Actions after Tab changed
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Actions after click comment button in the row
    const handleAddCommentClick = (row, index) => {
        setCommitStatus({
            isOpen: true,
            currentRow: { hid: eoData.id, bid: row.id, billNumber: eoData.billNumber, rowNumber: row.rowNumber, sendTo: eoData.creator, content: "" },
        });
    };

    // Close Comments Component
    const handleCommitClose = () => {
        setCommitStatus({
            isOpen: false,
            currentRow: undefined
        });
    };
    // Actions after click submit button in commit Component 
    const handleCommitOk = () => {
        setCommitStatus({
            isOpen: false,
            currentRow: undefined
        });
        // Request the EO's latest comments
        handleRefreshComments();
    };
    // Request the EO's latest comments
    const handleRefreshComments = async () => {
        let newComments = [];
        const commentsRes = await reqGetEOComments({ hid: eoData.id })
        if (commentsRes.status) {
            newComments = commentsRes.data.comments;
        }
        setComments(newComments);
    }

    // Actions after click the back button in footer
    const handleBackClick = () => {
        handleAddReview();
        onBack();
    }

    // Submit Review record
    const handleAddReview = async () => {
        const currentTime = dayjs(new Date());
        let reviewRecord = {
            id: 0,
            hid: eoData.id,
            billNumber: eoData.billNumber,
            startTime: dayjs(startTime),
            endTime: currentTime,
            consumeSeconds: currentTime.diff(dayjs(startTime), "seconds")
        };
        const addRes = await reqAddEOReview(reviewRecord);
        if (addRes.status) {
            message.success(t("reviewedSeconds", { count: reviewRecord.consumeSeconds }));
        }
    };

    return (eoData !== undefined
        ? <>
            <Box sx={{ display: "flex", flexDirection: "row", height: "100%", width: "100%", overflow: "auto" }}>
                <Box sx={{ width: "80%", height: "100%" }}>
                    <Stack component="div" id="reviewEO" sx={{ overflowX: "hidden", overflowY: "auto", p: 2 }}>
                        <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                            <Typography variant="h3" component={"h3"}>{t("eo")}</Typography>
                        </Stack>
                        <Stack component="div" id="voucherHead" sx={{ p: 2 }}>
                            <Grid container id="VoucherHeader" spacing={2}>
                                <Grid item xs={1.5}>
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="billNumber"
                                        itemKey="billNumber"
                                        initValue={eoData.billNumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="billNumber"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={1.5}>
                                    <ScInput
                                        dataType={306}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="billDate"
                                        itemKey="billDate"
                                        initValue={eoData.billDate}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="billDate"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={520}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="department"
                                        itemKey="department"
                                        initValue={eoData.department}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="department"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={570}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="csa"
                                        itemKey="csa"
                                        initValue={eoData.csa}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="csa"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={510}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="executor"
                                        itemKey="executor"
                                        initValue={eoData.executor}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="executor"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={580}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="ept"
                                        itemKey="ept"
                                        initValue={eoData.ept}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="ept"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <ScInput
                                        dataType={405}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="status"
                                        itemKey="status"
                                        initValue={eoData.status}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="status"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={1.5}>
                                    <ScInput
                                        dataType={307}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="startTime"
                                        itemKey="startTime"
                                        initValue={eoData.startTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="startTime"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={1.5}>
                                    <ScInput
                                        dataType={307}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="endTime"
                                        itemKey="endTime"
                                        initValue={eoData.endTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="endTime"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>

                                <Grid item xs={1}>
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="sourceType"
                                        itemKey="sourceType"
                                        initValue={t(eoData.sourceType)}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="sourceType"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="sourceBillNumber"
                                        itemKey="sourceBillNumber"
                                        initValue={eoData.sourceBillNumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="sourceBillNumber"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="sourceRowNumber"
                                        itemKey="sourceRowNumber"
                                        initValue={eoData.sourceRowNumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="sourceRowNumber"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={5} >
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="description"
                                        itemKey="description"
                                        placeholder={"descriptionPlaceholder"}
                                        initValue={eoData.description}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="description"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <ScInput
                                        dataType={403}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="allowAddRow"
                                        itemKey="allowAddRow"
                                        initValue={eoData.allowAddRow}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="allowAddRow"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <ScInput
                                        dataType={403}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="allowDelRow"
                                        itemKey="allowDelRow"
                                        initValue={eoData.allowDelRow}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="allowDelRow"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                        <ScVoucherBody bodyColumns={bodyColumns} addRowAction={() => { }} addRowVisible={false} height={500}>
                            <ScVoucherBodyRow >
                                {eoData.body.map((row, index) => {
                                    return row.dr === 0
                                        ? (<tr key={"bodyrow" + row.rowNumber} >
                                            <td>
                                                <Tooltip title={t("addComments")} key={`rowDelete${index}`}>
                                                    <span>
                                                        <IconButton size="small" sx={{ width: 40, height: 40 }} disabled={commitStatus.isOpen} onClick={() => handleAddCommentClick(row, index)}>
                                                            <AddCommentIcon color={commitStatus.isOpen ? "transparent" : "primary"} fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={302}
                                                    allowNull={false}
                                                    isEdit={false}
                                                    itemShowName="rowNumber"
                                                    itemKey="rowNumber"
                                                    initValue={row.rowNumber}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="rowNumber"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={560}
                                                    allowNull={false}
                                                    isEdit={false}
                                                    itemShowName="epa"
                                                    itemKey="epa"
                                                    initValue={row.epa}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="epa"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={row.epa.resultType.id}
                                                    allowNull={false}
                                                    isEdit={false}
                                                    itemShowName="executionValue"
                                                    itemKey="executionValue"
                                                    initValue={row.executionValue}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="executionValue"
                                                    positionID={1}
                                                    rowIndex={index}
                                                    udc={row.epa.udc}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={902}
                                                    allowNull={row.isRequireFile === 0}
                                                    isEdit={false}
                                                    itemShowName="files"
                                                    itemKey="files"
                                                    initValue={row.files}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="files"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={590}
                                                    allowNull={false}
                                                    isEdit={false}
                                                    itemShowName="riskLevel"
                                                    itemKey="riskLevel"
                                                    initValue={row.riskLevel}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="riskLevel"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={301}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="epaDescription"
                                                    itemKey="epaDescription"
                                                    initValue={row.epaDescription}
                                                    pickDone={handleGetValue}
                                                    placeholder=""
                                                    isBackendTest={false}
                                                    key="epaDescription"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={301}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="description"
                                                    itemKey="description"
                                                    initValue={row.description}
                                                    pickDone={handleGetValue}
                                                    placeholder="descriptionPlaceholder"
                                                    isBackendTest={false}
                                                    key="description"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={403}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="isIssue"
                                                    itemKey="isIssue"
                                                    initValue={row.isIssue}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="isIssue"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={403}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="isRectify"
                                                    itemKey="isRectify"
                                                    initValue={row.isRectify}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="isRectify"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={403}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="isHandle"
                                                    itemKey="isHandle"
                                                    initValue={row.isHandle}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="isHandle"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={510}
                                                    allowNull={row.isHandle === 0}
                                                    isEdit={false}
                                                    itemShowName="issueOwner"
                                                    itemKey="issueOwner"
                                                    initValue={row.issueOwner}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="issueOwner"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={307}
                                                    allowNull={row.isHandle === 0}
                                                    isEdit={false}
                                                    itemShowName="handleStartTime"
                                                    itemKey="handleStartTime"
                                                    initValue={row.handleStartTime}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="handleStartTime"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={307}
                                                    allowNull={row.isHandle === 0}
                                                    isEdit={false}
                                                    itemShowName="handleEndTime"
                                                    itemKey="handleEndTime"
                                                    initValue={row.handleEndTime}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="handleEndTime"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={403}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="isRequireFile"
                                                    itemKey="isRequireFile"
                                                    initValue={row.isRequireFile}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="isRequireFile"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={403}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="isOnSitePhoto"
                                                    itemKey="isOnSitePhoto"
                                                    initValue={row.isOnSitePhoto}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="isOnSitePhoto"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={405}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="status"
                                                    itemKey="status"
                                                    initValue={row.status}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="status"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                        </tr>
                                        )
                                        : null
                                })}
                            </ScVoucherBodyRow>
                        </ScVoucherBody>
                        <Stack component="div" id="voucherRoot">
                            <Grid container id="voucherRoot" spacing={2}>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={510}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="creator"
                                        itemKey="creator"
                                        initValue={eoData.creator}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="creator"
                                        positionID={2}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={309}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="createDate"
                                        itemKey="createDate"
                                        initValue={eoData.createDate}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="createDate"
                                        positionID={2}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={510}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="modifier"
                                        itemKey="modifier"
                                        initValue={eoData.modifier}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="modifier"
                                        positionID={2}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={309}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="modifyDate"
                                        itemKey="modifyDate"
                                        initValue={eoData.modifyDate}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="modifyDate"
                                        positionID={2}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={510}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="confirmer"
                                        itemKey="confirmer"
                                        initValue={eoData.confirmer}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="confirmer"
                                        positionID={2}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={309}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="confirmDate"
                                        itemKey="confirmDate"
                                        initValue={eoData.confirmDate}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="confirmDate"
                                        positionID={2}
                                        rowIndex={-1}
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                    </Stack>
                    <DialogActions >
                        <Button variant="contained" onClick={handleBackClick} >{t("back")}</Button>
                    </DialogActions>
                </Box>
                <Box sx={{ width: "20%", height: "866px", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', height: 48 }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="reviewEO tab">
                            <Tab label={t("commentsList")} id="commentsList" />
                            <Tab label={t("reviewRecords")} id="reviewList" />
                        </Tabs>
                    </Box>
                    <Box sx={{ flex: 1, width: "100%", borderWidth: 1, borderColor: "divider", borderStyle: "solid", overflow: "auto", marginBottom: 2 }}>
                        {tabValue === 0
                            ? <CommentsList comments={comments} t={t} />
                            : <ReviewsList reviews={reviews} t={t} />
                        }
                    </Box>
                    {commitStatus.isOpen
                        ? <CommentInput
                            isOpen={commitStatus.isOpen}
                            currentRow={commitStatus.currentRow}
                            onOk={handleCommitOk}
                            onCancel={handleCommitClose}
                            t={t}
                        />
                        : null
                    }
                </Box>
            </Box>
        </>
        : <Loader />
    );
};

export default ReviewEO;