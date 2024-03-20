"use strict";
import { getSheetHeaders, getCoordinates, fetchActiveSheet } from "../../../global/global";
import { type SheetHeaders, type SheetValues, type SheetRow, type SheetCoordinates, type ClientQueryResponse } from "../../../global/definitions";

// * Get the x coordinate of the purchase order ID column from the active sheet
const getPurchaseOrderColumn = (activeSheetHeaders: SheetHeaders, purchaseOrderHeader: string, activeSheetName: string): number | Error => {
  const purchaseOrderIndex = activeSheetHeaders.get(purchaseOrderHeader);
  if (!purchaseOrderIndex) return new Error(`Could not find column ' ${purchaseOrderHeader}' in '${activeSheetName}'.`);

  return purchaseOrderIndex;
};

// * Get the purchase order body from the active sheet
const getPurchaseOrderSheetValues = (
  purchaseOrderColumn: number,
  purchaseOrderId: string,
  activeSheetSheetValues: SheetValues,
  activeSheetName: string,
): SheetValues | Error => {
  const purchaseOrderSheetValues: SheetValues = [];
  for (let x = 1; x < activeSheetSheetValues.length; ++x) {
    const row: SheetRow = activeSheetSheetValues[x];
    const thisPurchaseOrderId = row[purchaseOrderColumn];
    if (thisPurchaseOrderId === purchaseOrderId) purchaseOrderSheetValues.push(row);
  }

  if (!purchaseOrderSheetValues.length) {
    const error = new Error(`Could not find purchase order '${purchaseOrderId}' in '${activeSheetName}'.`);
    error.name = "searchError";

    return error;
  }

  return purchaseOrderSheetValues;
};

// * Get the purchase order body from the active sheet
const handleQueryMain = (purchaseOrderId: string): ClientQueryResponse | Error => {
  const activeSheet = fetchActiveSheet();
  const activeSheetHeaders: SheetHeaders = getSheetHeaders(activeSheet);
  const activeSheetSheetValues: SheetValues = activeSheet.getDataRange().getValues();
  const purchaseOrderHeader = "Purchase Order #";
  const activeSheetName = activeSheet.getName();
  const purchaseOrderColumn = getPurchaseOrderColumn(activeSheetHeaders, purchaseOrderHeader, activeSheetName);
  if (purchaseOrderColumn instanceof Error) return purchaseOrderColumn;
  const purchaseOrderSheetValues: SheetValues | Error = getPurchaseOrderSheetValues(
    purchaseOrderColumn,
    purchaseOrderId,
    activeSheetSheetValues,
    activeSheetName,
  );
  if (purchaseOrderSheetValues instanceof Error) return purchaseOrderSheetValues;

  // ! getCoordinates was changed and this no longer works
  const coordinates: SheetCoordinates<number[]> | Error = getCoordinates(activeSheet, purchaseOrderSheetValues, undefined, undefined);

  if (coordinates instanceof Error) return coordinates;
  const bodyJSON = JSON.stringify(purchaseOrderSheetValues);
  const response: ClientQueryResponse = { coordinates, bodyJSON };

  return response;
};
