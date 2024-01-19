'use strict';
// * REFERENCE FOR COMPILED FILE
//
// type _Headers = Map<string, number>;
// type Body = string[][];
// type Row = Body[number];
// type Coordinates<T extends number[]> = T & { length: 4 };
// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet.Sheet → fetch a sheet obj from internal and external workbooks
// @arg {string} id → the ID of the external workbook
// @arg {string} name → the name of the sheet in the source workbook
function fetchSheet(id, name) {
    const external = (id) => {
        const ss = SpreadsheetApp.openById(id);
        return ss;
    };
    const internal = () => {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        return ss;
    };
    const sheet = id
        ? external(id).getSheetByName(name)
        : internal().getSheetByName(name);
    if (sheet === null)
        throw new Error(`Sheet ${name} not found`);
    return sheet;
}
// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet → fetch the user's active sheet from the active workbook
function fetchActiveSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    return sheet;
}
// @subroutine {Function} Pure: _Headers → get the headers of the source workbook
// @arg {GoogleAppsScript.Spreadsheet.Sheet} sheet → the sheet in the source workbook
function getHeaders(sheet) {
    const upperX = sheet.getLastColumn();
    const data = sheet.getRange(1, 1, 1, upperX).getValues()[0];
    const headers = new Map();
    data.forEach((header, index) => headers.set(header, index));
    return headers;
}
// @subroutine {Function} Pure: _Headers, Body → parse the sheet into headers and body
// @arg {GoogleAppsScript.Spreadsheet.Sheet} sheet → the sheet in the source workbook
function parseSheet(sheet) {
    const headers = getHeaders(sheet);
    const body = sheet.getDataRange().getValues();
    return [headers, body];
}
// @subroutine {Function} Pure: boolean | Error → validate user input
// @arg {string} type → the type of UPA the input comes from
// @arg {string} input → the user input to validate
function validation(type, input) {
    switch (type) {
        case 'Purchase Order ID':
            return /^10-\d{5}$/g.test(input);
        default:
            return new Error(`Author Time: ${type} is an invalid case!`);
    }
}
function geStartingRow(sheetBody, values) {
    const target = values[0].join('');
    for (let x = 0; x < sheetBody.length; ++x) {
        const row = sheetBody[x];
        const source = row.join('');
        if (source === target)
            return x + 1;
    }
    const error = new Error(`Could not find starting for provided values.`);
    error.name = 'searchError';
    return error;
}
// @subroutine {Function} Pure: Coordinates<number[]> → create coordinates based on a column, body of values, and possibly a sheet
// @arg {GoogleAppsScript.Spreadsheet.Sheet | null} sheet → sheet to get the last row of, or row 2 if null
// @arg {number} column → starting column
// @arg {Body} values → body of values
function getCoordinates(sheetBody, values) {
    const row = geStartingRow(sheetBody, values);
    if (row instanceof Error)
        return row;
    const upperX = values.length;
    const upperY = values[0].length;
    const valuesCoordinates = [row, 1, upperX, upperY];
    return valuesCoordinates;
}
function createCoordinates() {
    return [1, 2, 3, 4];
}
export { fetchSheet, fetchActiveSheet, getHeaders, parseSheet, validation, getCoordinates };
//# sourceMappingURL=global.js.map