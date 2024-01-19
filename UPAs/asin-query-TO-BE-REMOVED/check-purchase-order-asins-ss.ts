import { fetchSheet, fetchActiveSheet, getHeaders, _Headers, Body } from "../../global/global";
import { getPurchaseOrderBody, getDuplicates } from "../upa-global/upa-global";

interface ComparativeAsins {
  reference: string[];
  comparison: string[];
}
type Data = [GoogleAppsScript.Spreadsheet.Sheet, _Headers, Body];
type Coordinates<T extends number[]> = T & { length: 4 };

function getAsins(headers: _Headers, body: Body, asinHeader: string): string[] {
  const xCoordinate = headers.get(asinHeader);
  if (!xCoordinate) throw new Error(`Header '${asinHeader}' not found in 'APO-Amz'`);
  const apoAmzAsins = body.map(row => row[xCoordinate]);
  return apoAmzAsins;
}

function checkPurchaseOrderAsins(purchaseOrderId: string) {
	const purchaseOrderSheet: GoogleAppsScript.Spreadsheet.Sheet = fetchActiveSheet();
  const purchaseOrderSheetHeaders: _Headers = getHeaders(purchaseOrderSheet);
  const purchaseOrderBody: Body | Error = getPurchaseOrderBody(purchaseOrderSheet, purchaseOrderId);
  if (purchaseOrderBody instanceof Error) return purchaseOrderBody;
  const [ asinHeader, statusHeader ] = ['ASIN', 'Status'];
  const purchaseOrderAsins: string[] = getAsins(purchaseOrderSheetHeaders, purchaseOrderBody, asinHeader);
  const apoAmzSheet: GoogleAppsScript.Spreadsheet.Sheet = fetchSheet(null, 'APO-Amz');
  const apoAmzHeaders: _Headers = getHeaders(apoAmzSheet);
  const apoAmzBody: Body = apoAmzSheet.getDataRange().getValues();
  const apoAmzAsins: string[] = getAsins(apoAmzHeaders, apoAmzBody, asinHeader);
  const duplicates: number[] = getDuplicates(purchaseOrderAsins, apoAmzAsins);
  if (!duplicates.length) return true;
  return false;
}