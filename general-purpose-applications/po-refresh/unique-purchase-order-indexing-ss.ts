import { newError, getSheetHeaders, getUniqueIdentifier, fetchSheet, fetchActiveSheet } from "../../global/global";
import { type Sheet, type SheetHeaders, type SheetValues, type SheetRow } from "../../global/definitions";

const getSheetValues = (sheet: GoogleAppsScript.Spreadsheet.Sheet | null): SheetValues => {
  if (sheet === null) sheet = fetchActiveSheet();
  return sheet.getDataRange().getValues();
}

const getColumn = (headers: SheetHeaders, key: string) => {
  const value = headers.get(key) ?? newError('poRefresh-ss.ts', `Could not find \"${key}\" header`);
  if (value instanceof Error) throw value;
  return value;
}

const createUniqueIndexing = (sheetValues: SheetValues, purchaseOrderColumn: number, subPurchaseOrderColumn: number) => {
  for (let x = 0; x < sheetValues.length; x++) {
    const row: SheetRow = sheetValues[x];
    const purchaseOrderID = row[purchaseOrderColumn];
    const identifier = getUniqueIdentifier();
    const subPurchaseOrderValue = `${purchaseOrderID}-${identifier}`;
    row[subPurchaseOrderColumn] = subPurchaseOrderValue;
  }
  return sheetValues;
}

const purchaseOrderIndexingMain = () => {
  const sids = [1, 2, 3];
  const [...sheets] = sids.map((sid) => fetchSheet(null, sid));
  const dataRanges: [Sheet, SheetValues][] = [];
  const [purchaseOrderHeader, subPurchaseOrderHeader] = ['Purchase Order #', 'Sub PO #'];
  for (const sheet of sheets) {
    const sheetHeaders: SheetHeaders = getSheetHeaders(sheet);
    const purchaseOrderColumn = getColumn(sheetHeaders, purchaseOrderHeader);
    const subPurchaseOrderColumn = getColumn(sheetHeaders, subPurchaseOrderHeader);
    const sheetValues = getSheetValues(sheet);
    const updatedSheetValues = createUniqueIndexing(sheetValues, purchaseOrderColumn, subPurchaseOrderColumn);
    dataRanges.push([sheet, updatedSheetValues]);
  }
  for (const [sheet, values] of dataRanges) sheet.getDataRange().setValues(values);
}