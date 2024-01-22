'use strict';
import { fetchSheet } from '../../../../global/global';
// @subroutine {Helper} Void | Error → move the purchase order body to another sheet
function movePurchaseOrderMain(targetSheetName, targetBody, coordinates) {
	if (targetSheetName.length === 0) return new Error('Target sheet name is empty.');
	const targetSheet = fetchSheet(null, targetSheetName);
	const targetRow = targetSheet.getLastRow() + 1;
	const [sourceRow, column, rows, columns] = coordinates;
	const range = targetSheet.getRange(targetRow, column, rows, columns);
	range.setValues(targetBody);
}
//# sourceMappingURL=move-purchase-order-ss.js.map
