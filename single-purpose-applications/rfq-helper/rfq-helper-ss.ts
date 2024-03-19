"use strict";
import { fetchSheet, fetchActiveSheet, getSheetHeaders } from "../../global/global";
import { type SheetHeaders, SheetValues } from "../../global/definitions";

// * Get target values to be sent to target sheet
function getTargetValues(
  sourceValues: SheetValues,
  sourceColumnNames: string[],
  sourceHeaders: SheetHeaders,
  sourceSheet: GoogleAppsScript.Spreadsheet.Sheet,
): SheetValues {
  const targetValues = [];
  for (const row of sourceValues) {
    const extractedData = [];
    for (const columnName of sourceColumnNames) {
      const column = sourceHeaders.get(columnName);
      if (!column) throw new Error(`Column ${columnName} not found in ${sourceSheet.getName()}.`);
      const value = row[column];
      extractedData.push(value);
    }

    targetValues.push(extractedData);
  }

  return targetValues;
}

// * Get target column indexes in the target sheet
function getTargetColumns(targetColumnNames: string[], targetSheetHeaders: SheetHeaders, targetSheet: GoogleAppsScript.Spreadsheet.Sheet): number[] {
  const targetColumns = [];
  for (const columnName of targetColumnNames) {
    const column = targetSheetHeaders.get(columnName);
    if (!column) throw new Error(`Column ${columnName} not found in ${targetSheet.getName()}.`);
    targetColumns.push(column);
  }

  return targetColumns;
}

// * Structuring target values based on target sheets coordinates
function getValues(targetColumns: number[], targetValues: SheetValues): SheetValues {
  const values: SheetValues = [];
  const valuesSize = Math.max(...targetColumns);
  for (const targetRow of targetValues) {
    const data = new Array(valuesSize + 1).fill("");
    for (let x = 0; x < data.length; ++x) {
      if (!targetColumns.includes(x)) continue;
      const stringIndex = targetColumns.indexOf(x);
      data[x] = targetRow[stringIndex];
    }

    values.push(data);
  }

  return values;
}

// * Serve confirmation message to the user
function serveConfirmation(upperY: number, targetRow: number): void {
  const message = upperY > 1 ? `Entries have been created in rows ${targetRow}-${targetRow + upperY}` : `Entry has been created in row ${targetRow}`;

  SpreadsheetApp.getActiveSpreadsheet().toast(message, "RFQ has been updated");
}

// * Send target values from source sheet to the target sheet
function sendValues(targetSheet: GoogleAppsScript.Spreadsheet.Sheet, values: SheetValues): void {
  const targetRow = targetSheet.getLastRow() + 1;
  const upperY = values.length;
  const upperX = values[0].length;
  targetSheet.getRange(targetRow, 1, upperY, upperX).setValues(values);
  serveConfirmation(upperY, targetRow);
}

// * Move selected data from source sheet to target sheet
function rfqHelperMain(): void {
  const sourceColumnNames = ["Vendor Name", "Vendor SKU", "Vendor UPC", "ASIN", "ORDER QTY", "UNIT COST"];
  const sourceSheet = fetchActiveSheet();
  const sourceHeaders = getSheetHeaders(sourceSheet);
  const targetColumnNames = ["Vendor", "Item (SKU) Number", "UPC", "ASIN", "Initial Unit Qty", "Initial Unit Price"];
  const targetSheet = fetchSheet("1TVReEBhve86gr3G6o9YVhWP2G0em9gPetxeJKkTdBDM", 914981809);
  const targetSheetHeaders = getSheetHeaders(targetSheet);

  // TODO: CHECK FOR NULL SELECTION
  const sourceValues = sourceSheet.getSelection().getActiveRange()!.getValues();

  // TODO: APPLY ERROR HANDLING
  if (!sourceValues.length) return;

  const targetValues = getTargetValues(sourceValues, sourceColumnNames, sourceHeaders, sourceSheet);
  const targetColumns = getTargetColumns(targetColumnNames, targetSheetHeaders, targetSheet);
  const values = getValues(targetColumns, targetValues);
  sendValues(targetSheet, values);
}
