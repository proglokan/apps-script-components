'use strict';
import { getHeaders } from "../../global/global";
// @subroutine {Function} Pure: Body → parse the active sheet body and return all rows that contain the purchase order id
// @arg {Number} purchaseOrderIndex → the index of the purchase order column
// @arg {String} purchaseOrderId → the purchase order id to search for
// @arg {Body} activeSheetBody → the active sheet body
function parseActiveSheetBody(purchaseOrderIndex, purchaseOrderId, activeSheetBody) {
    const purchaseOrderBody = [];
    for (const row of activeSheetBody) {
        if (row[purchaseOrderIndex] === purchaseOrderId)
            purchaseOrderBody.push(row);
    }
    return purchaseOrderBody;
}
// @subroutine {Function} Pure: Body | string → parse the active sheet body and return all rows that contain the purchase order id
// @arg {String} purchaseOrderId → the purchase order id to search for
function getPurchaseOrderBody(activeSheet, purchaseOrderId) {
    const activeSheetHeaders = getHeaders(activeSheet);
    const activeSheetBody = activeSheet.getDataRange().getValues();
    const purchaseOrderHeader = 'Purchase Order #';
    const purchaseOrderIndex = activeSheetHeaders.get(purchaseOrderHeader);
    if (!purchaseOrderIndex)
        return new Error(`Could not find column ' ${purchaseOrderHeader}' in '${activeSheet.getName()}'.`);
    const purchaseOrderBody = parseActiveSheetBody(purchaseOrderIndex, purchaseOrderId, activeSheetBody);
    if (!purchaseOrderBody.length)
        return new Error(`Could not find purchase order '${purchaseOrderId}' in '${activeSheet.getName()}'.`);
    return purchaseOrderBody;
}
// @subroutine {Function} Pure: number[] → get indexes of duplicate ASINs
// @arg {string[]} reference → >= list of ASINs from the RFQ sheet
// @arg {string[]} comparison → <= list of ASINs from the APO - Amz sheet
function getDuplicates(reference, comparison) {
    const duplicates = [];
    for (let x = 1; x < reference.length; ++x) {
        const referenceAsin = reference[x];
        if (referenceAsin === '')
            continue;
        for (let y = 1; y < comparison.length; ++y) {
            const comparisonAsin = comparison[y];
            if (referenceAsin !== comparisonAsin)
                continue;
            duplicates.push(x);
            break;
        }
    }
    return duplicates;
}
export { getPurchaseOrderBody, getDuplicates };
//# sourceMappingURL=upa-global.js.map