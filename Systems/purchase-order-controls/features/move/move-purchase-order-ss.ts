'use strict';
import { Body, Coordinates, fetchSheet } from "../../../../global/global";
// @subroutine {Helper} Void | Error → move the purchase order body to another sheet
function movePurchaseOrderMain(targetSheetName: string, targetBody: Body, coordinates: Coordinates<number[]>): void | Error {
	switch (true) {
		case targetSheetName.length === 0:
			return new Error('Target sheet name is empty.');
		case !targetBody.length:
			return new Error('Target body is empty.');
		default: 
			break;
	}
	if (targetSheetName.length === 0) return new Error('Target sheet name is empty.');
	const targetSheet = fetchSheet(null, targetSheetName);
	const targetRow = targetSheet.getLastRow() + 1;
	const [ sourceRow, column, rows, columns ] = coordinates;
	const range: GoogleAppsScript.Spreadsheet.Range = targetSheet.getRange(targetRow, column, rows, columns);
	range.setValues(targetBody);
}