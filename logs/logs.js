// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet.Sheet → get the logs sheet
function getLocalSheet(SHEET_NAME) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (sheet === null)
        throw new Error("Sheet ".concat(SHEET_NAME, " not found"));
    return sheet;
}
// @subroutine {Procedure} Void → send a new log entry to the middleware workbook
// @arg {string} trigger → the trigger that caused the log entry
// @arg {string} message → the message to log
function newLog(trigger, message) {
    var SHEET_NAME = 'Logs';
    var sheet = getLocalSheet(SHEET_NAME);
    var row = sheet.getLastRow() + 1;
    var date = new Date().toLocaleString();
    var data = [[date, trigger, message]];
    sheet.getRange(row, 1, 1, 3).setValues(data);
}
