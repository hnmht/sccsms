import { memo } from "react";
import {
    IconButton,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import {
    DetailIcon,
    EditIcon,
    DeleteIcon,
    CopyNewIcon,
    AddIcon,
    AddRefIcon,
    SearchIcon,
    DownloadIcon,
    PrintIcon,
    SelectColumnIcon,
    DelMultipleIcon,
    SortIcon,
    RefreshIcon,
    StartIcon,
    StopIcon,
    FilterIcon,
    CancelConfirmAllIcon,
    ConfirmAllIcon,
    CancelConfirmIcon,
} from "../PubIcon/PubIcon";
import ScTooltip from "../ScMui/ScTooltip";

function Icon(props) {
    const { iconString, color, fontSize } = props;
    switch (iconString) {
        case "DetailIcon":
            return <DetailIcon color={color} fontSize={fontSize} />;
        case "EditIcon":
            return <EditIcon color={color} fontSize={fontSize} />;
        case "DeleteIcon":
            return <DeleteIcon color={color} fontSize={fontSize} />;
        case "CopyNewIcon":
            return <CopyNewIcon color={color} fontSize={fontSize} />;
        case "AddIcon":
            return <AddIcon color={color} fontSize={fontSize} />;
        case "AddRefIcon":
            return <AddRefIcon color={color} fontSize={fontSize} />;
        case "SearchIcon":
            return <SearchIcon color={color} fontSize={fontSize} />;
        case "DownloadIcon":
            return <DownloadIcon color={color} fontSize={fontSize} />;
        case "PrintIcon":
            return <PrintIcon color={color} fontSize={fontSize} />;
        case "SelectColumnIcon":
            return <SelectColumnIcon color={color} fontSize={fontSize} />;
        case "DelMultipleIcon":
            return <DelMultipleIcon color={color} fontSize={fontSize} />;
        case "SortIcon":
            return <SortIcon color={color} fontSize={fontSize} />;
        case "RefreshIcon":
            return <RefreshIcon color={color} fontSize={fontSize} />;
        case "StartIcon":
            return <StartIcon color={color} fontSize={fontSize} />;
        case "StopIcon":
            return <StopIcon color={color} fontSize={fontSize} />;
        case "FilterIcon":
            return <FilterIcon color={color} fontSize={fontSize} />;
        case "ConfirmAllIcon":
            return <ConfirmAllIcon color={color} fontSize={fontSize} />;
        case "CancelConfirmAllIcon":
            return <CancelConfirmAllIcon color={color} fontSize={fontSize} />;
        case "CancelConfirmIcon":
            return <CancelConfirmIcon color={color} fontSize={fontSize} />;
        default:
            return null;
    }
}

const TableButton = memo(({
    visible,
    disabled,
    color,
    icon,
    tips = "",
    action = () => { },
    fontSize = "small",
    placement = "top" }) => {
    if (!visible) {
        return null;
    } else {
        return (
            <ScTooltip title={tips} disableFocusListener={disabled} placement={placement}>                
                    <IconButton onClick={action} disabled={disabled} >
                        <Icon iconString={icon} fontSize={fontSize} color={!disabled ? color : grey[100]} />
                    </IconButton>             
            </ScTooltip>
        );
    }
})

export default TableButton;