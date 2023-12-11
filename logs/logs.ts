'use strict';
// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet.Sheet → get the logs sheet
function getLocalSheet(SHEET_NAME: string): GoogleAppsScript.Spreadsheet.Sheet {
  const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet: GoogleAppsScript.Spreadsheet.Sheet | null = ss.getSheetByName(SHEET_NAME);
  if (sheet === null) throw new Error(`Sheet ${SHEET_NAME} not found`);
  return sheet;
}

// @subroutine {Procedure} Void → send a new log entry to the middleware workbook
// @arg {string} trigger → the trigger that caused the log entry
// @arg {string} message → the message to log
function newLog(trigger: string, message: string) {
  const SHEET_NAME = 'Logs';
  const sheet: GoogleAppsScript.Spreadsheet.Sheet = getLocalSheet(SHEET_NAME);
  const row: number = sheet.getLastRow() + 1;
  const date: string = new Date().toLocaleString();
  const data: string[][] = [[date, trigger, message]];
  sheet.getRange(row, 1, 1, 3).setValues(data);
}