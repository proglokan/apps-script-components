"use strict";
// * REFERENCE FOR COMPILED FILE
//
// type _Headers = Map<string, number>;
// type Body = string[][];
// type Row = Body[number];
// type Coordinates<T extends number[]> = T & { length: 4 };
// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet.Sheet → fetch a sheet obj from internal and external workbooks
// @arg {string} ssid → the ID of the external spreadsheet
// @arg {string} sid → the ID of the sheet in the spreadsheet
function fetchSheet(ssid, sid) {
    const external = (id) => {
        const ss = SpreadsheetApp.openById(id);
        return ss;
    };
    const internal = () => {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        return ss;
    };
    const ss = ssid ? external(ssid) : internal();
    const searchForSheet = (ss) => {
        const sheets = ss.getSheets();
        for (let x = 0; x < sheets.length; ++x) {
            const sheet = sheets[x];
            const id = sheet.getSheetId();
            if (id !== sid)
                continue;
            return sheet;
        }
        throw new Error(`Sheet ${sid} not found`);
    };
    const sheet = ss ? searchForSheet(ss) : null;
    if (sheet === null)
        throw new Error(`Sheet ${sid} not found`);
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
function getBody(sheet) {
    const body = sheet.getDataRange().getValues();
    body.shift();
    return body;
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
        case "Purchase Order ID":
            return /^10-\d{5}$/g.test(input);
        default:
            return new Error(`Author Time: ${type} is an invalid case!`);
    }
}
// @subroutine {Function} Pure: Coordinates<number[]> → create coordinates based on a column, body of values, and possibly a sheet
// @arg {GoogleAppsScript.Spreadsheet.Sheet | null} sheet → sheet to get the last row of, or row 2 if null
// @arg {number} column → starting column
// @arg {Body} values → body of values
function getCoordinates(sheetBody, values) {
    const getStartingRow = (sheetBody, values) => {
        const target = values[0].join("");
        for (let x = 0; x < sheetBody.length; ++x) {
            const row = sheetBody[x];
            const source = row.join("");
            if (source === target)
                return x + 1;
        }
        const error = new Error(`Could not find starting for provided values.`);
        error.name = "searchError";
        return error;
    };
    const row = getStartingRow(sheetBody, values);
    if (row instanceof Error)
        return row;
    const upperX = values.length;
    const upperY = values[0].length;
    const valuesCoordinates = [row, 1, upperX, upperY];
    return valuesCoordinates;
}
// @subroutine {Function} Pure: MappedSheet → create a map of the sheet
// @arg {GoogleAppsScript.Spreadsheet.Sheet} sheet → sheet to map
function sheetToMap(sheet) {
    const values = sheet.getDataRange().getValues();
    const mappedSheet = new Map();
    for (let x = 0; x < values[0].length; ++x) {
        const header = values[0][x];
        const columnBody = [];
        for (let y = 1; y < values.length; ++y)
            columnBody.push(values[y][x]);
        mappedSheet.set(header, columnBody);
    }
    return mappedSheet;
}
// @subroutine {Function} Pure: string → create a random name for config-generated input fields
function getUniqueIdentifier() {
    const availableLetters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lettersOfUniqueIdentifier = [];
    for (let x = 0; x < 5; ++x) {
        const randomIndex = Math.floor(Math.random() * availableLetters.length);
        const randomLetter = availableLetters[randomIndex];
        lettersOfUniqueIdentifier.push(randomLetter);
    }
    const uniqueIdentifier = lettersOfUniqueIdentifier.join('');
    return uniqueIdentifier;
}
function createCoordinates() {
    // TODO: create coordinates for placing values in a sheet
    return [1, 2, 3, 4];
}
export { fetchSheet, fetchActiveSheet, getHeaders, getBody, parseSheet, validation, getCoordinates, sheetToMap, getUniqueIdentifier, createCoordinates };
//# sourceMappingURL=global.js.map