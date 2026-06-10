import { useMemo, useRef } from "react";
import { Tooltip, IconButton, Paper, Stack,FormControlLabel,Checkbox} from "@mui/material";
import { useTranslation } from "react-i18next";
import { FilterAltIcon, FilterAltOffIcon, FilterIcon, DownloadIcon } from "../PubIcon/PubIcon";
import MaterialReactTable from "material-react-table";
// Use the language pack that comes with MRT.
// If you want to support more languange types, you will need to import additional language packs.
import { MRT_Localization_ZH_HANS } from 'material-react-table/locales/zh-Hans';
import { MRT_Localization_EN } from "material-react-table/locales/en";

import { utils, writeFileXLSX } from "xlsx";
import { DateTimeFormat } from "../../i18n/dayjs";
import useContentHeight from "../../hooks/useContentHeight";
import { excelRows, excelColumns } from "./excelExport";

const emptyArr = [];
const emptyFunc = () => { };

// Seacloud Report Component
const ScReport = ({
    columns = emptyArr,
    rows = emptyArr,
    exportFileName = "report",
    headFilterVisible = true,
    headFilterDisabled = true,
    filterAction = emptyFunc,
    defaultHideColumn = {},
    enableStickyFooter = false,
    displayTotalCheck = false,
    showTotalRowChangeAction = emptyFunc,
}) => {
    const list = useRef(null);
    const contentHeight = useContentHeight();
    const { t, i18n } = useTranslation();

    const localization = useMemo(() => {
        switch (i18n.language) {
            case 'zh':
            case 'zh-CN':
                return MRT_Localization_ZH_HANS;
            case 'en':
            case 'en-US':
            default:
                return MRT_Localization_EN;
        }
    }, [i18n.language])

    // Export data in Excel format
    const handleDownloadExcel = () => {
        const fileName = exportFileName + DateTimeFormat() + ".xlsx";
        const eHeader = excelColumns(columns);
        const eRows = excelRows(rows, columns);
        let ws = utils.json_to_sheet(eRows, {
            header: eHeader,
        });
        let wb = utils.book_new();
        utils.book_append_sheet(wb, ws, exportFileName);
        writeFileXLSX(wb, fileName);
    };

    return (
        <Paper sx={{ width: "100%", minHeight: contentHeight, mt: 2, backgroundColor: "paper" }}>
            <MaterialReactTable
                columns={columns}
                data={rows}
                key="scMRTReport"
                tableInstanceRef={list}
                enableStickyHeader
                enableStickyFooter={enableStickyFooter}
                enableColumnResizing
                enableClickToCopy
                enableRowNumbers
                localization={localization}
                initialState={{
                    columnVisibility: defaultHideColumn
                }}
                defaultColumn={{
                    minSize: 20,
                    maxSize: 900,
                    size: 120
                }}
                renderTopToolbarCustomActions={() => (
                    <Stack sx={{ display: "flex", flexDirection: "row" }}>
                        {headFilterVisible && <Tooltip title={t("filterFromBackend")} key="fileter1">
                            <span>
                                <IconButton onClick={filterAction} disabled={!headFilterDisabled}>
                                    <FilterIcon color="secondary" />
                                </IconButton>
                            </span>
                        </Tooltip>}
                        <Tooltip title={t("downloadExcel")} key="downloadExcel">
                            <IconButton onClick={handleDownloadExcel}>
                                <DownloadIcon color="secondary" />
                            </IconButton>
                        </Tooltip>
                        {displayTotalCheck                            
                            ? <FormControlLabel
                                control={<Checkbox checked={enableStickyFooter} onChange={showTotalRowChangeAction} id="displayfootercheck" />}
                                label={t("showTotalRow")}
                                sx={{ marginLeft: 2 }}
                            />
                            : null
                        }
                    </Stack>
                )}
                icons={{
                    FilterListIcon: (props) => <FilterAltIcon {...props} />,
                    FilterListOffIcon: (props) => <FilterAltOffIcon {...props} />,
                }}
                muiTableBodyCellProps={{
                    sx: (theme) => ({
                        backgroundColor: theme.palette.background.paper,
                    })
                }}
                muiTopToolbarProps={{
                    sx: (theme) => ({
                        backgroundColor: theme.palette.background.paper,
                    })
                }}
                muiTableContainerProps={{ sx: { height: `${contentHeight - 114}px` } }}
                muiBottomToolbarProps={{
                    sx: (theme) => ({
                        backgroundColor: theme.palette.background.paper
                    }),

                }}
                muiTablePaginationProps={{
                    SelectProps: { name: "tablePaginationInput" }
                }}

            />
        </Paper>
    );
};

export default ScReport;