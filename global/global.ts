"use strict";
import { type SheetHeaders, type SheetValues, type SheetCoordinates, type MappedSheet } from "./definitions";

// * Fetch a sheet obj from internal and external workbooks
const fetchSheet = (ssid: string | null, sid: number): GoogleAppsScript.Spreadsheet.Sheet => {
  const external = (id: string): GoogleAppsScript.Spreadsheet.Spreadsheet => {
    const ss = SpreadsheetApp.openById(id);
    return ss;
  };

  const internal = (): GoogleAppsScript.Spreadsheet.Spreadsheet => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    return ss;
  };

  const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = ssid ? external(ssid) : internal();
  const searchForSheet = (ss: GoogleAppsScript.Spreadsheet.Spreadsheet): GoogleAppsScript.Spreadsheet.Sheet | null => {
    const sheets = ss.getSheets();
    for (let x = 0; x < sheets.length; ++x) {
      const sheet = sheets[x];
      const id = sheet.getSheetId();
      if (id !== sid) continue;
      return sheet;
    }

    throw new Error(`Sheet ${sid} not found`);
  };

  const sheet: GoogleAppsScript.Spreadsheet.Sheet | null = ss ? searchForSheet(ss) : null;
  if (sheet === null) throw new Error(`Sheet ${sid} not found`);

  return sheet;
};

// * Fetch the user's active sheet from the active workbook
const fetchActiveSheet = (): GoogleAppsScript.Spreadsheet.Sheet => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();

  return sheet;
};

// * Get the headers of the source sheet
const getSheetHeaders = (sheet: GoogleAppsScript.Spreadsheet.Sheet): SheetHeaders => {
  const upperX: number = sheet.getLastColumn();
  const data: string[] = sheet.getRange(1, 1, 1, upperX).getValues()[0];
  const headers: SheetHeaders = new Map();
  data.forEach((header, index) => headers.set(header, index));

  return headers;
};

// * Get the values of the source sheet
const getSheetValues = (sheet: GoogleAppsScript.Spreadsheet.Sheet): SheetValues => {
  const sheetValues = sheet.getDataRange().getValues();
  sheetValues.shift();

  return sheetValues;
};

// * Parse the sheet into sheet headers and sheet values
const parseSheet = (sheet: GoogleAppsScript.Spreadsheet.Sheet): [SheetHeaders, SheetValues] => {
  const sheetHeaders = getSheetHeaders(sheet);
  const sheetValues = sheet.getDataRange().getValues();

  return [sheetHeaders, sheetValues];
};

// * Validate user input
const validation = (type: string, input: string): boolean | Error => {
  switch (type) {
    case "Purchase Order ID":
      return /^10-\d{5}$/g.test(input);

    default:
      return new Error(`Author Time: ${type} is an invalid case!`);
  }
};

// * Create a map of the sheet
const sheetToMap = (sheet: GoogleAppsScript.Spreadsheet.Sheet): MappedSheet => {
  const values = sheet.getDataRange().getValues();
  const mappedSheet: MappedSheet = new Map();
  for (let x = 0; x < values[0].length; ++x) {
    const header = values[0][x];
    const valuesInColumn = [];
    for (let y = 1; y < values.length; ++y) valuesInColumn.push(values[y][x]);
    mappedSheet.set(header, valuesInColumn);
  }

  return mappedSheet;
};

// * Create a random name for config-generated input fields
const getUniqueIdentifier = (): string => {
  const availableLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lettersOfUniqueIdentifier: string[] = [];
  for (let x = 0; x < 5; ++x) {
    const randomIndex = Math.floor(Math.random() * availableLetters.length);
    const randomLetter = availableLetters[randomIndex];
    lettersOfUniqueIdentifier.push(randomLetter);
  }

  const uniqueIdentifier = lettersOfUniqueIdentifier.join("");

  return uniqueIdentifier;
};

// * Create error based on parameters passed in
const newError = (cause: string, message: string): Error => {
  const error = new Error();
  error.cause = cause;
  error.message = message;

  return error;
};

// * Get the coordinates for a Google Apps Script range
const getCoordinates = (
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  values: SheetValues,
  row: number | undefined,
  column: number | undefined,
): SheetCoordinates<number[]> => {
  if (row === undefined) row = sheet.getLastRow() + 1;
  if (column === undefined) column = 1;
  const rows = values.length;
  const columns = values[0].length;

  return [row, column, rows, columns];
};

export {
  fetchSheet,
  fetchActiveSheet,
  getSheetHeaders,
  getSheetValues,
  parseSheet,
  validation,
  getCoordinates,
  sheetToMap,
  getUniqueIdentifier,
  newError,
};
