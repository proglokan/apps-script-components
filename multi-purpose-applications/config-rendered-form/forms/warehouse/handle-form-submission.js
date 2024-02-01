"use strict";
import { fetchSheet, getHeaders, getBody } from "../../../../global/global";
// * REFERENCE FOR COMPILED FILE
//
// type _Headers = Map<string, number>;
// type Body = string[][];
// type InputData = { [key: string]: string | boolean };
// type Row = Body[number];
// @subroutine {Function} Pure: number | Error → get the index of the SKU input in the input data
// @arg {InputData[]} inputData → the data from the form submission
function getSkuInputIndex(inputData) {
  for (let x = 0; x < inputData.length; ++x) {
    const input = inputData[x];
    if (input["Label"] !== "SKU") continue;
    return x;
  }
  return new Error(`Could not find 'SKU' in input data`);
}
// @subroutine {Function} Pure: number | Error → get the row in the target sheet that corresponds to the SKU in the input data
// @arg {Body} targetBody → the body of the target sheet
// @arg {number} skuCol → the index of the SKU column in the target sheet
function getTargetRow(targetBody, skuCol, targetSku) {
  for (let x = 0; x < targetBody.length; ++x) {
    const row = targetBody[x];
    const sku = row[skuCol];
    if (sku !== targetSku) continue;
    return x + 2;
  }
  return new Error(`Could not find SKU in target sheet`);
}
// @subroutine {Function} Pure: string[] → update the existing values in the target sheet with the new values from the input data respective to the target headers
// @arg {string[]} existingValues → the existing values in the target sheet
// @arg {InputData[]} inputData → the data from the form submission
// @arg {_Headers} targetHeaders → the headers of the target sheet
function updateExistingValues(existingValues, inputData, targetHeaders) {
  for (let x = 0; x < inputData.length; ++x) {
    const input = inputData[x];
    const headerName = input["Target Column Header"];
    if (headerName === undefined)
      throw new Error(`Could not find 'Target Column Header' in input data`);
    const index = targetHeaders.get(headerName);
    if (index === undefined)
      throw new Error(`Could not find '${headerName}' in target headers`);
    const newValue = input["Value"];
    if (!newValue.length) continue;
    existingValues[index] = newValue;
  }
  return existingValues;
}
// @subroutine {Procedure} Returns: string → given input data, update the target sheet with the new values, unless an input is empty
// @arg {string | null} targetSpreadsheet → the ID of the target spreadsheet
// @arg {number} targetSheetID → the ID of the target sheet
// @arg {InputData[]} inputData → the data from the form submission
function handleWarehouseFormSubmission(
  targetSpreadsheet,
  targetSheetID,
  inputData
) {
  const ssid = targetSpreadsheet === "null" ? null : targetSpreadsheet;
  const targetSheet = fetchSheet(ssid, targetSheetID);
  const targetHeaders = getHeaders(targetSheet);
  const targetBody = getBody(targetSheet);
  const skuCol = targetHeaders.get("SKU");
  if (skuCol === undefined)
    throw new Error(`Could not find 'SKU' in ${targetSheetID}`);
  const skuInputIndex = getSkuInputIndex(inputData);
  if (skuInputIndex instanceof Error) throw skuInputIndex;
  const targetSku = inputData[skuInputIndex]["Value"];
  const targetRow = getTargetRow(targetBody, skuCol, targetSku);
  if (targetRow instanceof Error) throw targetRow;
  const existingValues = targetBody[targetRow];
  const values = updateExistingValues(existingValues, inputData, targetHeaders);
  const rows = 1;
  const cols = targetHeaders.size;
  targetSheet.getRange(targetRow, 1, rows, cols).setValues([values]);
  SpreadsheetApp.getActiveSpreadsheet().toast(
    `Entry appended to row ${targetSheet.getLastRow()}`
  );
  return `Entry appended to row ${targetSheet.getLastRow()}`;
}
//# sourceMappingURL=handle-form-submission.js.map
