"use strict";
// * Fetch a sheet obj from internal and external workbooks
const fetchSheet = (ssid, sid) => {
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
};
// * Fetch the user's active sheet from the active workbook
const fetchActiveSheet = () => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    return sheet;
};
// * Get the headers of the source sheet
const getSheetHeaders = (sheet) => {
    const upperX = sheet.getLastColumn();
    const data = sheet.getRange(1, 1, 1, upperX).getValues()[0];
    const headers = new Map();
    data.forEach((header, index) => headers.set(header, index));
    return headers;
};
// * Get the values of the source sheet
const getSheetValues = (sheet) => {
    const sheetValues = sheet.getDataRange().getValues();
    sheetValues.shift();
    return sheetValues;
};
// * Parse the sheet into sheet headers and sheet values
const parseSheet = (sheet) => {
    const sheetHeaders = getSheetHeaders(sheet);
    const sheetValues = sheet.getDataRange().getValues();
    return [sheetHeaders, sheetValues];
};
// * Validate user input
const validation = (type, input) => {
    switch (type) {
        case "Purchase Order ID":
            return /^10-\d{5}$/g.test(input);
        default:
            return new Error(`Author Time: ${type} is an invalid case!`);
    }
};
// * Create a map of the sheet
const sheetToMap = (sheet) => {
    const values = sheet.getDataRange().getValues();
    const mappedSheet = new Map();
    for (let x = 0; x < values[0].length; ++x) {
        const header = values[0][x];
        const valuesInColumn = [];
        for (let y = 1; y < values.length; ++y)
            valuesInColumn.push(values[y][x]);
        mappedSheet.set(header, valuesInColumn);
    }
    return mappedSheet;
};
// * Create a random name for config-generated input fields
const getUniqueIdentifier = () => {
    const availableLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lettersOfUniqueIdentifier = [];
    for (let x = 0; x < 5; ++x) {
        const randomIndex = Math.floor(Math.random() * availableLetters.length);
        const randomLetter = availableLetters[randomIndex];
        lettersOfUniqueIdentifier.push(randomLetter);
    }
    const uniqueIdentifier = lettersOfUniqueIdentifier.join("");
    return uniqueIdentifier;
};
// * Create error based on parameters passed in
const newError = (cause, message) => {
    const error = new Error();
    error.cause = cause;
    error.message = message;
    return error;
};
// * Get the coordinates for a Google Apps Script range
const getCoordinates = (sheet, values, row, column) => {
    if (row === undefined)
        row = sheet.getLastRow() + 1;
    if (column === undefined)
        column = 1;
    const rows = values.length;
    const columns = values[0].length;
    return [row, column, rows, columns];
};
export { fetchSheet, fetchActiveSheet, getSheetHeaders, getSheetValues, parseSheet, validation, getCoordinates, sheetToMap, getUniqueIdentifier, newError, };
//# sourceMappingURL=global.js.map