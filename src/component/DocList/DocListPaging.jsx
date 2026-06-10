import { useState, useRef, useEffect } from "react";
import {
    TableContainer,
    Table,
    TableHead as MuiTableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper as MuiPaper,
    TablePagination,
    Checkbox,
    Box,
} from "@mui/material";
import { spacing } from "@mui/system";
import styled from "@emotion/styled";
import { utils, writeFileXLSX } from "xlsx";
import { useReactToPrint } from "react-to-print";
import { matchSorter } from "match-sorter";
import { cloneDeep } from "lodash";

import OperateArea from "./OperateArea";
import RowActions from "./RowActions";

import { getOrderBy, getSortColumns, getColumnsKey, excelColumns, excelRows } from "./tools";
import { MultiSortByArr } from "../../utils/tools";
import { DateTimeFormat } from "../../i18n/dayjs";
import useContentHeight from "../../hooks/useContentHeight";
import { useTranslation } from "react-i18next";
const Paper = styled(MuiPaper)(spacing);

const TableHead = styled(MuiTableHead)`
    ${spacing};
    border-top: 2px solid ${(props) => props.theme.palette.divider};
    border-bottom: 2px solid ${(props) => props.theme.palette.divider};
`;

const emptyFunc = () => { };

const DocListPaging = ({
    columns,
    rows = [],
    selectColumnVisible = true,
    // Define Add button in the header
    headAddVisible = true,
    headAddDisabled = false,
    addAction = emptyFunc,
    // Define the Reference Add button in the header 
    headRefAddVisible = false,
    headRefAddDisabled = false,
    addRefAction = emptyFunc,
    // Define the Fileter button in the header
    headFilterVisible = false,
    headFilterDisabled = false,
    filterAction = emptyFunc,
    // Define the Refresh button in the header
    headRefreshVisible = true,
    headRefreshDisabled = false,
    refreshAction = emptyFunc,
    // Define the Batch button in the header
    headDelMultipleVisible = false,
    delMultipleDisabled = () => true,
    delMultipleAction = emptyFunc,
    // Define the Confirm button in the header
    headConfirmVisible = false,
    headConfirmDisabled = () => true,
    confirmMultipleAction = emptyFunc,
    // Define the UnConfirm button in the header
    headCancelConfirmVisible = false,
    headCancelConfirmDisabled = () => true,
    cancelConfirmMultipleAction = emptyFunc,
    // Define Row action buttons
    rowActionsDefine = defaultRowActions,
    rowCopyAdd = emptyFunc,
    rowViewDetail = emptyFunc,
    rowEdit = emptyFunc,
    rowDelete = emptyFunc,
    rowStart = emptyFunc,
    rowStop = emptyFunc,
    // Table Footer Navigation Definition
    rowCount = 0,
    rowsPerPage = 10,
    page = 0,
    pageChangeAction = emptyFunc,
    rowsPerPageChangeAction = emptyFunc,
    // Other
    docListTitle = "documentList",
}) => {
    const { t } = useTranslation();
    const list = useRef(null);
    const [currentRows, setCurrentRows] = useState(rows);
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentColumns, setCurrentColumns] = useState(columns);
    const [orderBy, setOrderBy] = useState(getOrderBy(getSortColumns(columns)));
    const containerHeight = useContentHeight() - 102;
    useEffect(() => {
        setCurrentRows(rows);
        setSelectedRows([]);
    }, [rows]);

    // Actions after receiving the column settings result data
    const handleGetSetColumnResult = (setColumnResult) => {
        setCurrentColumns(setColumnResult);
    };
    // Actions after receiving the sort settings result data
    const handleGetSortReuslt = (sortResult) => {
        setOrderBy(sortResult);
    };
    // Download Excel
    const handleDownload = () => {
        const fileName = docListTitle + DateTimeFormat() + ".xlsx";
        const eHeader = excelColumns(currentColumns);
        const eRows = excelRows(currentRows, currentColumns);
        let ws = utils.json_to_sheet(eRows, {
            header: eHeader,
        });
        let wb = utils.book_new();
        utils.book_append_sheet(wb, ws, docListTitle);
        writeFileXLSX(wb, fileName);
    };
    // Print Table
    const handlePrint = useReactToPrint({
        documentTitle: docListTitle,
        content: () => list.current.getElementsByTagName("table")[0],
    });

    // Actions after the search keyword change
    const handleGetKeyWord = (word) => {
        const searchedRows = matchSorter(rows, word, { keys: getColumnsKey(columns) });
        setCurrentRows(searchedRows);
    };

    // Actions after the Select All checkbox value change
    const handleAllSelectChange = () => {
        let newSelectedRows = [];
        // If the number of selected rows equals zero, select all current rows
        if (selectedRows.length === 0) {
            newSelectedRows = currentRows;
        }
        setSelectedRows(newSelectedRows);
    };

    // Actions after the Row Select Checkbox value change
    const handleRowSelectChange = (row) => {
        let newSelectedRows = cloneDeep(selectedRows);
        let currentIndex = newSelectedRows.findIndex((value) => value.id === row.id);
        // If the current row is already in the list
        if (currentIndex >= 0) { // Remove the current row from the array
            newSelectedRows.splice(currentIndex, 1);
        } else { // Add the current row to the array
            newSelectedRows.push(row);
        }
        setSelectedRows(newSelectedRows);
    };

    // Actions after click Batch delete rows
    const handleDeleteMultipleRow = () => {
        delMultipleAction(selectedRows);
    };

    return (
        <Paper sx={{ width: '100%', minHeight: 256, overflow: 'hidden' }}>
            <OperateArea
                Columns={currentColumns}
                OriginColumns={columns}

                headAddVisible={headAddVisible}
                headAddDisabled={headAddDisabled}
                addAction={addAction}

                headRefAddVisible={headRefAddVisible}
                headRefAddDisabled={headRefAddDisabled}
                addRefAction={addRefAction}

                headFilterVisible={headFilterVisible}
                headFilterDisabled={headFilterDisabled}
                filterAction={filterAction}

                headRefreshVisible={headRefreshVisible}
                headRefreshDisabled={headRefreshDisabled}
                refreshAction={refreshAction}

                headDelMultipleVisible={headDelMultipleVisible}
                delMultipleDisabled={delMultipleDisabled(selectedRows)}
                delMultipleAction={handleDeleteMultipleRow}

                headConfirmVisible={headConfirmVisible}
                headConfirmDisabled={headConfirmDisabled(selectedRows)}
                confirmMultipleAction={() => confirmMultipleAction(selectedRows)}

                headCancelConfirmVisible={headCancelConfirmVisible}
                headCancelConfirmDisabled={headCancelConfirmDisabled(selectedRows)}
                cancelConfirmMultipleAction={() => cancelConfirmMultipleAction(selectedRows)}

                downloadAction={handleDownload}
                printAction={handlePrint}

                getOrderByAction={handleGetSortReuslt}
                getSetColumnAction={handleGetSetColumnResult}
                getKeyWordAction={handleGetKeyWord}
            />
            <TableContainer ref={list} sx={{ height: containerHeight, width: "100%", px: 1 }}>
                <Table stickyHeader size="medium" aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {selectColumnVisible
                                ? <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        id="doclistheadcheckbox"
                                        indeterminate={selectedRows.length > 0 && selectedRows.length < currentRows.length}
                                        checked={selectedRows.length > 0 && selectedRows.length === currentRows.length}
                                        onChange={handleAllSelectChange}
                                        inputProps={{
                                            'aria-label': "Select All or Deselect All"
                                        }}
                                    />
                                </TableCell>
                                : null
                            }
                            {
                                currentColumns.map((column) => {
                                    if (!column.visible) {
                                        return undefined;
                                    }
                                    return (<TableCell key={"head" + column.id} align={column.alignment} style={{ minWidth: column.minWidth, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {t(column.label)}
                                    </TableCell>);
                                })
                            }
                            <TableCell key={"headActons"} align={"center"} style={{ minwidth: 200 }}>{t("action")}</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {currentRows
                            .sort(MultiSortByArr(orderBy))
                            .map((row, index) => {
                                const isItemSelected = selectedRows.findIndex((value) => value.id === row.id) >= 0;
                                return (
                                    <TableRow hover tabIndex={-1} key={row.id}>
                                        {selectColumnVisible
                                            ? <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    id={`doclistbodycheckbox${index}`}
                                                    checked={isItemSelected}
                                                    onChange={() => handleRowSelectChange(row)}
                                                />
                                            </TableCell>
                                            : null
                                        }
                                        {currentColumns.map((column) => {
                                            if (!column.visible) {
                                                return undefined;
                                            }
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.alignment} sx={{ m: 2, p: 2 }} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} >
                                                    {column.display.type === 0
                                                        ? value
                                                        : column.display.cell1(row, column)
                                                    }
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell key={row.id + "actions"} align="center" sx={{ m: 2, p: 2 }} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            <RowActions
                                                row={row}
                                                define={rowActionsDefine}
                                                rowCopyAdd={rowCopyAdd}
                                                rowViewDetail={rowViewDetail}
                                                rowEdit={rowEdit}
                                                rowDelete={rowDelete}
                                                rowStart={rowStart}
                                                rowStop={rowStop}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <TablePagination
                    component="div"
                    width={"100%"}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    count={rowCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    showFirstButton
                    showLastButton
                    onPageChange={(pageChangeAction)}
                    onRowsPerPageChange={rowsPerPageChangeAction}
                    labelRowsPerPage={t("perPage")}
                    sx={{ borderBottom: "none" }}
                    SelectProps={{ name: "tablePaginationInput" }}
                />
            </Box>
        </Paper>
    );
}

const defaultRowActions = {
    rowCopyAdd: {
        visible: true,
        disabled: () => { return false },
        color: "success",
        tips: "copyAdd",
        icon: "CopyNewIcon",
    },
    rowViewDetail: {
        visible: true,
        disabled: () => { return false },
        color: "secondary",
        tips: "detail",
        icon: "DetailIcon",
    },
    rowEdit: {
        visible: true,
        disabled: () => { return false },
        color: "warning",
        tips: "edit",
        icon: "EditIcon",
    },
    rowDelete: {
        visible: true,
        disabled: () => { return false },
        color: "error",
        tips: "delete",
        icon: "DeleteIcon",
    },
    rowStart: {
        visible: false,
        disabled: () => { return true },
        color: "success",
        tips: "enable",
        icon: "StartIcon",
    },
    rowStop: {
        visible: false,
        disabled: () => { return true },
        color: "error",
        tips: "disable",
        icon: "StopIcon",
    },
};

export default DocListPaging;