import { useState, memo} from "react";
import {
    IconButton,
    Dialog,
    Tooltip,
} from "@mui/material";
import { GroupAddIcon } from "../../../../component/PubIcon/PubIcon";
import PersonPicker from "./PersonPicker";
import { useTranslation } from "react-i18next";

const SelectMultiplePerson = (props) => {
    const { isEdit, title = "bulkSelectPersonnel", onOk } = props;
    const [dialogOpen, setDialogOpen] = useState(false);
    const {t} = useTranslation();

    // Close Dialog
    const handleDiagClose = () => {
        setDialogOpen(false);
    };

    // Actions afer click the ok button
    const handleOkClick = (items) => {
        setDialogOpen(false);
        // Transfer data
        onOk(items);
    };

    return (
        <>
            <Tooltip title={t(title)} placement="top" >
                <span>
                    <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                        <GroupAddIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
                    </IconButton>
                </span>
            </Tooltip>
            <Dialog
                open={dialogOpen}
                fullWidth={true}
                maxWidth={"lg"}
                onClose={handleDiagClose}
                closeAfterTransition={false}
            >
                <PersonPicker
                    cancelClickAction={handleDiagClose}
                    okClickAction={handleOkClick}
                    t={t}
                />
            </Dialog>
        </>
    );
};

export default memo(SelectMultiplePerson);