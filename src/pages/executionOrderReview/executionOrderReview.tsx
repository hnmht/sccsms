import { useState, useEffect } from "react";
import { View, ScrollView, BackHandler, Alert } from "react-native";
import { Text, Button, ActivityIndicator, AnimatedFAB, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { dayjs } from "../../i18n/dayjs";
import { ScVoucherHeader, ScVoucherBody, ScVoucherFooter } from "../../components/ScVoucher";
import ScInput from "../../components/ScInput";
import CommentInput from "./commentInput";
import { reqAddEOReview, reqGetEOComments, reqGetEOReviews } from "../../api/executionOrder";
import { getInitialValue } from "../executionOrder/constructor";
import ReviewsList from "./reviewsList";
import CommentsList from "./commentsList";
import { useBusinessNavigation, useBusinessRoute } from "../../navigation/config/screenParams";
import { ExecutionOrder, EOCommentRecord, EOReviewedRecord, ExecutionOrderRow } from "../../dataType/types/executionOrder";
import { useAppSelector } from "../../store/hooks";
import { ErrMsg, InitialValueMap } from "../../dataType/types/scInput";
import EOReviewBodyMenu from "./EOReviewBodyMenu";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScComponentModal } from "../../components/ScComponentModal/ScComponentModal";

interface EOReviewModelStatus {
    isOpen: boolean;
    content: 1 | 2; // 1 Comments List 2 Reviews list
    comments: EOCommentRecord[] | undefined;
    reviews: EOReviewedRecord[] | undefined;
};

interface EOCommentStatus {
    isOpen: boolean;
    currentRow: ExecutionOrderRow | undefined;
}

const noErr: ErrMsg = { isErr: false, msg: "" };

