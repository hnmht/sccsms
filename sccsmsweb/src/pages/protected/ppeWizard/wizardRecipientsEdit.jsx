import { useState, memo } from "react";
import {
    Box,
    Button,
    Dialog
} from "@mui/material";
import { message } from "mui-message";
import { cloneDeep } from "lodash";
import DocList from "../../../component/DocList/DocList";
import PersonPicker from "./selectPersonWithOp/PersonPicker";
import { columns, convertPositionsToIDs } from "./selectPersonWithOp/tableConstructor";
import { rowActionsDefine } from "./constructor";

// Wizard step for Recipients edit
const WizardRecipientsEdit = ({ initRecipients, positions, backAction, nextAction, t, height }) => {
    const [recipients, setRecipients] = useState(initRecipients);
    const [dialogOpen, setDialogOpen] = useState(false);
    const opIds = convertPositionsToIDs(positions);
    // Close Dialog
    const handleDiagClose = () => {
        setDialogOpen(false);
    };
    // Actions after click the ok button in the Person picker
    const handleOkClick = (items) => {
        // Close dialog
        setDialogOpen(false);
        // Translate
        handleSelectPersons(items);
    };
    const handleSelectPersons = (items) => {
        const newRs = cloneDeep(recipients);
        let validNumber = 0;
        items.forEach(person => {
            let pNumber = 0;
            newRs.forEach(p => {
                if (p.id === person.id) {
                    pNumber++
                }
            });
            if (pNumber === 0) {
                validNumber++
                newRs.push(person);
            }
        });
        setRecipients(newRs);
        message.info(t("selectMultiplePeople", { count: items.length }) + ", " + t("bulkAddStudentAdded", { count: validNumber }))
    };

    // Actions after click the add button in the header
    const handleAddAction = () => {
        setDialogOpen(true);
    };

    const handleDeletePerson = (item) => {
        const newRs = cloneDeep(recipients);
        const idx = newRs.findIndex((person) => person.id === item.id);
        newRs.splice(idx, 1);
        setRecipients(newRs);
    };

    return (
        <>
            <Box sx={{ width: "90%", flex: 1, paddingTop: 2 }}>
                <DocList
                    columns={columns}
                    rows={recipients}
                    selectColumnVisible={false}
                    headRefreshVisible={false}
                    headFilterVisible={false}
                    headRefAddVisible={false}
                    headDelMultipleVisible={false}
                    adjustContainerHeight={210}
                    rowActionsDefine={rowActionsDefine}
                    addAction={handleAddAction}
                    rowDelete={handleDeletePerson}
                   
                />
                <Dialog
                    open={dialogOpen}
                    fullWidth={true}
                    maxWidth={"lg"}
                    onClose={handleDiagClose}
                    closeAfterTransition={false}
                >
                    <PersonPicker
                        opIds={opIds}
                        cancelClickAction={handleDiagClose}
                        okClickAction={handleOkClick}
                    />
                </Dialog>
            </Box>
            <Box sx={{ width: "100%", height: 48, paddingBottom: 2, paddingRight: 2, paddingLeft: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={backAction}
                        sx={{ mr: 1 }}
                    >
                        {t("previousStep")}
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button variant="contained" onClick={() => nextAction(recipients)} disabled={recipients.length === 0}>
                        {t("nextStep")}
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default memo(WizardRecipientsEdit);