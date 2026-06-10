import { useState, useCallback, useEffect } from 'react';
import {
    DialogContent,
    DialogTitle,
    Grid,
    DialogActions,
    Button,
} from "@mui/material";
import { message } from 'mui-message';
import { cloneDeep } from 'lodash';
import { DateTimeFormat, dayjs, EpochTime } from '../../../i18n/dayjs';

import { Divider } from '../../../component/ScMui/ScMui';
import ScInput from '../../../component/ScInput';
import Loader from '../../../component/Loader/Loader';
import MoreInfo from '../../../component/MoreInfo/MoreInfo';

import { reqAddDoc, reqEditDoc } from '../../../api/document';
import { getCurrentPerson } from '../pub/pubFunction';
import { checkVoucherNoBodyErrors } from '../pub/pubFunction';
// Default Attachments
const bodyFiles = {
    id: 0,
    billBID: 0,
    billHID: 0,
    file: { fileid: 0, filehash: "" },
    dr: 0,
};
// Generate initial data
const getInitialValues = async (oriDoc, isNew, isModify, currentDC) => {
    const person = await getCurrentPerson();
    const currentDate = dayjs(new Date());
    let newDoc = { // Add
        id: 0,
        dc: currentDC,
        name: "",
        edition: "",
        author: "",
        releaseDate: currentDate,
        description: "",
        files: [bodyFiles],
        creator: person,
        modifier: { id: 0, code: "", name: "" },
        createDate: currentDate,
        modifyDate: EpochTime
    };

    if (isNew) {
        if (oriDoc) {// copy Add
            newDoc = {
                ...oriDoc,
                id: 0,
                name: "",
                edition: "",
                files: [bodyFiles],
                creator: person,
                modifier: { id: 0, code: "", name: "" },
                createDate: currentDate,
                modifyDate: EpochTime
            };
        }
    } else {
        if (oriDoc) {
            if (isModify) { // Edit
                newDoc = {
                    ...oriDoc,
                    modifier: person,
                    modifyDate: currentDate
                };
            } else {// View
                newDoc = {
                    ...oriDoc
                };
            }
        }
    }
    return newDoc;
};
// Add && Edit && View Document
const EditDocument = ({ isOpen, isNew, isModify, oriDoc, DC, onCancel, onOk, t }) => {
    const [currentDoc, setCurrentDoc] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initValue() {
            const newDoc = await getInitialValues(oriDoc, isNew, isModify, DC);
            setCurrentDoc(newDoc);
        }
        if (isOpen) {
            initValue();
        }
    }, [isOpen, oriDoc, isNew, isModify, DC]);

    // Get the passed data from the ScInput Component
    const handleGetValue = useCallback((value, itemkey, positionID, rowIndex, errMsg) => {
        if (currentDoc === undefined || !isOpen || !isEdit) {
            return
        }
        // Change currentDoc
        setCurrentDoc((prevState) => {
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;

            return newValue;
        });
        // Change errors       
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
    }, [currentDoc, isOpen, isEdit]);

    // Get the Passed error data from the ScInput Component
    const handleGetError = useCallback((value, itemkey, positionID, rowIndex, errMsg) => {
        if (currentDoc === undefined || !isOpen || !isEdit) {
            return
        }
        // change errors       
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
    }, [currentDoc, isOpen, isEdit]);

    // Add or Edit Document
    const handleAddDoc = async () => {
        let thisDoc = cloneDeep(currentDoc);
        delete thisDoc.createDate;
        delete thisDoc.modifyDate;
        if (isModify) {
            let editRes = await reqEditDoc(thisDoc);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            }
        } else {
            let addRes = await reqAddDoc(thisDoc);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            }
        }
    };
    return currentDoc
        ? <>
            <DialogTitle>{t(isNew ? "addDocument" : isModify ? "modifyDocument" : "viewDocument")}</DialogTitle>
            <Divider />
            <DialogContent sx={{ width: "100%", height: "100%" }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="name"
                            itemKey="name"
                            initValue={currentDoc.name}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="namePlaceholder"
                            isBackendTest={false}
                            key="name"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="edition"
                            itemKey="edition"
                            initValue={currentDoc.edition}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="editionPlaceholder"
                            isBackendTest={false}
                            key="edition"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="author"
                            itemKey="author"
                            initValue={currentDoc.author}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="authorPlaceholder"
                            isBackendTest={false}
                            key="author"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={600}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="dc"
                            itemKey="dc"
                            initValue={currentDoc.dc}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            isBackendTest={false}
                            key="dc"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={306}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="releaseDate"
                            itemKey="releaseDate"
                            initValue={currentDoc.releaseDate}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="chooseDate"
                            isBackendTest={false}
                            key="releaseDate"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="description"
                            itemKey="description"
                            initValue={currentDoc.description}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="descriptionPlaceholder"
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={4}
                            key="description"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={902}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="files"
                            itemKey="files"
                            initValue={currentDoc.files}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="selectFiles"
                            isBackendTest={false}
                            key="files"
                            positionID={0}
                            chooseType={"*"}
                            fileMaxSize={60}
                        />
                    </Grid>
                </Grid>
                <MoreInfo>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="creator"
                            itemKey="creator"
                            initValue={currentDoc.creator}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            isBackendTest={false}
                            key="creator"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={309}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="createDate"
                            itemKey="createDate"
                            initValue={currentDoc.createDate}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            isBackendTest={false}
                            key="createDate"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="modifier"
                            itemKey="modifier"
                            initValue={currentDoc.modifier}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            isBackendTest={false}
                            key="modifier"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={309}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="modifyDate"
                            itemKey="modifyDate"
                            initValue={currentDoc.modifyDate}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            isBackendTest={false}
                            key="modifyDate"
                        />
                    </Grid>
                </MoreInfo>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
                {isEdit
                    ? <>
                        <Button color='error' onClick={onCancel}>{t("cancel")}</Button>
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddDoc}>{t(isModify ? "save" : "add")}</Button>
                    </>
                    : <Button variant='contained' onClick={onCancel}>{t("back")}</Button>
                }
            </DialogActions>
        </>
        : <Loader />
};

export default EditDocument;