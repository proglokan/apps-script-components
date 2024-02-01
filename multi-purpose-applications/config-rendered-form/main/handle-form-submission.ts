import { fetchSheet, getHeaders, _Headers, getBody, Body } from "../../../global/global";
type InputData = { [key: string]: string | boolean };
function sendData(targetSpreadsheet: string | null, targetSheetID: number, inputData: InputData[]) {
  const targetSheet = fetchSheet(targetSpreadsheet, targetSheetID);
  const targetHeaders = getHeaders(targetSheet);
  const targetSheetBody = getBody(targetSheet);
  const skuIndex = targetHeaders.get('SKU');
  const targetSku = data[0]['Value'];
  let targetRow;
  if (skuIndex === undefined) throw new Error(`Could not find 'SKU' in ${targetSheetID}`);
  for (let x = 0; x < targetSheetBody.length; ++x) {
    const row = targetSheetBody[x];
    const sku = row[skuIndex];
    if (sku !== targetSku) continue;
    targetRow = x + 2;
    break;
  }
  const upperX = targetSheet.getLastColumn();
  const [values] = targetSheet.getRange(targetRow, 1, 1, upperX).getValues();
  for (const input of data) {
    const headerName = input['Target Column Header'];
    const index = targetHeaders.get(headerName);
    if (values[index] === '') continue;
    values[index] = input['Value'];
  }
  // for (let x = 0; x < values.length; ++x) Logger.log(`${x} => ${values[x]}`);
  targetSheet.getRange(targetRow, 1, 1, values.length).setValues([values]);
  SpreadsheetApp.getActiveSpreadsheet().toast(`Entry appended to row ${targetSheet.getLastRow()}`);
  return true;
}
