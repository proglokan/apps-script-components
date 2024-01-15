'use strict';
type _Headers = Map<string, number>;
type Body = string[][];

// * REFERENCE FOR COMPILED FILE
//
// type _Headers = Map<string, number>;
// type Body = string[][];

// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet.Sheet → fetch a sheet obj from internal and external workbooks
// @arg {string} id → the ID of the external workbook
// @arg {string} name → the name of the sheet in the source workbook
function fetchSheet(
  id: string | null,
  name: string
): GoogleAppsScript.Spreadsheet.Sheet {
  const external = (id: string): GoogleAppsScript.Spreadsheet.Spreadsheet => {
    const ss = SpreadsheetApp.openById(id);
    return ss;
  };
  const internal = (): GoogleAppsScript.Spreadsheet.Spreadsheet => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    return ss;
  };
  const sheet: GoogleAppsScript.Spreadsheet.Sheet | null = id
    ? external(id).getSheetByName(name)
    : internal().getSheetByName(name);
  if (sheet === null) throw new Error(`Sheet ${name} not found`);
  return sheet;
}

// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet → fetch the user's active sheet from the active workbook
function fetchActiveSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  return sheet;
}

// @subroutine {Function} Pure: _Headers → get the headers of the source workbook
// @arg {GoogleAppsScript.Spreadsheet.Sheet} sheet → the sheet in the source workbook
function getHeaders(sheet: GoogleAppsScript.Spreadsheet.Sheet): _Headers {
  const upperX: number = sheet.getLastColumn();
  const data: string[] = sheet.getRange(1, 1, 1, upperX).getValues()[0];
  const headers: _Headers = new Map();
  data.forEach((header, index) => headers.set(header, index));
  return headers;
}

// @subroutine {Function} Pure: _Headers, Body → parse the sheet into headers and body
// @arg {GoogleAppsScript.Spreadsheet.Sheet} sheet → the sheet in the source workbook
function parseSheet(
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): [_Headers, Body] {
  const headers = getHeaders(sheet);
  const body = sheet.getDataRange().getValues();
  return [headers, body];
}

export { fetchSheet, fetchActiveSheet, getHeaders, _Headers, Body, parseSheet };