function ExecutionOrderReview() {
    const navigation = useBusinessNavigation();
    const route = useBusinessRoute<"ExecutionOrderReview">();
    const { isLocal, isNew, isModify, oriWOR, oriEO, startTime, onGoBack } = route.params;
    const [voucherData, setVoucherData] = useState<ExecutionOrder | undefined>((undefined));
    const [currentRowIndex, setCurrentRowIndex] = useState<number>(0);
    const [commentStatus, setCommentStatus] = useState<EOCommentStatus>({
        isOpen: false,
        currentRow: undefined,
    });
    const [modelStatus, setModelStatus] = useState<EOReviewModelStatus>({
        isOpen: false,
        content: 1,
        comments: undefined,
        reviews: undefined,
    })
    const { person } = useAppSelector(state => state.user);

    const row = voucherData ? voucherData.body[currentRowIndex] : undefined;
    const theme = useTheme();
    const { t } = useTranslation();

    // Command button position
    const { buttonPosition, orderPosition, orderVisible, bottomDistance } = useAppSelector(state => state.swapPosition);

    useEffect(() => {
        function initVoucher() {
            const newEO = getInitialValue(isNew, isModify, oriWOR, oriEO);
            setVoucherData(newEO);
        }
        initVoucher();
    }, [oriWOR, isModify, oriEO, isNew]);

    useEffect(() => {
        const backAction = () => {
            return false;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    }, []);

    // Actions after press Commit button in the AddComments dialog
    const handleAddComment = (row: ExecutionOrderRow) => {
        setCommentStatus({
            isOpen: true,
            currentRow: row,
        });
    };
    // Actions after press Cancel button in the addComments dialog
    const handleCommitClose = () => {
        setCommentStatus({
            isOpen: false,
            currentRow: undefined
        });
    };

    // Actions after press CommentsList button 
    const handleOpenCommentsList = async () => {
        if (voucherData === undefined) {
            return
        }
        const res = await reqGetEOComments({ hid: voucherData.id, comments: [] });
        if (!res.status) {
            return
        }
        setModelStatus({
            isOpen: true,
            content: 1,
            comments: res.data.comments,
            reviews: undefined
        });
    };

    // Actions after press ReviewsList button
    const handleOpenReviewsList = async () => {
        if (voucherData === undefined) {
            return
        }
        const res = await reqGetEOReviews({ hid: voucherData.id, reviews: [] })
        if (!res.status) {
            return
        }
        setModelStatus({
            isOpen: true,
            content: 2,
            comments: undefined,
            reviews: res.data.reviews
        });
    };

    // Close model
    const handleCloseModel = () => {
        setModelStatus({
            isOpen: false,
            content: 1,
            comments: undefined,
            reviews: undefined
        });
    };

    const handleGoBack = () => {
        if (onGoBack !== undefined) {
            onGoBack(false);
        }
        navigation.goBack();
    };

    // Actions upon receiving values from ScInput Components
    const handleGetValue = async<T extends keyof InitialValueMap>(
        value: InitialValueMap[T],
        itemKey: string,
        positionID: 0 | 1 | 2,
        rowIndex: number,
        errMsg: ErrMsg
    ) => {
        return
    };

    // Commit Reviewed Record to backend
    const handleAddReview = async () => {
        if (voucherData === undefined) {
            return
        }
        const currentTime = dayjs(new Date()).toISOString();
        let reviewRecord: EOReviewedRecord = {
            id: 0,
            hid: voucherData.id,
            billNumber: voucherData.billNumber,
            startTime: startTime,
            endTime: currentTime,
            consumeSeconds: dayjs(new Date()).diff(dayjs(startTime), "seconds"),
            createDate: currentTime,
            creator: person
        };
        const addRes = await reqAddEOReview(reviewRecord);
        if (addRes.status) {
            Alert.alert(t("tip"), t("reviewedSeconds", { count: reviewRecord.consumeSeconds }));
        } else {
            return
        }
        handleGoBack();
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <View key="voucherTitle" style={{ height: 42, alignItems: "center", justifyContent: "center" }}>
                <Text variant="titleLarge" maxFontSizeMultiplier={1.2}>{t("MenuEOReview")}</Text>
            </View>
            {voucherData !== undefined
                ? <View style={{ flex: 1 }}>
                    <ScrollView>
                        <ScVoucherHeader
                            isHeaderErr={false}
                            title="voucherHeader"
                            buttonPosition={buttonPosition}
                            theme={theme}
                            t={t}
                        >
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="billNumber"
                                errInfo={noErr}
                                itemKey="billNumber"
                                initValue={voucherData.billNumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                positionID={0}
                                rowIndex={-1}
                                width={"100%"}
                            />
                            <ScInput
                                dataType={306}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="billDate"
                                errInfo={noErr}
                                itemKey="billDate"
                                initValue={voucherData.billDate}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                positionID={0}
                                rowIndex={-1}
                                width={"100%"}
                            />
                            <ScInput
                                dataType={520}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="department"
                                errInfo={noErr}
                                itemKey="department"
                                initValue={voucherData.department}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                positionID={0}
                                rowIndex={-1}
                                width={"100%"}
                            />
                            <ScInput
                                dataType={510}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="executor"
                                errInfo={noErr}
                                itemKey="executor"
                                initValue={voucherData.executor}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="executor"
                                positionID={0}
                                rowIndex={-1}
                                width={"100%"}
                            />
                            <ScInput
                                dataType={570}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="csa"
                                errInfo={noErr}
                                itemKey="csa"
                                initValue={voucherData.csa}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="csa"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={580}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="ept"
                                errInfo={noErr}
                                itemKey="ept"
                                initValue={voucherData.ept}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="ept"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="startTime"
                                errInfo={noErr}
                                itemKey="startTime"
                                initValue={voucherData.startTime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="endTime"
                                errInfo={noErr}
                                itemKey="endTime"
                                initValue={voucherData.endTime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={405}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="status"
                                errInfo={noErr}
                                itemKey="status"
                                initValue={voucherData.status}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                positionID={0}
                                rowIndex={-1}
                                width={"100%"}
                            />
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="sourceType"
                                errInfo={noErr}
                                itemKey="sourceType"
                                initValue={voucherData.sourceType}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                positionID={0}
                                rowIndex={-1}
                                width={"100%"}
                            />
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="sourceBillNumber"
                                errInfo={noErr}
                                itemKey="sourceBillNumber"
                                initValue={voucherData.sourceBillNumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                positionID={0}
                                rowIndex={-1}
                                width={"100%"}
                            />
                            <ScInput
                                dataType={302}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="sourceRowNumber"
                                errInfo={noErr}
                                itemKey="sourceRowNumber"
                                initValue={voucherData.sourceRowNumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                positionID={0}
                                rowIndex={-1}
                                width={"100%"}
                            />
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="description"
                                errInfo={noErr}
                                itemKey="description"
                                placeholder={"descriptionPlaceholder"}
                                initValue={voucherData.description}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={403}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="allowAddRow"
                                errInfo={noErr}
                                itemKey="allowAddRow"
                                initValue={voucherData.allowAddRow}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={403}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="allowDelRow"
                                errInfo={noErr}
                                itemKey="allowDelRow"
                                initValue={voucherData.allowDelRow}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                        </ScVoucherHeader>
                        <ScVoucherBody
                            isBodyErr={voucherData.issueNumber > 0}
                            title="voucherBody"
                            buttonPosition={buttonPosition}
                            isEdit={false}
                            addRowAction={() => { }}
                            totalRows={voucherData.body.length}
                            currentRowIndex={currentRowIndex}
                            setCurrentRowIndex={setCurrentRowIndex}
                            addRowDisabled={true}
                            theme={theme}
                            t={t}
                            bodyMenu={<EOReviewBodyMenu
                                eoRows={voucherData.body}
                                setCurrentRowIndex={setCurrentRowIndex}
                                theme={theme}
                                t={t}
                            />}

                        >
                            {row !== undefined
                                ? <>
                                    <View style={{ width: "100%", minHeight: 42, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                                        <Button
                                            mode="elevated"
                                            onPress={() => handleAddComment(row)}
                                            icon="message-plus-outline"
                                            textColor={theme.colors.primary}
                                            style={{ margin: 4 }}
                                        >
                                            {t("addComments")}
                                        </Button>
                                    </View>
                                    <ScInput
                                        dataType={302}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="rowNumber"
                                        errInfo={noErr}
                                        itemKey="rowNumber"
                                        initValue={row.rowNumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"50%"}
                                    />
                                    <ScInput
                                        dataType={405}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="status"
                                        errInfo={noErr}
                                        itemKey="status"
                                        initValue={row.status}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"50%"}
                                    />
                                    <ScInput
                                        dataType={560}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="epa"
                                        errInfo={noErr}
                                        itemKey="epa"
                                        initValue={row.epa}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={590}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="riskLevel"
                                        errInfo={noErr}
                                        itemKey="riskLevel"
                                        initValue={row.riskLevel}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={row.epa.resultType.id as any}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="executionValue"
                                        errInfo={noErr}
                                        itemKey="executionValue"
                                        initValue={row.executionValue}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        positionID={1}
                                        udc={row.epa.udc}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={902}
                                        allowNull={row.isRequireFile === 0}
                                        isEdit={false}
                                        itemShowName="files"
                                        errInfo={noErr}
                                        itemKey="files"
                                        initValue={row.files}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        positionID={1}
                                        isOnSitePhoto={row.isOnSitePhoto === 1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="isRequireFile"
                                        errInfo={noErr}
                                        itemKey="isRequireFile"
                                        initValue={row.isRequireFile}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="isOnSitePhoto"
                                        errInfo={noErr}
                                        itemKey="isOnSitePhoto"
                                        initValue={row.isOnSitePhoto}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="epaDescription"
                                        errInfo={noErr}
                                        itemKey="epaDescription"
                                        initValue={row.epaDescription}
                                        pickDone={handleGetValue}
                                        placeholder=""
                                        isBackendTest={false}
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="description"
                                        errInfo={noErr}
                                        itemKey="description"
                                        initValue={row.description}
                                        pickDone={handleGetValue}
                                        placeholder="descriptionPlaceholder"
                                        isBackendTest={false}
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="isIssue"
                                        errInfo={noErr}
                                        itemKey="isIssue"
                                        initValue={row.isIssue}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                        color={row.isIssue === 1 ? theme.colors.error : theme.colors.onSurfaceDisabled}
                                    />
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="isRectify"
                                        errInfo={noErr}
                                        itemKey="isRectify"
                                        initValue={row.isRectify}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="isHandle"
                                        errInfo={noErr}
                                        itemKey="isHandle"
                                        initValue={row.isHandle}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                    <ScInput
                                        dataType={510}
                                        allowNull={row.isHandle === 0}
                                        isEdit={false}
                                        itemShowName="issueOwner"
                                        errInfo={noErr}
                                        itemKey="issueOwner"
                                        initValue={row.issueOwner}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="issueOwner"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                    <ScInput
                                        dataType={307}
                                        allowNull={row.isHandle === 0}
                                        isEdit={false}
                                        itemShowName="handleStartTime"
                                        errInfo={noErr}
                                        itemKey="handleStartTime"
                                        initValue={row.handleStartTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={307}
                                        allowNull={row.isHandle === 0}
                                        isEdit={false}
                                        itemShowName="handleEndTime"
                                        errInfo={noErr}
                                        itemKey="handleEndTime"
                                        initValue={row.handleEndTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                </>
                                : null
                            }
                        </ScVoucherBody>
                        <ScVoucherFooter isFooterErr={false} title={"voucherFooter"} buttonPosition={buttonPosition} theme={theme} t={t}>
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="creator"
                                errInfo={noErr}
                                itemKey="creator"
                                initValue={voucherData.creator}
                                pickDone={() => { }}
                                isBackendTest={false}
                                positionID={2}
                                rowIndex={-1}
                                width={"100%"}
                            />
                            <ScInput
                                dataType={309}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="createDate"
                                errInfo={noErr}
                                itemKey="createDate"
                                initValue={voucherData.createDate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                positionID={2}
                                rowIndex={-1}
                                width={"100%"}
                            />
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="modifier"
                                errInfo={noErr}
                                itemKey="modifier"
                                initValue={voucherData.modifier}
                                pickDone={() => { }}
                                isBackendTest={false}
                                positionID={2}
                                rowIndex={-1}
                                width={"100%"}
                            />
                            <ScInput
                                dataType={309}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="modifyDate"
                                errInfo={noErr}
                                itemKey="modifyDate"
                                initValue={voucherData.modifyDate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                positionID={2}
                                rowIndex={-1}
                                width={"100%"}
                            />
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="confirmer"
                                errInfo={noErr}
                                itemKey="confirmer"
                                initValue={voucherData.confirmer}
                                pickDone={() => { }}
                                isBackendTest={false}
                                positionID={2}
                                rowIndex={-1}
                                width={"100%"}
                            />
                            <ScInput
                                dataType={309}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="confirmDate"
                                errInfo={noErr}
                                itemKey="confirmDate"
                                initValue={voucherData.confirmDate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                positionID={2}
                                rowIndex={-1}
                                width={"100%"}
                            />
                        </ScVoucherFooter>
                    </ScrollView>
                    {orderVisible
                        ? <>
                            <AnimatedFAB
                                icon="playlist-star"
                                label="reviewRecords"
                                extended={false}
                                visible={true}
                                onPress={handleOpenReviewsList}
                                animateFrom={buttonPosition}
                                style={{ bottom: bottomDistance + 96, position: "absolute", ...orderPosition }}
                            />
                            <AnimatedFAB
                                icon="message-text-outline"
                                label="commentsList"
                                extended={false}
                                visible={true}
                                onPress={handleOpenCommentsList}
                                animateFrom={buttonPosition}
                                style={{ bottom: bottomDistance + 16, position: "absolute", ...orderPosition }}
                            />
                        </>
                        : null
                    }
                    <ScHandSwitch
                        refreshDisplay={false}
                        docRefresh={() => { }}
                        cancelAction={handleAddReview}
                        theme={theme}
                        t={t}
                    />
                </View>
                : <ActivityIndicator animating={true} />
            }
            {commentStatus.isOpen && commentStatus.currentRow !== undefined && voucherData !== undefined
                ? <CommentInput
                    isOpen={commentStatus.isOpen}
                    hid={commentStatus.currentRow.hid}
                    bid={commentStatus.currentRow.id}
                    rowNumber={commentStatus.currentRow.rowNumber}
                    billNumber={voucherData.billNumber}
                    toPerson={voucherData.creator}
                    onOk={handleCommitClose}
                    onCancel={handleCommitClose}
                    author={person}
                    theme={theme}
                    t={t}
                />
                : null
            }
            <ScComponentModal
                visible={modelStatus.isOpen}
            >
                {modelStatus.content === 1
                    ? <CommentsList onCancel={handleCloseModel} comments={modelStatus.comments ?? []} theme={theme} t={t} />
                    : <ReviewsList onCancel={handleCloseModel} reviews={modelStatus.reviews ?? []} theme={theme} t={t} />
                }
            </ScComponentModal>
        </SafeAreaView>
    );
};

export default ExecutionOrderReview;