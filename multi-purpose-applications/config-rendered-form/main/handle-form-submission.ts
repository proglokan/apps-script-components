import { fetchSheet, getHeaders, _Headers, getBody, Body } from "../../../global/global";
function sendData(data) {
  const targetSheetID = 979338720;
  const targetSheet = fetchSheet(null, targetSheetID);
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

function renderForm(form: string) {
  switch (form) {
    case 'Warehouse':
      configRenderedFormMain(form, 132112722);
      break;
    default:
      throw new Error(`Form '${form}' not found`);
  }
}