import { SheetHeaders, SheetRow } from "../../global/definitions";
import { fetchSheet, newError, getSheetHeaders, getColumn } from "../../global/global";

const missingParameterHandler = () => {
  const response = ContentService.createTextOutput();
  response.setMimeType(ContentService.MimeType.TEXT);
  response.setContent('No SKU provided');
  return response;
}

const missingSheetHandler = () => {
  const response = ContentService.createTextOutput();
  response.setMimeType(ContentService.MimeType.TEXT);
  response.setContent('Sheet was not found in the spreadsheet. Please contact Kan via WhatsApp or Slack');
  return response;
}

const missingColumnHandler = (header: string) => {
  const response = ContentService.createTextOutput();
  response.setMimeType(ContentService.MimeType.TEXT);
  response.setContent(`Column(s) \"${header}\" was not found in the spreadsheet. Please contact Kan via WhatsApp or Slack`);
  return response;
}

const missingSkuHandler = (sku: string) => {
  const response = ContentService.createTextOutput();
  response.setMimeType(ContentService.MimeType.TEXT);
  response.setContent(`${sku} was not found in the spreadsheet`);
  return response;
}

const doGet: (request: GoogleAppsScript.Events.DoGet) => GoogleAppsScript.Content.TextOutput | Error = (request) => {
  const sku = request.parameter.sku ?? 'No SKU provided';
  if (sku === 'No SKU provided') return missingParameterHandler();

  let sheet: GoogleAppsScript.Spreadsheet.Sheet;
  try {
    sheet = fetchSheet(null, 1844782191);
  } catch {
    return missingSheetHandler();
  }

  const headers: SheetHeaders = getSheetHeaders(sheet);

  const skuHeader = 'SKU';
  let skuColumn: number;
  try {
    skuColumn = getColumn(headers, skuHeader);
  } catch {
    return missingColumnHandler(skuHeader);
  }

  const sheetValues = sheet.getDataRange().getValues();

  const targetHeaders = new Map([
    // ['dealType', 'Deal Type',],
    ['date', 'Date',],
    ['name', 'Item Name',],
    ['totalQuantity', 'Accepted ASIN to Amazon',],
    ['totalAmount', 'Final PO Total (Inc Fees)',],
    ['purchaseOrderID', 'Purchase Order #'],
    ['asin', 'ASIN'],
    ['userName', 'Parent Store'],
    ['supplierToWarehouseTrackingID', 'Tracking ID'],
    ['supplierToWarehouseCost', 'Per ASIN Vendor-Anywhere-Ship Cost'],
    ['warehouseToAmazonCost', 'ASIN WH-AMZ-Ship Cost Total'],
  ]);

  const targetColumns: number[] = [];
  const missingHeaders: string[] = [];
  for (const header of targetHeaders.values()) {
    let targetColumn = -1;
    try {
      targetColumn = getColumn(headers, header);
    } catch {
      missingHeaders.push(header);
    }
    targetColumns.push(targetColumn);
  }

  if (missingHeaders.length > 0) {
    const headers = missingHeaders.join(', ');
    return missingColumnHandler(headers);
  }

  let targetRow = -1;
  for (let x = 0; x < sheetValues.length; ++x) {
    const row: SheetRow = sheetValues[x];
    const skuInRow = row[skuColumn];
    if (skuInRow !== sku) continue;
    targetRow = x;
    break;
  }

  if (targetRow === -1) return missingSkuHandler(sku);

  const returnData: Record<string, string> = {}

  const targetRowValues: SheetRow = sheetValues[targetRow];
  const returnDataKeys = Array.from(targetHeaders.keys());
  for (let x = 0; x < targetColumns.length; ++x) {
    const targetColumn = targetColumns[x];
    const returnDataKey = returnDataKeys[x];
    returnData[returnDataKey] = targetRowValues[targetColumn];
  }

  const responseJSON = JSON.stringify({ payload: returnData });
  const response = ContentService.createTextOutput(responseJSON);
  response.setMimeType(ContentService.MimeType.JSON);

  return response;
}

const request = async () => {
  const endpointURL = 'https://script.google.com/macros/s/AKfycbzYU80hktOuqSZG7H_BjZV6dme4m-EEJpDdKJSd4_TZW7SyXMOSn01Mei4Js_jNZuhV/exec';
  const sku = 'B000ARPVQ6_655';
  const fetchUrl = `${endpointURL}?sku=${sku}`;
  await fetch(fetchUrl, {
    method: 'GET',
    mode: 'cors',
  }).then(async response => {
    const clonedResponse = response.clone();
    try {
      return await response.json();
    } catch {
      return await clonedResponse.text();
    }
  }).then(data => console.log(data)).catch(error => console.log(error));
};

request();
