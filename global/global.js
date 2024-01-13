'use strict';
// [+] REFERENCE FOR COMPILED FILE
//
// type _Headers = Map<string, number>;
// type Body = string[][];
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
export { fetchSheet, fetchActiveSheet, getHeaders, parseSheet };
//# sourceMappingURL=global.js.map