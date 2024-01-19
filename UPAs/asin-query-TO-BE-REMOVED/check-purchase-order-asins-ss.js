import { fetchSheet, fetchActiveSheet, getHeaders } from "../../global/global";
import { getPurchaseOrderBody, getDuplicates } from "../upa-global/upa-global";
function getAsins(headers, body, asinHeader) {
    const xCoordinate = headers.get(asinHeader);
    if (!xCoordinate)
        throw new Error(`Header '${asinHeader}' not found in 'APO-Amz'`);
    const apoAmzAsins = body.map(row => row[xCoordinate]);
    return apoAmzAsins;
}
function checkPurchaseOrderAsins(purchaseOrderId) {
    const purchaseOrderSheet = fetchActiveSheet();
    const purchaseOrderSheetHeaders = getHeaders(purchaseOrderSheet);
    const purchaseOrderBody = getPurchaseOrderBody(purchaseOrderSheet, purchaseOrderId);
    if (purchaseOrderBody instanceof Error)
        return purchaseOrderBody;
    const [asinHeader, statusHeader] = ['ASIN', 'Status'];
    const purchaseOrderAsins = getAsins(purchaseOrderSheetHeaders, purchaseOrderBody, asinHeader);
    const apoAmzSheet = fetchSheet(null, 'APO-Amz');
    const apoAmzHeaders = getHeaders(apoAmzSheet);
    const apoAmzBody = apoAmzSheet.getDataRange().getValues();
    const apoAmzAsins = getAsins(apoAmzHeaders, apoAmzBody, asinHeader);
    const duplicates = getDuplicates(purchaseOrderAsins, apoAmzAsins);
    if (!duplicates.length)
        return true;
    return false;
}
//# sourceMappingURL=check-purchase-order-asins-ss.js.map