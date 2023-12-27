"use strict";
// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet.Sheet → return the CSV sheet or throw the user an error
function getCsvSheet() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('CSV');
    if (!sheet)
        throw new Error(''); // [+] create user-friendly error handling
    return sheet;
}
// @subroutine {Procedure} Void → use a regular expression to remove all commas and newlines from the CSV data
function csvFormatter() {
    const csvSheet = getCsvSheet();
    const csvDataRange = csvSheet.getDataRange();
    const csvValues = csvDataRange.getValues();
    const regex = /[\n,]/g;
    for (let x = 0; x < csvValues.length; ++x) {
        const rawDataRow = csvValues[x];
        const rowToString = rawDataRow.join('◯');
        const structuredRow = rowToString.replace(regex, '');
        const rowToArray = structuredRow.split('◯');
        csvValues[x] = rowToArray;
    }
    csvDataRange.setValues(csvValues);
}
//# sourceMappingURL=csv-formatter.js.map