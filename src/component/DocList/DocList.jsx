import { useState, useRef, useEffect, useId } from "react";
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
import { useTranslation } from "react-i18next";

import OperateArea from "./OperateArea";
import RowActions from "./RowActions";

import { getOrderBy, getSortColumns, getColumnsKey, excelColumns, excelRows } from "./tools";
import { MultiSortByArr } from "../../utils/tools";
import { dayjs } from "../../i18n/dayjs";
import useContentHeight from "../../hooks/useContentHeight";
const Paper = styled(MuiPaper)(spacing);
const emptyFunc = () => { };
const emptyArray = [];

const TableHead = styled(MuiTableHead)`
    ${spacing};
    border-top: 2px solid ${(props) => props.theme.palette.divider};
    border-bottom: 2px solid ${(props) => props.theme.palette.divider};
`;

const DocList = ({
    columns = emptyArray,
    rows = emptyArray,
    selectColumnVisible = true,
    // Header Add Button
    headAddVisible = true,
    headAddDisabled = false,
    addAction = emptyFunc,
    // Header add Refrence Button
    headRefAddVisible = false,
    headRefAddDisabled = false,
    addRefAction = emptyFunc,
    // Header Filter Button
    headFilterVisible = false,
    headFilterDisabled = false,
    filterAction = emptyFunc,
    // Header Refresh Button
    headRefreshVisible = true,
    headRefreshDisabled = false,
    refreshAction = emptyFunc,
    // Header Delete Button
    headDelMultipleVisible = true,
    delMultipleDisabled = () => true,
    delMultipleAction = emptyFunc,
    // Header Confirm Button 
    headConfirmVisible = false,
    headConfirmDisabled = () => false,
    confirmMultipleAction = emptyFunc,
    // Header Unconfirm Button
    headCancelConfirmVisible = false,
    headCancelConfirmDisabled = () => true,
    cancelConfirmMultipleAction = emptyFunc,
    // Row Button
    rowActionsDefine = defaultRowActions,
    rowCopyAdd = emptyFunc,
    rowViewDetail = emptyFunc,
    rowEdit = emptyFunc,
    rowDelete = emptyFunc,
    rowStart = emptyFunc,
    rowStop = emptyFunc,
    // Output file default name
    docListTitle = "Document",
    // Height Adjustment Value
    adjustContainerHeight = 102,
}) => {
    const { t } = useTranslation();
    const list = useRef(null);
    const [currentRows, setCurrentRows] = useState(rows);
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentColumns, setCurrentColumns] = useState(columns);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderBy, setOrderBy] = useState(getOrderBy(getSortColumns(columns)));
    const containerHeight = useContentHeight() - adjustContainerHeight;
    const id = useId();

    useEffect(() => {
        setCurrentRows(rows);
        setSelectedRows(emptyArray);
        let newPage = page;
        if (rows.length <= 0) {
            newPage = 0;
        } else {
            let totalPage = Math.ceil(rows.length / rowsPerPage);
            if (totalPage < (newPage + 1)) {
                newPage = newPage - 1;
            }
        }
        setPage(newPage);
    }, [rows, rowsPerPage, page]);
    // Change Page
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    // Modify lines per page display
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    // Action after column setup is complete
    const handleGetSetColumnResult = (setColumnResult) => {
        setCurrentColumns(setColumnResult);
    };

    // Action after sorting setup is complete
    const handleGetSortReuslt = (sortResult) => {
        setOrderBy(sortResult);
    };

    // Download Excel file
    const handleDownload = () => {
        const fileName = docListTitle + "_" + dayjs().toISOString() + ".xlsx";
        // Export all data using xlsx library
        const eHeader = excelColumns(currentColumns);
        const eRows = excelRows(currentRows, currentColumns);
        let ws = utils.json_to_sheet(eRows, {
            header: eHeader,
        });
        let wb = utils.book_new();
        utils.book_append_sheet(wb, ws, docListTitle);
        writeFileXLSX(wb, fileName);
    };
    // Print List
    const handlePrint = useReactToPrint({
        documentTitle: docListTitle,
        content: () => list.current.getElementsByTagName("table")[0],
    });

    // Action after Search Keyword input
    const handleGetKeyWord = (word) => {
        const searchedRows = matchSorter(rows, word, { keys: getColumnsKey(columns) });
        setCurrentRows(searchedRows);
    };

    // Action after header "Select All" checkbox changes
    const handleAllSelectChange = () => {
        let newSelectedRows = [];
        // If the number of selected rows is 0, select all rows.
        if (selectedRows.length === 0) {
            newSelectedRows = currentRows;
        }
        setSelectedRows(newSelectedRows);
    };

    // Action after body "Select" checkbox changes.
    const handleRowSelectChange = (row) => {
        let newSelectedRows = cloneDeep(selectedRows);
        let currentIndex = newSelectedRows.findIndex((value) => value.id === row.id);
        if (currentIndex >= 0) { // if the current row is already selected, remove it from  the array.
            newSelectedRows.splice(currentIndex, 1);
        } else { // Otherwise, add the current row to the array.            
            newSelectedRows.push(row);
        }
        setSelectedRows(newSelectedRows);
    };

    // Delete multiple rows.
    const handleDeleteMultipleRow = () => {
        delMultipleAction(selectedRows);
    }

    return (
        <Paper sx={{ width: '100%', minHeight: 256, overflow: 'hidden' }}>
            <OperateArea
                id={id}
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
                                        id={`headerCheckBox${id}`}
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
                                    return (<TableCell key={"head" + column.id} align={column.alignment} style={{ minWidth: column.minWidth, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {t(column.label)}
                                    </TableCell>);
                                })
                            }
                            <TableCell key={"headActons"} align={"center"} style={{ minWidth: 200 }}>{t("action")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentRows
                            .sort(MultiSortByArr(orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                    count={currentRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    showFirstButton
                    showLastButton
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
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

export default DocList;