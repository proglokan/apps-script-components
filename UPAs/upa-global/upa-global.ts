'use strict';
import { fetchActiveSheet, getHeaders, _Headers, Body } from "../../global/global";

function parseActiveSheetBody(purchaseOrderIndex: number, purchaseOrderId: string, activeSheetBody: Body): Body {
	const purchaseOrderBody: Body = [];
	for (const row of activeSheetBody) {
		if (row[purchaseOrderIndex] === purchaseOrderId) purchaseOrderBody.push(row);
	}
	return purchaseOrderBody;
}

function getPurchaseOrderBody(purchaseOrderId: string): Body {
	const activeSheet: GoogleAppsScript.Spreadsheet.Sheet = fetchActiveSheet();
	const activeSheetHeaders: _Headers = getHeaders(activeSheet);
	const activeSheetBody: Body = activeSheet.getDataRange().getValues();
	const purchaseOrderHeader = 'Purchase Order #';
	const purchaseOrderIndex = activeSheetHeaders.get(purchaseOrderHeader);
	if (!purchaseOrderIndex) throw new Error(`Could not find column ' ${purchaseOrderHeader}' in '${activeSheet.getName()}'.`);
	const purchaseOrderBody: Body = parseActiveSheetBody(purchaseOrderIndex, purchaseOrderId, activeSheetBody);
	if (!purchaseOrderBody.length) throw new Error(`Could not find purchase order '${purchaseOrderId}' in '${activeSheet.getName()}'.`);
	return purchaseOrderBody;
}

export { getPurchaseOrderBody };