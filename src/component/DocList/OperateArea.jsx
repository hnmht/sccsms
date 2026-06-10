import { useCallback, useState } from "react";
import {
    Stack,
    IconButton,
    Popover,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { getSortColumns, getOrderBy } from "./tools";
import { CloseIcon, CheckIcon } from "../PubIcon/PubIcon";
import TableButton from "./TableButton";
import SetSortView from "./SetSortView";
import SetColumnView from "./SetColumnView";
import ScTooltip from "../ScMui/ScTooltip";
import ScInput from "../ScMui/ScInput";


const OperateArea = (props) => {
    const {
        id,
        Columns,
        OriginColumns,

        headAddVisible,
        headAddDisabled,
        addAction,

        headRefAddVisible,
        headRefAddDisabled,
        addRefAction,

        headFilterVisible,
        headFilterDisabled,
        filterAction,

        headRefreshVisible,
        headRefreshDisabled,
        refreshAction,

        headDelMultipleVisible,
        delMultipleDisabled,
        delMultipleAction,

        headConfirmVisible,
        headConfirmDisabled,
        confirmMultipleAction,

        headCancelConfirmVisible,
        headCancelConfirmDisabled,
        cancelConfirmMultipleAction,

        downloadAction,
        printAction,

        getOrderByAction,
        getSetColumnAction,
        getKeyWordAction,

        dispIncludeDisabled = false,
        includeDisabled = true,
        includeDisabledAction = () => { },
    } = props;
    const { t } = useTranslation();
    // Popover related
    // Open the Popover to define column display or sort order
    const [open, setOpen] = useState(false);
    // Popover anchor position
    const [anchorEl, setAnchorEl] = useState(null);
    // Popover display content: Define column or Sort order
    const [popoverType, setPopoverType] = useState(""); //"sort","selectColumn"
    // Define sort order
    const [sortColumns, setSortColumns] = useState(getSortColumns(Columns));
    // Actions after click the sort button in the header
    const handleSort = useCallback((event) => {
        setAnchorEl(event.currentTarget);
        setPopoverType("sort");
        setOpen(true);
    }, []);
    // Actions after click ok button in the sort Popover
    const handleSortOk = (sortColumns) => {
        setSortColumns(sortColumns);
        setPopoverType("");
        setOpen(false);
        // Process the sort data
        const sortResult = getOrderBy(sortColumns, Columns);
        // Pass the sort data to the parent component
        getOrderByAction(sortResult);
    };
    // Actions after click cancel button in the sort Popover
    const handleSortCancel = useCallback((event) => {
        setOpen(false);
        setPopoverType("");
    }, []);

    // Actions after click the Column display button in the header 
    const handleSelectColumn = useCallback((event) => {
        setAnchorEl(event.currentTarget);
        setPopoverType("selectColumn");
        setOpen(true);
    }, []);
    // Actions after click the ok button in the Colunm setup Popover
    const handleSetColumnOk = (columns) => {
        setOpen(false);
        setPopoverType("");
        getSetColumnAction(columns);
    };
    // Actions after click the Cancel button in the column setup Popover
    const handleSetColumnCancel = () => {
        setOpen(false);
        setPopoverType("");
    };

    // Search related
    const [keyword, setKeyword] = useState("");
    // Actions after click the start search button
    const handleSearch = () => {
        getKeyWordAction(keyword);
    };
    // Actions after keyword input value change
    const keyWordInputChange = (event) => {
        setKeyword(event.target.value);
        if (event.target.value === "") {
            getKeyWordAction("");
        }
    };

    // Actions after click the clear search keyword button
    const handleKeyWordClear = () => {
        setKeyword("");
        getKeyWordAction("");
    };
    // Close dialog
    const handlePopoverClose = () => {
        setAnchorEl(null);
        setOpen(false);
        setPopoverType("");
    };

    return (
        <Stack
            direction={"row"}
            justifyContent="space-between"
            alignItems={"center"}
            sx={{ p: 2, width: "100%", height: 50 }}
        >
            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                <ScInput
                    placeholder="enterToSearch"
                    id={`searchInput${id}`}
                    value={keyword}
                    onChange={(event) => keyWordInputChange(event)}
                    startAdornment={
                        <ScTooltip title="clear">
                            <span>
                                <IconButton
                                    onClick={handleKeyWordClear}
                                    disabled={keyword === ""}
                                >
                                    <CloseIcon color={keyword === "" ? "divider" : "warning"} fontSize="small" />
                                </IconButton>
                            </span>
                        </ScTooltip>
                    }
                    endAdornment={
                        <ScTooltip title="startSearch">
                            <span>
                                <IconButton
                                    onClick={handleSearch}
                                    disabled={keyword === ""}
                                >
                                    <CheckIcon color={keyword === "" ? "divider" : "success"} fontSize="small" />
                                </IconButton>
                            </span>
                        </ScTooltip>
                    }
                    inputProps={{
                        id: `searchInput${id}`
                    }}
                />
                {dispIncludeDisabled
                    ? <FormControlLabel
                        control={
                            <Checkbox
                                inputProps={{ "aria-label": "Include Disabled" }}
                                checked={includeDisabled}
                                onChange={includeDisabledAction}
                            />}
                        label={t("includeDisabled")}
                        sx={{ marginLeft: 4 }}
                    />
                    : null
                }
            </Stack>
            <Stack direction={"row"} alignItems="center">
                <TableButton
                    key={id + "Add"}
                    visible={headAddVisible}
                    disabled={headAddDisabled}
                    color="primary"
                    icon="AddIcon"
                    tips="add"
                    action={addAction}
                    fontSize="medium"
                    id="Add"
                    aria-describedby="Add"
                />
                <TableButton
                    key={id + "AddRef"}
                    visible={headRefAddVisible}
                    disabled={headRefAddDisabled}
                    color="primary"
                    icon="AddRefIcon"
                    tips="addReference"
                    action={addRefAction}
                    fontSize="medium"
                    id="AddRef"
                    aria-describedby="AddRef"
                />
                <TableButton
                    key={id + "Refresh"}
                    visible={headRefreshVisible}
                    disabled={headRefreshDisabled}
                    color="primary"
                    icon="RefreshIcon"
                    tips="refresh"
                    action={refreshAction}
                    fontSize="medium"
                    id="Refresh"
                    aria-describedby="Refresh"
                />
                <TableButton
                    key={id + "Filter"}
                    visible={headFilterVisible}
                    disabled={headFilterDisabled}
                    color="primary"
                    icon="FilterIcon"
                    tips="filter"
                    action={filterAction}
                    fontSize="medium"
                    id="Filter"
                    aria-describedby="Filter"
                />
                <TableButton
                    key={id + "Sort"}
                    color="primary"
                    visible={true}
                    icon="SortIcon"
                    tips="sorting"
                    action={handleSort}
                    fontSize="medium"
                    id="Sort"
                    aria-describedby="Sort"
                />
                <TableButton
                    key={id + "Download"}
                    color="primary"
                    visible={true}
                    icon="DownloadIcon"
                    tips="downloadExcel"
                    action={downloadAction}
                    fontSize="medium"
                    id="Download"
                    aria-describedby="Download"
                />
                <TableButton
                    key={id + "Print"}
                    color="primary"
                    visible={true}
                    icon="PrintIcon"
                    tips="print"
                    action={printAction}
                    fontSize="medium"
                    id="Print"
                    aria-describedby="Print"
                />
                <TableButton
                    key={id + "SelectColumn"}
                    color="primary"
                    visible={true}
                    icon="SelectColumnIcon"
                    tips="selectColumn"
                    action={handleSelectColumn}
                    fontSize="medium"
                    id="SelectColumn"
                    aria-describedby="SelectColumn"
                />
                <TableButton
                    key={id + "Delmultiple"}
                    color="error"
                    visible={headDelMultipleVisible}
                    disabled={delMultipleDisabled}
                    icon="DelMultipleIcon"
                    tips="batchDelete"
                    action={delMultipleAction}
                    fontSize="medium"
                    id="Delmultiple"
                    aria-describedby="Delmultiple"
                />
                <TableButton
                    key={id + "ConfirmMultiple"}
                    color="success"
                    visible={headConfirmVisible}
                    disabled={headConfirmDisabled}
                    icon="ConfirmAllIcon"
                    tips="batchConfirm"
                    action={confirmMultipleAction}
                    fontSize="medium"
                    id="ConfirmMultiple"
                    aria-describedby="ConfirmMultiple"
                />
                <TableButton
                    key={id + "CancelConfirmMultiple"}
                    color="warning"
                    visible={headCancelConfirmVisible}
                    disabled={headCancelConfirmDisabled}
                    icon="CancelConfirmAllIcon"
                    tips="batchUnconfirm"
                    action={cancelConfirmMultipleAction}
                    fontSize="medium"
                    id="CancelConfirmMultiple"
                    aria-describedby="CancelConfirmMultiple"
                />
            </Stack>
            <Popover
                id="headPoper"
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                {
                    popoverType === "sort"
                        ? <SetSortView
                            sortColumns={sortColumns}
                            sortOk={handleSortOk}
                            sortCancel={handleSortCancel}
                            originColumns={OriginColumns}
                        />
                        : popoverType === "selectColumn"
                            ? <SetColumnView
                                tableColumns={Columns}
                                setColumnOk={handleSetColumnOk}
                                setColumnCancel={handleSetColumnCancel}
                                originColumns={OriginColumns}
                            />
                            : null
                }
            </Popover>
        </Stack>
    );
};

export default OperateArea;