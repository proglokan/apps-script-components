"use strict";
import { fetchActiveSheet, getSheetHeaders } from "../../global/global";
// * Parse the sheet into headers and body
// ! This function is already made in global.ts
const parseSheet = (sheet) => {
    const headers = getSheetHeaders(sheet);
    const body = sheet.getDataRange().getValues();
    return [headers, body];
};
// * Create a key value pair for each purchase order such that the key is the purchase order and the value is the number of rows that purchase order spans
const getPurchaseOrders = (headers, body) => {
    const purchaseOrderColumnName = "Purchase Order #";
    const purchaseOrderColumn = headers.get(purchaseOrderColumnName);
    if (purchaseOrderColumn === undefined)
        throw new Error(`No column found for name: ${purchaseOrderColumnName}`);
    const purchaseOrders = new Map();
    for (let x = 1; x < body.length; ++x) {
        const row = body[x];
        const purchaseOrder = row[purchaseOrderColumn];
        const purchaseOrderEntry = purchaseOrders.get(purchaseOrder);
        if (purchaseOrderEntry === undefined) {
            purchaseOrders.set(purchaseOrder, 1);
            continue;
        }
        purchaseOrders.set(purchaseOrder, purchaseOrderEntry + 1);
    }
    return purchaseOrders;
};
// * Get the upper bounds of each purchase order and store them in a list as ranges
const getRanges = (sheet, purchaseOrders) => {
    const ranges = [];
    const upperX = sheet.getLastColumn() - 1;
    let row = 2;
    for (const upperY of purchaseOrders.values()) {
        const range = sheet.getRange(row, 2, upperY, upperX);
        ranges.push(range);
        row += upperY;
    }
    return ranges;
};
// * Color code the ranges in the active sheet
const colorCodeRanges = (ranges) => {
    const colors = ["#cfe2f3", "#ead1dc"];
    for (let x = 0; x < ranges.length; ++x) {
        const range = ranges[x];
        const color = colors[x % colors.length];
        range.setBackground(color);
    }
};
// * Color code the purchase orders in the active sheet
const colorCodePoMain = () => {
    const activeSheet = fetchActiveSheet();
    const [headers, body] = parseSheet(activeSheet);
    const purchaseOrders = getPurchaseOrders(headers, body);
    const ranges = getRanges(activeSheet, purchaseOrders);
    colorCodeRanges(ranges);
};
//# sourceMappingURL=color-code-po-ss.js.map