// Define Excel column
export const excelColumns = (columns) => {
    let cols = [];
    columns.forEach((column) => {
        cols.push(column.header)
    })
    return cols;
};

// Define Excel rows
export const excelRows = (rows, columns) => {
    let excelRows = [];
    rows.forEach((row) => {
        let excelRow = {};
        columns.forEach(column => {
            excelRow[column.header] = row[column.accessorKey]
        })
        excelRows.push(excelRow);
    })
    return excelRows;
};