"use strict";
import { getSheetHeaders, getCoordinates, fetchActiveSheet } from "../../../global/global";
// * Get the x coordinate of the purchase order ID column from the active sheet
const getPurchaseOrderColumn = (activeSheetHeaders, purchaseOrderHeader, activeSheetName) => {
    const purchaseOrderIndex = activeSheetHeaders.get(purchaseOrderHeader);
    if (!purchaseOrderIndex)
        return new Error(`Could not find column ' ${purchaseOrderHeader}' in '${activeSheetName}'.`);
    return purchaseOrderIndex;
};
// * Get the purchase order body from the active sheet
const getPurchaseOrderSheetValues = (purchaseOrderColumn, purchaseOrderId, activeSheetSheetValues, activeSheetName) => {
    const purchaseOrderSheetValues = [];
    for (let x = 1; x < activeSheetSheetValues.length; ++x) {
        const row = activeSheetSheetValues[x];
        const thisPurchaseOrderId = row[purchaseOrderColumn];
        if (thisPurchaseOrderId === purchaseOrderId)
            purchaseOrderSheetValues.push(row);
    }
    if (!purchaseOrderSheetValues.length) {
        const error = new Error(`Could not find purchase order '${purchaseOrderId}' in '${activeSheetName}'.`);
        error.name = "searchError";
        return error;
    }
    return purchaseOrderSheetValues;
};
// * Get the purchase order body from the active sheet
const handleQueryMain = (purchaseOrderId) => {
    const activeSheet = fetchActiveSheet();
    const activeSheetHeaders = getSheetHeaders(activeSheet);
    const activeSheetSheetValues = activeSheet.getDataRange().getValues();
    const purchaseOrderHeader = "Purchase Order #";
    const activeSheetName = activeSheet.getName();
    const purchaseOrderColumn = getPurchaseOrderColumn(activeSheetHeaders, purchaseOrderHeader, activeSheetName);
    if (purchaseOrderColumn instanceof Error)
        return purchaseOrderColumn;
    const purchaseOrderSheetValues = getPurchaseOrderSheetValues(purchaseOrderColumn, purchaseOrderId, activeSheetSheetValues, activeSheetName);
    if (purchaseOrderSheetValues instanceof Error)
        return purchaseOrderSheetValues;
    // ! getCoordinates was changed and this no longer works
    const coordinates = getCoordinates(activeSheet, purchaseOrderSheetValues, undefined, undefined);
    if (coordinates instanceof Error)
        return coordinates;
    const bodyJSON = JSON.stringify(purchaseOrderSheetValues);
    const response = { coordinates, bodyJSON };
    return response;
};
//# sourceMappingURL=handle-query.js.map