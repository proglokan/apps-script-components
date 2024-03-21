import { getSheetHeaders, fetchActiveSheet, getCoordinates, newError } from "../../global/global";
import { type Sheet, type SheetHeaders, type SheetRow, type SheetValues, type SheetCoordinates } from "../../global/definitions";

const getColumn = (headers: SheetHeaders, key: string) => {
  const value = headers.get(key) ?? newError('poRefresh-ss.ts', `Could not find \"${key}\" header`);
  if (value instanceof Error) throw value;
  return value;
}

const summation = (source: string, target: string, errorMessage: string, zeroRule: boolean) => {
  const sheet: Sheet = fetchActiveSheet();
  const headers: SheetHeaders = getSheetHeaders(sheet);
  const purchaseOrderCol = getColumn(headers, 'Purchase Order #');
  const individualWeightCol = getColumn(headers, source);
  const totalWeightCol = getColumn(headers, target);
  const data = sheet.getDataRange().getValues();
  const individualPurchaseOrders = new Map();
  for (let x = 1; x < data.length; ++x) {
    const row = data[x];
    const purchaseOrder = row[purchaseOrderCol];
    if (!individualPurchaseOrders.has(purchaseOrder)) {
      individualPurchaseOrders.set(purchaseOrder, [row]);
      continue;
    }
    individualPurchaseOrders.get(purchaseOrder)?.push(row);
  }
  const purchaseOrderTotals = new Map();
  for (const [purchaseOrder, purchaseOrderData] of individualPurchaseOrders) {
    let totalWeight = 0;
    for (const row of purchaseOrderData) {
      const weight = +row[individualWeightCol];
      if (weight === 0 && zeroRule) {
        totalWeight = errorMessage;
        break;
      }
      totalWeight += weight;
    }
    purchaseOrderTotals.set(purchaseOrder, totalWeight);
  }
  for (let x = 1; x < data.length; ++x) {
    const row = data[x];
    const purchaseOrder = row[purchaseOrderCol];
    const totalWeight = purchaseOrderTotals.get(purchaseOrder);
    row[totalWeightCol] = totalWeight;
  }
  const values = data.map((row) => [row[totalWeightCol]]);
  const [row, column, rows, columns] = getCoordinates(sheet, values, 1, totalWeightCol + 1);
  sheet.getRange(row, column, rows, columns).setValues(values);
};

const poRefresh = () => {
  summation('Total ASIN Weight', 'Total PO Weight', 'Please fix ASIN weight', true);
  summation('Accepted ASIN to Amazon', 'Total ASIN Per PO', 'Please fix accept ASIN to amz', false);
}