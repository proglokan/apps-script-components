import { fetchSheets, getSheetHeaders, getColumn, getSheetValues, getCoordinates } from "../../global/global";
const getDataRanges = (sheets) => {
    const dataRanges = [];
    const purchaseOrderHeader = 'Purchase Order #';
    for (const sheet of sheets) {
        const headers = getSheetHeaders(sheet);
        const purchaseOrderColumn = getColumn(headers, purchaseOrderHeader);
        const sheetValues = getSheetValues(sheet);
        sheetValues.sort((a, b) => {
            if (a[purchaseOrderColumn] < b[purchaseOrderColumn])
                return 1;
            if (a[purchaseOrderColumn] > b[purchaseOrderColumn])
                return -1;
            return 0;
        });
        const coordinates = getCoordinates(sheet, sheetValues, 2, 1);
        dataRanges.push([sheet, sheetValues, coordinates]);
    }
    return dataRanges;
};
const sortPurchaseOrdersMain = () => {
    const sids = [1, 2, 3];
    const sheets = fetchSheets(sids);
    const dataRanges = getDataRanges(sheets);
    for (const [sheet, values, coordinates] of dataRanges) {
        const [row, column, rows, columns] = coordinates;
        sheet.getRange(row, column, rows, columns).setValues(values);
    }
};
//# sourceMappingURL=sort-purchase-orders-ss.js.map