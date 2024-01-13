'use strict';
import { fetchSheet, getHeaders, _Headers, Body } from '../../global/global';

// [+] REFERENCE FOR COMPILED FILE
//
// type _Headers = Map<string, number>;
// type Body = string[][];

// @subroutine {Function} Pure: Body → get target values to be sent to target sheet
// @arg {Body} sourceValues → 2d array of values to be extracted and turned into target values
// @arg {string[]} sourceColumnNames → array of column names in the source sheet
// @arg {_Headers} sourceHeaders → the headers of the source spreadsheet
// @arg {GoogleAppsScript.Spreadsheet.Sheet} sourceSheet → where the selection data is being pulled from
function getTargetValues(
  sourceValues: Body,
  sourceColumnNames: string[],
  sourceHeaders: _Headers,
  sourceSheet: GoogleAppsScript.Spreadsheet.Sheet
): Body {
  const targetValues = [];
  for (const row of sourceValues) {
    const extractedData = [];
    for (const columnName of sourceColumnNames) {
      const column = sourceHeaders.get(columnName);
      if (!column)
        throw new Error(
          `Column ${columnName} not found in ${sourceSheet.getName()}.`
        );
      const value = row[column];
      extractedData.push(value);
    }
    targetValues.push(extractedData);
  }
  return targetValues;
}

// @subroutine {Function} Pure: number[] → get target column indexes in the target sheet
// @arg {string[]} targetColumnNames → array of column names in the target sheet
// @arg {_Headers} targetHeaders → the headers of the target spreadsheet
// @arg {GoogleAppsScript.Spreadsheet.Sheet} targetSheet → where the selection data is being sent to
function getTargetColumns(
  targetColumnNames: string[],
  targetHeaders: _Headers,
  targetSheet: GoogleAppsScript.Spreadsheet.Sheet
): number[] {
  const targetColumns = [];
  for (const columnName of targetColumnNames) {
    const column = targetHeaders.get(columnName);
    if (!column)
      throw new Error(
        `Column ${columnName} not found in ${targetSheet.getName()}.`
      );
    targetColumns.push(column);
  }
  return targetColumns;
}

// @subroutine {Function} Pure: Body → structuring target values based on target sheets coordinates
// @arg {number[]} targetColumns → array of column positions
// @arg {Body} targetValues → array of values to be structured and stored in the target sheet
function getValues(targetColumns: number[], targetValues: Body): Body {
  const values: Body = [];
  const valuesSize = Math.max(...targetColumns);
  for (const targetRow of targetValues) {
    const data = new Array(valuesSize + 1).fill('');
    for (let x = 0; x < data.length; ++x) {
      if (!targetColumns.includes(x)) continue;
      const stringIndex = targetColumns.indexOf(x);
      data[x] = targetRow[stringIndex];
    }
    values.push(data);
  }
  return values;
}

// @subroutine {Procedure}: Void → serve confirmation message to the user
function serveConfirmation(upperY: number, targetRow: number): void {
  const message = upperY > 1
    ? `Entries have been created in rows ${targetRow}-${targetRow + upperY}`
    : `Entry has been created in row ${targetRow}`;
  SpreadsheetApp.getActiveSpreadsheet().toast(message, 'RFQ has been updated');
}

// @subroutine {Procedure}: Void → send target values from source sheet to the target sheet
function sendValues(
  targetSheet: GoogleAppsScript.Spreadsheet.Sheet,
  values: Body
): void {
  const targetRow = targetSheet.getLastRow() + 1;
  const upperY = values.length;
  const upperX = values[0].length;
  targetSheet.getRange(targetRow, 1, upperY, upperX).setValues(values);
  serveConfirmation(upperY, targetRow);
}

// @subroutine {Helper} Void → move selected data from source sheet to target sheet
function rfqHelperMain(): void {
  const sourceColumnNames = [
    'Vendor Name',
    'Vendor SKU',
    'Vendor UPC',
    'ASIN',
    'ORDER QTY',
    'UNIT COST',
  ];
  const sourceSheet = fetchSheet(null, 'Master List');
  const sourceHeaders = getHeaders(sourceSheet);
  const targetColumnNames = [
    'Vendor',
    'Item (SKU) Number',
    'UPC',
    'ASIN',
    'Initial Unit Qty',
    'Initial Unit Price',
  ];
  const targetSheet = fetchSheet(
    '1TVReEBhve86gr3G6o9YVhWP2G0em9gPetxeJKkTdBDM',
    'RFQ'
  );
  const targetHeaders = getHeaders(targetSheet);
  const sourceValues = sourceSheet.getSelection().getActiveRange()!.getValues(); // TODO: CHECK FOR NULL SELECTION
  if (!sourceValues.length) return; // TODO: APPLY ERROR HANDLING
  const targetValues = getTargetValues(
    sourceValues,
    sourceColumnNames,
    sourceHeaders,
    sourceSheet
  );
  const targetColumns = getTargetColumns(
    targetColumnNames,
    targetHeaders,
    targetSheet
  );
  const values = getValues(targetColumns, targetValues);
  sendValues(targetSheet, values);
}
