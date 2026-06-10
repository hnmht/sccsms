import { useState } from "react";
import { Dialog, Button, Portal, MD3Theme } from "react-native-paper";
import ScInput from "../../components/ScInput";
import { reqAddEOComment } from "../../api/executionOrder";
import { Person } from "../../dataType/types/person";
import { TFunction } from "i18next";
import { getEmptyEOComment } from "../../dataType/dataZero/executionOrder";
import { ErrMsg, InitialValueMap } from "../../dataType/types/scInput";

interface CommentInputProps {
    isOpen: boolean;
    hid: number;
    bid: number;
    billNumber: string;
    rowNumber: number;
    toPerson: Person;
    onCancel: () => void;
    onOk: () => void;
    author: Person;
    theme: MD3Theme;
    t: TFunction;
}

function CommentInput({
    isOpen,
    hid,
    bid,
    billNumber,
    rowNumber,
    toPerson,
    onCancel,
    onOk,
    author,
    theme,
    t
}: CommentInputProps) {
    const [commentData, setCommitData] = useState(getEmptyEOComment(author, hid, bid, billNumber, rowNumber, toPerson));
    // Actions upon receiving values from ScInput Components
    const handleGetValue = async <T extends keyof InitialValueMap>(
        value: InitialValueMap[T],
        itemKey: string,
        positionID: 0 | 1 | 2,
        rowIndex: number,
        errMsg: ErrMsg
    ) => {
        if (!isOpen) {
            return
        }
        // Update Commit data
        setCommitData((prevState:any) => {
            return ({
                ...prevState,
                [itemKey]: value,
            });
        });
    };

    // Actions after press commit button    
    const handleCommit = async () => {
        const addRes = await reqAddEOComment(commentData);
        if (!addRes.status) {
            return
        }
        onOk();
    };

    // Actions after press Cancel button
    const handleCancel = () => {
        onCancel();
    };

    return (
        <Portal>
            <Dialog
                visible={isOpen}
                onDismiss={onCancel}
            >
                <Dialog.Title maxFontSizeMultiplier={1}>{t("addComments")}</Dialog.Title>
                <Dialog.Content style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <ScInput
                        dataType={301}
                        allowNull={true}
                        isEdit={false}
                        itemShowName="billNumber"
                        errInfo={{ isErr: false, msg: "" }}
                        itemKey="billNumber"
                        initValue={commentData.billNumber}
                        pickDone={handleGetValue}
                        isBackendTest={false}
                        key="billNumberinput"
                        positionID={2}
                        rowIndex={-1}
                        width={"100%"}
                    />
                    <ScInput
                        dataType={302}
                        allowNull={true}
                        isEdit={false}
                        itemShowName="rowNumber"
                        errInfo={{ isErr: false, msg: "" }}
                        itemKey="rowNumber"
                        initValue={commentData.rowNumber}
                        pickDone={handleGetValue}
                        isBackendTest={false}
                        key="rowNumber"
                        positionID={2}
                        rowIndex={-1}
                        width={ "100%"}
                    />
                    <ScInput
                        dataType={510}
                        allowNull={false}
                        isEdit={true}
                        itemShowName="sendTo"
                        errInfo={{ isErr: false, msg: "" }}
                        itemKey="sendTo"
                        initValue={commentData.sendTo}
                        pickDone={handleGetValue}
                        isBackendTest={false}
                        key="sendTo"
                        positionID={2}
                        rowIndex={-1}
                        width={ "100%"}
                    />
                    <ScInput
                        dataType={301}
                        allowNull={false}
                        isEdit={true}
                        itemShowName="content"
                        errInfo={{ isErr: false, msg: "" }}
                        itemKey="content"
                        placeholder="contentPlaceholder"
                        initValue={commentData.content}
                        pickDone={handleGetValue}
                        isBackendTest={false}
                        isMultiline={true}
                        textLines={3}
                        key="content"
                        positionID={2}
                        rowIndex={-1}
                        width="100%"
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button mode="text" onPress={handleCancel} textColor="red">{t("cancel")}</Button>
                    <Button mode="text" onPress={handleCommit} disabled={commentData.content === ""}>{t("commit")}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default CommentInput;

