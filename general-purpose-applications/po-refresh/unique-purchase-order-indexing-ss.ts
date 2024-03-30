import { getCoordinates, getSheetValues, newError, getSheetHeaders, getUniqueIdentifier, fetchSheets, getSheetFormulas, updateSheetValuesWithFormulas } from "../../global/global";
import { type Sheet, type SheetHeaders, type SheetValues, type SheetRow, type SheetColumn } from "../../global/definitions";

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
  const sheets: Sheet[] = fetchSheets(sids);
  const dataRanges: [Sheet, SheetValues, SheetColumn][] = [];
  const [purchaseOrderHeader, subPurchaseOrderHeader] = ['Purchase Order #', 'Sub PO #'];
  for (const sheet of sheets) {
    const sheetHeaders: SheetHeaders = getSheetHeaders(sheet);
    const purchaseOrderColumn = getColumn(sheetHeaders, purchaseOrderHeader);
    const subPurchaseOrderColumn = getColumn(sheetHeaders, subPurchaseOrderHeader);
    const sheetValues = getSheetValues(sheet);
    const sheetFormulas = getSheetFormulas(sheet);
    const updatedSheetValues = createUniqueIndexing(sheetValues, purchaseOrderColumn, subPurchaseOrderColumn);
    const updatedSheetValuesWithFormulas = updateSheetValuesWithFormulas(updatedSheetValues, sheetFormulas);
    dataRanges.push([sheet, updatedSheetValuesWithFormulas, subPurchaseOrderColumn]);
  }
  for (const [sheet, values, subPurchaseOrderColumn] of dataRanges) {
    const subPurchaseOrderIDs: SheetValues = values.map((row) => [row[subPurchaseOrderColumn]]);
    const [row, column, rows, columns] = getCoordinates(sheet, subPurchaseOrderIDs, 2, subPurchaseOrderColumn + 1);
    sheet.getRange(row, column, rows, columns).setValues(subPurchaseOrderIDs);
  }
}
