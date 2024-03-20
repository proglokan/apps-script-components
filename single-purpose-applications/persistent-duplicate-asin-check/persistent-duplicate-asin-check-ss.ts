"use strict";
import { fetchSheet, getSheetHeaders } from "../../global/global";
import { type SheetHeaders, type SheetValues, type ComparativeAsins, type Data, type Coordinates } from "../../global/definitions";

// * Get ASINs from both the RFQ and APO - Amz sheets for comparison
const getComparativeAsins = (data: Data[], asinHeader: string): ComparativeAsins => {
  const comparativeAsins: ComparativeAsins = { reference: [], comparison: [] };
  const dataSets: string[][] = [];
  for (const [sheet, headers, body] of data) {
    const xCoordinate = headers.get(asinHeader);
    if (!xCoordinate) throw new Error(`Header '${asinHeader}' not found in ${sheet.getName()}`);
    const asinColumn = body.map((row) => row[xCoordinate]);
    dataSets.push(asinColumn);
  }

  const [reference, comparison] = dataSets;
  comparativeAsins.reference = reference;
  comparativeAsins.comparison = comparison;

  return comparativeAsins;
};

// * Get indexes of duplicate ASINs
const getDuplicates = (reference: string[], comparison: string[]): number[] => {
  const duplicates: number[] = [];
  for (let x = 1; x < reference.length; ++x) {
    const referenceAsin = reference[x];
    if (referenceAsin === "") continue;
    for (let y = 1; y < comparison.length; ++y) {
      const comparisonAsin = comparison[y];
      if (referenceAsin !== comparisonAsin) continue;
      duplicates.push(x);
      break;
    }
  }

  return duplicates;
};

// * Extract values from the status column of the RFQ sheet
const extractStatusValues = (rfqSheetValues: SheetValues, statusColumn: number): SheetValues => {
  const statusValues: SheetValues = [];
  for (let x = 0; x < rfqSheetValues.length; ++x) {
    const row = rfqSheetValues[x];
    const statusValue = row[statusColumn];
    statusValues.push([statusValue]);
  }

  return statusValues;
};

// * Create coordinates based on a column, body of values, and possibly a sheet
const getCoordinates = (sheet: GoogleAppsScript.Spreadsheet.Sheet | null, column: number, values: SheetValues): Coordinates<number[]> => {
  const row = !sheet ? 1 : sheet.getLastRow() + 1;
  const upperX = values.length;
  const upperY = values[0].length;
  const valuesCoordinates: Coordinates<number[]> = [row, column + 1, upperX, upperY];

  return valuesCoordinates;
};

// * Replace values in the status column with 'duplicate order' based on a list of indexes
const updateStatusValues = (rfqHeaders: SheetHeaders, rfqSheetValues: SheetValues, statusHeader: string, duplicates: number[]): any => {
  // TODO: FIX RETURN TYPE WHEN FUNCTION IS MODULARIZED
  const statusColumn = rfqHeaders.get(statusHeader);
  if (!statusColumn) throw new Error(`Header '${statusHeader}' not found in RFQ`);
  const statusValues: SheetValues = extractStatusValues(rfqSheetValues, statusColumn);
  for (let x = 0; x < duplicates.length; ++x) {
    const row = duplicates[x];
    statusValues[row][0] = "Duplicate Asins - Please Review";
  }

  const valuesCoordinates: Coordinates<number[]> = getCoordinates(null, statusColumn, statusValues);

  return [statusValues, valuesCoordinates];
};

// * Update a given sheet with values based on a given range
const updateSheet = (sheet: GoogleAppsScript.Spreadsheet.Sheet, values: SheetValues, coordinates: Coordinates<number[]>): void => {
  const [row, column, upperX, upperY] = coordinates;
  const range = sheet.getRange(row, column, upperX, upperY);
  range.setValues(values);
};

// * Notify the team of duplicate ASINs
const notifyTeam = (duplicates: number[]) => {
  const date = new Date().toLocaleDateString();
  const subject = `${date} - Duplicate ASINs detected`;
  const body = `Duplicate ASINs detected at the following rows: ${duplicates.map((x: number) => x + 1).join(", ")}`;
  GmailApp.sendEmail("nimrod@profitzon.net, amit@profitzon.net, desireeproglo@gmail.com", subject, body);
};

// * Search for duplicates between a header-based column in two sheets and set statuses if duplicates are found
const duplicateAsinSearchMain = (): void => {
  const rfqSheet: GoogleAppsScript.Spreadsheet.Sheet = fetchSheet(null, 914981809);
  const rfqHeaders: SheetHeaders = getSheetHeaders(rfqSheet);
  const rfqSheetValues: SheetValues = rfqSheet.getDataRange().getValues();
  const apoAmzSheet: GoogleAppsScript.Spreadsheet.Sheet = fetchSheet(null, 1844782191);
  const apoAmzHeaders: SheetHeaders = getSheetHeaders(apoAmzSheet);
  const apoAmzSheetValues: SheetValues = apoAmzSheet.getDataRange().getValues();
  const [asinHeader, statusHeader] = ["ASIN", "Status"];
  const { reference, comparison }: ComparativeAsins = getComparativeAsins(
    [
      [rfqSheet, rfqHeaders, rfqSheetValues],
      [apoAmzSheet, apoAmzHeaders, apoAmzSheetValues],
    ],
    asinHeader,
  );
  const duplicates: number[] = getDuplicates(reference, comparison);
  if (!duplicates.length) return;
  const [statusValues, valuesCoordinates] = updateStatusValues(rfqHeaders, rfqSheetValues, statusHeader, duplicates); // TODO: SPLIT INTO TWO FUNCTIONS
  updateSheet(rfqSheet, statusValues, valuesCoordinates);
  notifyTeam(duplicates);
};
