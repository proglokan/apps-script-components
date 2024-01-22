'use strict';					
import { getHeaders, getCoordinates, fetchActiveSheet, _Headers, Body, Row, Coordinates  } from "../../../global/global";

interface ClientQueryResponse {
	coordinates: Coordinates<number[]>;
	bodyJSON: string;
}

// * REFERENCE FOR COMPILED FILE
//
// interface ClientQueryResponse {
// 	coordinates: Coordinates<number[]>;
// 	bodyJSON: string;
// }
// 
// type _Headers = Map<string, number>;
// type Body = string[][];
// type Row = Body[number];
// type Coordinates<T extends number[]> = T & { length: 4 };

// @subroutine {Function} Pure: number | Error → get the x coordinate of the purchase order ID column from the active sheet
// @arg {_Headers} activeSheetHeaders → the headers of the active sheet
// @arg {string} purchaseOrderHeader → the header of the purchase order column
// @arg {string} activeSheetName → the name of the active sheet
function getPurchaseOrderColumn(activeSheetHeaders: _Headers, purchaseOrderHeader: string, activeSheetName: string): number | Error {
	const purchaseOrderIndex = activeSheetHeaders.get(purchaseOrderHeader);
	if (!purchaseOrderIndex) return new Error(`Could not find column ' ${purchaseOrderHeader}' in '${activeSheetName}'.`);
	return purchaseOrderIndex;
}

// @subroutine {Function} Pure: Body | Error → get the purchase order body from the active sheet
// @arg {number} purchaseOrderColumn → the x coordinate of the purchase order column
// @arg {string} purchaseOrderId → the purchase order id to search for
// @arg {Body} activeSheetBody → the active sheet body
// @arg {string} activeSheetName → the name of the active sheet
function getPurchaseOrderBody(purchaseOrderColumn: number, purchaseOrderId: string, activeSheetBody: Body, activeSheetName: string): Body | Error {
	const purchaseOrderBody: Body = [];
	for (let x = 1; x < activeSheetBody.length; ++x) {
		const row: Row = activeSheetBody[x];
		const thisPurchaseOrderId = row[purchaseOrderColumn];
		if (thisPurchaseOrderId === purchaseOrderId) purchaseOrderBody.push(row);
	}
	if (!purchaseOrderBody.length) {
		const error = new Error(`Could not find purchase order '${purchaseOrderId}' in '${activeSheetName}'.`);
		error.name = 'searchError';
		return error;
	}
	return purchaseOrderBody;
}

// @subroutine {Helper} Pure: Body | Error → get the purchase order body from the active sheet
// @arg {string} purchaseOrderId → the purchase order id to search for, from user input
function handleQueryMain(purchaseOrderId: string): ClientQueryResponse | Error {
	const activeSheet = fetchActiveSheet();
	const activeSheetHeaders: _Headers = getHeaders(activeSheet);
	const activeSheetBody: Body = activeSheet.getDataRange().getValues();
	const purchaseOrderHeader = 'Purchase Order #';
	const activeSheetName = activeSheet.getName();
	const purchaseOrderColumn = getPurchaseOrderColumn(activeSheetHeaders, purchaseOrderHeader, activeSheetName);
	if (purchaseOrderColumn instanceof Error) return purchaseOrderColumn;
	const purchaseOrderBody: Body | Error = getPurchaseOrderBody(purchaseOrderColumn, purchaseOrderId, activeSheetBody, activeSheetName);
    if (purchaseOrderBody instanceof Error) return purchaseOrderBody;
	const coordinates: Coordinates<number[]> | Error = getCoordinates(activeSheetBody, purchaseOrderBody);
	if (coordinates instanceof Error) return coordinates;
    const bodyJSON = JSON.stringify(purchaseOrderBody);
	const response: ClientQueryResponse = { coordinates, bodyJSON };
    return response;
}