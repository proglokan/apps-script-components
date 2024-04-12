import { SheetHeaders } from "../../global/definitions";
import { fetchSheet, newError, getSheetHeaders, getColumn } from "../../global/global";

const missingSkuHandler = () => {
  const response = ContentService.createTextOutput();
  response.setMimeType(ContentService.MimeType.TEXT);
  response.setContent('No SKU provided');
  return response;
}

const doGet: (request: GoogleAppsScript.Events.DoGet) => GoogleAppsScript.Content.TextOutput | Error = (request) => {
  const sku = request.parameter.sku ?? 'No SKU provided';
  if (sku === 'No SKU provided') return missingSkuHandler();
  const sheet = fetchSheet(null, 123);
  const headers: SheetHeaders = getSheetHeaders(sheet);
  const skuColumn = getColumn(headers, 'SKU');
  const skuCIdx = headers.get('SKU');
  if (skuCIdx === undefined) return newError('Fetch Attempt', 'SKU is invalid');
  const values = sheet.getDataRange().getValues();
  const returnData = {
    // ?: properties pending
  }

  for (let x = 0; x < values.length; ++x) {
    const row = values[x];
    const targetSku = row[skuCIdx];
    if (targetSku !== sku) continue;
  }

  return ContentService.createTextOutput(`SKU: ${sku}`);
}

// const doPost: (e: GoogleAppsScript.Events.DoPost) => void = (e) => {
//   return ContentService.createTextOutput('POST request received');
// }

// test request
const testRequest = () => {
  const endpointURL = 'https://script.google.com/macros/s/AKfycbwBiXb7oOUfCN_XvgHwKYcxJDLkl-b-lHPhl4DT9SGEIiXw3rrCXHS0COOfANOnoG3Tcg/exec'
  const sku = 'sku=12345';
  const fetchUrl = `${endpointURL}?${sku}`;

  fetch(fetchUrl)
    .then(response => response.text())
    .then(data => console.log(data));
}

// call testRequest
// testRequest();