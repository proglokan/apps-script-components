'use strict';
import { fetchActiveSheet, getHeaders } from "../global/global";
// [+] REFERENCE FOR COMPILED FILE
// 
// type _Headers = Map<string, number>;
// type Body = string[][];
// 
// @subroutine {Function} Pure: _Headers, Body → parse the sheet into headers and body
// @arg {GoogleAppsScript.Spreadsheet.Sheet} sheet → the sheet in the source workbook
function parseSheet(sheet) {
    const headers = getHeaders(sheet);
    const body = sheet.getDataRange().getValues();
    return [headers, body];
}
// @subroutine {Function} Pure: Map<string, number> → create a key value pair for each purchase order such that the key is the purchase order and the value is the number of rows that purchase order spans
// @arg {_Headers}: headers → the headers of the source workbook
// @arg {Body}: body → the body of the source workbook
function getPurchaseOrders(headers, body) {
    const purchaseOrderColumnName = 'Purchase Order #';
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
}
// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet.Range[] → get the upper bounds of each purchase order and store them in a list as ranges
// @arg {GoogleAppsScript.Spreadsheet.Sheet} sheet → the user's active sheet in the active spreadsheet
// @arg {Map<string, number>} purchaseOrders → the purchase orders and the number of rows they span
function getRanges(sheet, purchaseOrders) {
    const ranges = [];
    const upperX = sheet.getLastColumn() - 1;
    let row = 2;
    for (const upperY of purchaseOrders.values()) {
        const range = sheet.getRange(row, 2, upperY, upperX);
        ranges.push(range);
        row += upperY;
    }
    return ranges;
}
// @subroutine {Procedure}: Void → color code the ranges in the active sheet
function colorCodeRanges(ranges) {
    const colors = ['#cfe2f3', '#ead1dc'];
    for (let x = 0; x < ranges.length; ++x) {
        const range = ranges[x];
        const color = colors[x % colors.length];
        range.setBackground(color);
    }
}
// @subroutine {Helper} Void → color code the purchase orders in the active sheet
function colorCodePoMain() {
    const activeSheet = fetchActiveSheet();
    const [headers, body] = parseSheet(activeSheet);
    const purchaseOrders = getPurchaseOrders(headers, body);
    const ranges = getRanges(activeSheet, purchaseOrders);
    colorCodeRanges(ranges);
}
//# sourceMappingURL=color-code-po-ss.js.map