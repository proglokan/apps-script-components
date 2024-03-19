"use strict";
import { fetchSheet, getSheetHeaders, getSheetValues } from "../../../../global/global";
import { type SheetHeaders, type SheetValues, type SheetRow, type InputData } from "../../../../global/definitions";

// * Get the index of the SKU input in the input data
function getSkuInputIndex(inputData: InputData[]): number | Error {
  for (let x = 0; x < inputData.length; ++x) {
    const input = inputData[x];
    if (input["Label"] !== "SKU") continue;

    return x;
  }

  return new Error(`Could not find 'SKU' in input data`);
}

// * Get the row in the target sheet that corresponds to the SKU in the input data
function getTargetSheetRow(targetSheetValues: SheetValues, skuCol: number, targetSku: string): number | Error {
  for (let x = 0; x < targetSheetValues.length; ++x) {
    const row: SheetRow = targetSheetValues[x];
    const sku = row[skuCol];
    if (sku !== targetSku) continue;

    return x + 2;
  }

  return new Error(`Could not find SKU in target sheet`);
}

// * Update the existing values in the target sheet with the new values from the input data respective to the target headers
function updateExistingValues(existingValues: string[], inputData: InputData[], targetSheetHeaders: SheetHeaders): string[] {
  for (let x = 0; x < inputData.length; ++x) {
    const input: InputData = inputData[x];
    const headerName = input["Target Column Header"] as string;
    if (headerName === undefined) throw new Error(`Could not find 'Target Column Header' in input data`);
    const index = targetSheetHeaders.get(headerName);
    if (index === undefined) throw new Error(`Could not find '${headerName}' in target headers`);
    const newValue = input["Value"] as string;
    if (newValue === "" || newValue === "$") continue;
    existingValues[index] = input["Value"] as string;
  }

  return existingValues;
}

// * Given input data, update the target sheet with the new values, unless an input is empty
function handleWarehouseFormSubmission(targetSpreadsheet: string | null, targetSheetID: number, inputData: InputData[]) {
  const ssid = targetSpreadsheet === "null" ? null : targetSpreadsheet;
  const targetSheet: GoogleAppsScript.Spreadsheet.Sheet = fetchSheet(ssid, targetSheetID);
  const targetSheetHeaders: SheetHeaders = getSheetHeaders(targetSheet);
  const targetSheetValues: SheetValues = getSheetValues(targetSheet);
  const skuCol = targetSheetHeaders.get("SKU");
  if (skuCol === undefined) throw new Error(`Could not find 'SKU' in ${targetSheetID}`);
  const skuInputIndex: number | Error = getSkuInputIndex(inputData);
  if (skuInputIndex instanceof Error) throw skuInputIndex;
  const targetSku = inputData[skuInputIndex]["Value"] as string;
  const targetSheetRow: number | Error = getTargetSheetRow(targetSheetValues, skuCol, targetSku);
  if (targetSheetRow instanceof Error) throw targetSheetRow;
  const existingValues = targetSheetValues[targetSheetRow];
  const values: string[] = updateExistingValues(existingValues, inputData, targetSheetHeaders);
  const rows = 1;
  const cols = targetSheetHeaders.size;
  targetSheet.getRange(targetSheetRow, 1, rows, cols).setValues([values]);
  SpreadsheetApp.getActiveSpreadsheet().toast(`Entry appended to row ${targetSheet.getLastRow()}`);

  return `Entry appended to row ${targetSheet.getLastRow()}`;
}
