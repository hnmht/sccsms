import { Box } from "@mui/material";
import TableButton from "./TableButton";
function RowActions(props) {
    const {
        row,
        define,
        rowCopyAdd,
        rowViewDetail,
        rowEdit,
        rowDelete,
        rowStart,
        rowStop,
    } = props;
    return (
        <Box sx={{ height: 30, margin: 0, padding: 0 }}>
            <TableButton
                key="rowCopyAdd"
                visible={define.rowCopyAdd.visible}
                disabled={define.rowCopyAdd.disabled(row)}
                color={define.rowCopyAdd.color}
                icon={define.rowCopyAdd.icon}
                tips={define.rowCopyAdd.tips}
                action={() => rowCopyAdd(row)}
                fontSize="small"
            />
            <TableButton
                key="rowViewDetail"
                visible={define.rowViewDetail.visible}
                disabled={define.rowViewDetail.disabled(row)}
                color={define.rowViewDetail.color}
                icon={define.rowViewDetail.icon}
                tips={define.rowViewDetail.tips}
                action={() => rowViewDetail(row)}
                fontSize="small"
            />
            <TableButton
                key="rowEdit"
                visible={define.rowEdit.visible}
                disabled={define.rowEdit.disabled(row)}
                color={define.rowEdit.color}
                icon={define.rowEdit.icon}
                tips={define.rowEdit.tips}
                action={() => rowEdit(row)}
                fontSize="small"
            />
            <TableButton
                key="rowDelete"
                visible={define.rowDelete.visible}
                disabled={define.rowDelete.disabled(row)}
                color={define.rowDelete.color}
                icon={define.rowDelete.icon}
                tips={define.rowDelete.tips}
                action={() => rowDelete(row)}
                fontSize="small"
            />
            <TableButton
                key="rowStart"
                visible={define.rowStart.visible}
                disabled={define.rowStart.disabled(row)}
                color={define.rowStart.color}
                icon={define.rowStart.icon}
                tips={define.rowStart.tips}
                action={() => rowStart(row)}
                fontSize="small"
            />
            <TableButton
                key="rowStop"
                visible={define.rowStop.visible}
                disabled={define.rowStop.disabled(row)}
                color={define.rowStop.color}
                icon={define.rowStop.icon}
                tips={define.rowStop.tips}
                action={() => rowStop(row)}
                fontSize="small"
            />
        </Box>
    );
}

export default RowActions;