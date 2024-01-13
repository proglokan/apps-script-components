'use strict';
import { fetchSheet, getHeaders, _Headers, Body } from '../../global/global';

function getTargetValues(
  sourceValues: Body,
  sourceColumnNames: string[],
  sourceHeaders: _Headers,
  sourceSheet: GoogleAppsScript.Spreadsheet.Sheet
): string[][] {
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

function getValues(targetColumns: number[], targetValues: string[][]): Body {
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

function serveConfirmation(upperY: number, targetRow: number) {
  const message = !upperY
    ? `Entries have been created in rows ${targetRow}-${targetRow + upperY}`
    : `Entry has been created in row ${targetRow}`;
  SpreadsheetApp.getActiveSpreadsheet().toast(message, 'RFQ has been updated');
}

function sendValues(
  targetSheet: GoogleAppsScript.Spreadsheet.Sheet,
  values: Body
) {
  const targetRow = targetSheet.getLastRow() + 1;
  const upperY = values.length;
  const upperX = values[0].length;
  targetSheet.getRange(targetRow, 1, upperY, upperX).setValues(values);
  serveConfirmation(upperY, targetRow);
}

function rfqHelperMain() {
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
