
// Generate the default sorting array
export function getSortColumns(tableColumns) {
    let sortColumns = [];
    tableColumns.forEach((column) => {
        if (column.sort) {
            let sortColumn = {
                sort: false,
                id: column.sortField,
                label: column.label,
                direction: "asc",
            };
            sortColumns.push(sortColumn);
        }
    })
    sortColumns[0].sort = true;
    return sortColumns;
}
// Convert the column names to an array
export function getColumnsKey(columns) {
    let keys = [];
    columns.forEach((column) => {
        keys.push(column.sortField);
    });
    return keys;
}
// Convert sort data to the orderBy array
export function getOrderBy(sortColumns, tableColumns) {
    let orderBy = [];
    sortColumns.forEach(element => {
        if (element.sort) {
            orderBy.push({ field: element.id, order: element.direction });
        }
    });
    if (orderBy.length === 0) {
        getSortColumns(tableColumns).forEach(element => {
            if (element.sort) {
                orderBy.push({ field: element.id, order: element.direction });
            }
        });
    }
    return orderBy;
}

// Prepare column data for Excel export
export function excelColumns(currentColumns) {
    let columns = [];
    currentColumns.forEach((column) => {
        if (column.visible) {
            columns.push(column.label);
        }
    })
    return columns;
}

// Perpare row data for Excel export
export function excelRows(currentRows, currentColumns) {
    let excelRows = [];
    currentRows.forEach(row => {
        let excelRow = {};
        currentColumns.forEach(column => {
            if (column.visible) {
                excelRow[column.label] = row[column.id];
            }
        })
        excelRows.push(excelRow);
    })
    return excelRows;
}

