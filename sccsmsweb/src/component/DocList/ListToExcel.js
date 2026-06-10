const tableStyle = `
<style>
       table {
            border-collapse: collapse;

        }
        table thead tr td {
            background-color: grey;
            height: 50px;
            font-size: 16px;
            font-family: 'Times New Roman';
            font-weight: 700;
        }
        
        td {
            border: 1px solid grey;
            height: 45px;
        }
</style>
`;

export default function ListToExcel(columns,rows) {
    let tableHeadCell = "";
    columns.forEach((column) => {
        if (column.visible) {
            tableHeadCell = tableHeadCell + '<td>' + column.label + '</td>\n';
        }
    });
    let tableHead = '<thead>\n<tr>\n' + tableHeadCell + '</tr>\n</thead>\n';

    let tableBodyCell = "";
    rows.forEach((row) => {
        let rowCell = "";
        columns.forEach((column) => {
            if (column.visible) {
                rowCell = rowCell + "<td>" + row[column.id] + '</td>\n';
            }
        })
        tableBodyCell = tableBodyCell + '<tr>\n' + rowCell + '</tr>\n';
    })
    let tableBody = '<tbody>\n' + tableBodyCell + '</tbody>\n';
    let table = "<table>\n" + tableHead + tableBody + "</table>";
    let html = `<html><head><meta charset='utf-8' /> ${tableStyle}</head><body>` + table + `</body></html>`;
    return html;
}
