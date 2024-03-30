import { getCoordinates, getSheetValues, newError, getSheetHeaders, getUniqueIdentifier, fetchSheets, getSheetFormulas, updateSheetValuesWithFormulas } from "../../global/global";
const getColumn = (headers, key) => {
    const value = headers.get(key) ?? newError('poRefresh-ss.ts', `Could not find \"${key}\" header`);
    if (value instanceof Error)
        throw value;
    return value;
};
const createUniqueIndexing = (sheetValues, purchaseOrderColumn, subPurchaseOrderColumn) => {
    for (let x = 0; x < sheetValues.length; x++) {
        const row = sheetValues[x];
        const purchaseOrderID = row[purchaseOrderColumn];
        const identifier = getUniqueIdentifier();
        const subPurchaseOrderValue = `${purchaseOrderID}-${identifier}`;
        row[subPurchaseOrderColumn] = subPurchaseOrderValue;
    }
    return sheetValues;
};
const purchaseOrderIndexingMain = () => {
    const sids = [1, 2, 3];
    const sheets = fetchSheets(sids);
    const dataRanges = [];
    const [purchaseOrderHeader, subPurchaseOrderHeader] = ['Purchase Order #', 'Sub PO #'];
    for (const sheet of sheets) {
        const sheetHeaders = getSheetHeaders(sheet);
        const purchaseOrderColumn = getColumn(sheetHeaders, purchaseOrderHeader);
        const subPurchaseOrderColumn = getColumn(sheetHeaders, subPurchaseOrderHeader);
        const sheetValues = getSheetValues(sheet);
        const sheetFormulas = getSheetFormulas(sheet);
        const updatedSheetValues = createUniqueIndexing(sheetValues, purchaseOrderColumn, subPurchaseOrderColumn);
        const updatedSheetValuesWithFormulas = updateSheetValuesWithFormulas(updatedSheetValues, sheetFormulas);
        dataRanges.push([sheet, updatedSheetValuesWithFormulas, subPurchaseOrderColumn]);
    }
    for (const [sheet, values, subPurchaseOrderColumn] of dataRanges) {
        const subPurchaseOrderIDs = values.map((row) => [row[subPurchaseOrderColumn]]);
        const [row, column, rows, columns] = getCoordinates(sheet, subPurchaseOrderIDs, 2, subPurchaseOrderColumn + 1);
        sheet.getRange(row, column, rows, columns).setValues(subPurchaseOrderIDs);
    }
};
//# sourceMappingURL=unique-purchase-order-indexing-ss.js.map