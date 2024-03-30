import { fetchSheets, getSheetHeaders, getColumn, getSheetValues, getCoordinates } from "../../global/global"
import { type Sheet, type SheetValues, type SheetHeaders, type SheetColumn, type Coordinates } from "../../global/definitions";

const getDataRanges = (sheets: Sheet[]) => {
  const dataRanges: [Sheet, SheetValues, Coordinates<number[]>][] = [];
  const purchaseOrderHeader = 'Purchase Order #';
  for (const sheet of sheets) {
    const headers: SheetHeaders = getSheetHeaders(sheet);
    const purchaseOrderColumn: SheetColumn = getColumn(headers, purchaseOrderHeader);
    const sheetValues: SheetValues = getSheetValues(sheet);
    sheetValues.sort((a, b) => {
      if (a[purchaseOrderColumn] < b[purchaseOrderColumn]) return 1;
      if (a[purchaseOrderColumn] > b[purchaseOrderColumn]) return -1;
      return 0;
    })
    const coordinates: Coordinates<number[]> = getCoordinates(sheet, sheetValues, 2, 1);
    dataRanges.push([sheet, sheetValues, coordinates]);
  }
  return dataRanges;
}

const sortPurchaseOrdersMain = () => {
  const sids = [1, 2, 3];
  const sheets: Sheet[] = fetchSheets(sids);
  const dataRanges: [Sheet, SheetValues, Coordinates<number[]>][] = getDataRanges(sheets);
  for (const [sheet, values, coordinates] of dataRanges) {
    const [row, column, rows, columns] = coordinates;
    sheet.getRange(row, column, rows, columns).setValues(values);
  }
}