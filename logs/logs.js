'use strict';
// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet.Sheet → get the logs sheet
function getLocalSheet(SHEET_NAME) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (sheet === null)
        throw new Error(`Sheet ${SHEET_NAME} not found`);
    return sheet;
}
// @subroutine {Procedure} Void → send a new log entry to the middleware workbook
// @arg {string} trigger → the trigger that caused the log entry
// @arg {string} message → the message to log
function newLog(trigger, message) {
    const SHEET_NAME = 'Logs';
    const sheet = getLocalSheet(SHEET_NAME);
    const row = sheet.getLastRow() + 1;
    const date = new Date().toLocaleString();
    const data = [[date, trigger, message]];
    sheet.getRange(row, 1, 1, 3).setValues(data);
}
//# sourceMappingURL=logs.js.map