'use strict';
import { getSheetHeaders, getCoordinates, fetchActiveSheet, SheetHeaders, SheetValues, SheetRow, Coordinates } from "../../../global/global";

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
// type SheetHeaders = Map<string, number>;
// type SheetValues = string[][];
// type SheetRow = SheetValues[number];
// type Coordinates<T extends number[]> = T & { length: 4 };

// @subroutine {Function} Pure: number | Error → get the x coordinate of the purchase order ID column from the active sheet
// @arg {SheetHeaders} activeSheetHeaders → the headers of the active sheet
// @arg {string} purchaseOrderHeader → the header of the purchase order column
// @arg {string} activeSheetName → the name of the active sheet
function getPurchaseOrderColumn(activeSheetHeaders: SheetHeaders, purchaseOrderHeader: string, activeSheetName: string): number | Error {
	const purchaseOrderIndex = activeSheetHeaders.get(purchaseOrderHeader);
	if (!purchaseOrderIndex) return new Error(`Could not find column ' ${purchaseOrderHeader}' in '${activeSheetName}'.`);
	return purchaseOrderIndex;
}

// @subroutine {Function} Pure: SheetValues | Error → get the purchase order body from the active sheet
// @arg {number} purchaseOrderColumn → the x coordinate of the purchase order column
// @arg {string} purchaseOrderId → the purchase order id to search for
// @arg {SheetValues} activeSheetSheetValues → the active sheet body
// @arg {string} activeSheetName → the name of the active sheet
function getPurchaseOrderSheetValues(purchaseOrderColumn: number, purchaseOrderId: string, activeSheetSheetValues: SheetValues, activeSheetName: string): SheetValues | Error {
	const purchaseOrderSheetValues: SheetValues = [];
	for (let x = 1; x < activeSheetSheetValues.length; ++x) {
		const row: SheetRow = activeSheetSheetValues[x];
		const thisPurchaseOrderId = row[purchaseOrderColumn];
		if (thisPurchaseOrderId === purchaseOrderId) purchaseOrderSheetValues.push(row);
	}
	if (!purchaseOrderSheetValues.length) {
		const error = new Error(`Could not find purchase order '${purchaseOrderId}' in '${activeSheetName}'.`);
		error.name = 'searchError';
		return error;
	}
	return purchaseOrderSheetValues;
}

// @subroutine {Helper} Pure: SheetValues | Error → get the purchase order body from the active sheet
// @arg {string} purchaseOrderId → the purchase order id to search for, from user input
function handleQueryMain(purchaseOrderId: string): ClientQueryResponse | Error {
	const activeSheet = fetchActiveSheet();
	const activeSheetHeaders: SheetHeaders = getSheetHeaders(activeSheet);
	const activeSheetSheetValues: SheetValues = activeSheet.getDataRange().getValues();
	const purchaseOrderHeader = 'Purchase Order #';
	const activeSheetName = activeSheet.getName();
	const purchaseOrderColumn = getPurchaseOrderColumn(activeSheetHeaders, purchaseOrderHeader, activeSheetName);
	if (purchaseOrderColumn instanceof Error) return purchaseOrderColumn;
	const purchaseOrderSheetValues: SheetValues | Error = getPurchaseOrderSheetValues(purchaseOrderColumn, purchaseOrderId, activeSheetSheetValues, activeSheetName);
	if (purchaseOrderSheetValues instanceof Error) return purchaseOrderSheetValues;
	const coordinates: Coordinates<number[]> | Error = getCoordinates(activeSheetSheetValues, purchaseOrderSheetValues);
	if (coordinates instanceof Error) return coordinates;
	const bodyJSON = JSON.stringify(purchaseOrderSheetValues);
	const response: ClientQueryResponse = { coordinates, bodyJSON };
	return response;
}