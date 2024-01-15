import { fetchSheet, getHeaders, _Headers, Body } from "../../global/global";
'use strict';
interface ComparativeAsins {
  reference: string[];
  comparison: string[];
}
type Data = [GoogleAppsScript.Spreadsheet.Sheet, _Headers, Body];
type Coordinates<T extends number[]> = T & { length: 4 };

// * REFERENCE FOR COMPILED FILE
//
// type _Headers = Map<string, number>;
// type Body = string[][];
// interface ComparativeAsins {
//   reference: string[];
//   comparison: string[];
// }
// type Data = [GoogleAppsScript.Spreadsheet.Sheet, _Headers, Body];
// type Coordinates<T extends number[]> = T & { length: 4 };

// @subroutine {Function} Pure: ComparativeAsins → get ASINs from both the RFQ and APO - Amz sheets for comparison
// @arg {_Headers} rfqHeaders → headers from the RFQ sheet
// @arg {Body} rfqBody → body from the RFQ sheet
// @arg {_Headers} apoAmzHeaders → headers from the APO - Amz sheet
// @arg {Body} apoAmzBody → body from the APO - Amz sheet
// @arg {string} asinHeader → header for the ASIN column
function getComparativeAsins(data: Data[], asinHeader: string): ComparativeAsins {
  const comparativeAsins: ComparativeAsins = { reference: [], comparison: [] };
  const dataSets: string[][] = [];
  for (const [sheet, headers, body] of data) {
    const xCoordinate = headers.get(asinHeader);
    if (!xCoordinate) throw new Error(`Header '${asinHeader}' not found in ${sheet.getName()}`);
    const asinColumn = body.map(row => row[xCoordinate]);
    dataSets.push(asinColumn);
  }
  const [ reference, comparison ] = dataSets;
  comparativeAsins.reference = reference;
  comparativeAsins.comparison = comparison;
  return comparativeAsins;
}

// @subroutine {Function} Pure: number[] → get indexes of duplicate ASINs
// @arg {string[]} reference → >= list of ASINs from the RFQ sheet
// @arg {string[]} comparison → <= list of ASINs from the APO - Amz sheet
function getDuplicates(reference: string[], comparison: string[]): number[] {
  const duplicates: number[] = [];
  for (let x = 1; x < reference.length; ++x) {
    const referenceAsin = reference[x];
    if (referenceAsin === '') continue;
    for (let y = 1; y < comparison.length; ++y) {
      const comparisonAsin = comparison[y];
      if (referenceAsin !== comparisonAsin) continue;
      duplicates.push(x);
      break;
    }
  }
  return duplicates;
}

// @subroutine {Function} Pure: Body → extract values from the status column of the RFQ sheet
// @arg {Body} rfqBody → body from the RFQ sheet
// @arg {number} statusColumn → index of the status column
function extractStatusValues(rfqBody: Body, statusColumn: number): Body {
  const statusValues: Body = [];
  for (let x = 0; x < rfqBody.length; ++x) {
    const row = rfqBody[x];
    const statusValue = row[statusColumn];
    statusValues.push([statusValue]);
  }
  return statusValues;
}

// @subroutine {Function} Pure: Coordinates<number[]> → create coordinates based on a column, body of values, and possibly a sheet
// @arg {GoogleAppsScript.Spreadsheet.Sheet | null} sheet → sheet to get the last row of, or row 2 if null
// @arg {number} column → starting column
// @arg {Body} values → body of values
function getCoordinates(sheet: GoogleAppsScript.Spreadsheet.Sheet | null, column: number, values: Body): Coordinates<number[]> {
  const row = !sheet ? 1 : sheet.getLastRow() + 1;
  const upperX = values.length;
  const upperY = values[0].length;
  const valuesCoordinates: Coordinates<number[]> = [row, column + 1, upperX, upperY];
  return valuesCoordinates;
}

// @subroutine {Function} Pure: String[][] → replace values in the status column with 'duplicate order' based on a list of indexes
// @arg {_Headers} rfqHeaders → headers from the RFQ sheet
// @arg {Body} rfqBody → body from the RFQ sheet
// @arg {string} statusHeader → header for the status column
// @arg {number[]} duplicates → list of indexes of duplicate ASINs
function updateStatusValues(rfqHeaders: _Headers, rfqBody: Body, statusHeader: string, duplicates: number[]): any { // TODO: FIX RETURN TYPE WHEN FUNCTION IS MODULARIZED
  const statusColumn = rfqHeaders.get(statusHeader);
  if (!statusColumn) throw new Error(`Header '${statusHeader}' not found in RFQ`);
  const statusValues: Body = extractStatusValues(rfqBody, statusColumn);
  for (let x = 0; x < duplicates.length; ++x) {
    const row = duplicates[x];
    statusValues[row][0] = 'duplicate order';
  }
  const valuesCoordinates: Coordinates<number[]> = getCoordinates(null, statusColumn, statusValues);
  return [statusValues, valuesCoordinates];
}

// @subroutine {Procedure} Void → update a given sheet with values based on a given range
// @arg {GoogleAppsScript.Spreadsheet.Sheet} sheet → sheet to update
// @arg {Body} values → values to update the sheet with
// @arg {Coordinates} coordinates → range to update the sheet with
function updateSheet(sheet: GoogleAppsScript.Spreadsheet.Sheet, values: Body, coordinates: Coordinates<number[]>): void {
  const [row, column, upperX, upperY] = coordinates;
  const range = sheet.getRange(row, column, upperX, upperY);
  range.setValues(values);
}

// @subroutine {Procedure} Void → notify the team of duplicate ASINs
// @arg {number[]} duplicates → list of indexes of duplicate ASINs
function notifyTeam(duplicates: number[]) {
  const date = new Date().toLocaleDateString();
  const subject = `${date} - Duplicate ASINs detected`;
  const body = `Duplicate ASINs detected at the following rows: ${duplicates.map((x: number) => x + 1).join(', ')}`;
  GmailApp.sendEmail('nimrod@profitzon.net, amit@profitzon.net, desireeproglo@gmail.com', subject, body);
}

// @subroutine {Helper} Void → search for duplicates between a header-based column in two sheets and set statuses if duplicates are found
function duplicateAsinSearchMain(): void {
  const rfqSheet: GoogleAppsScript.Spreadsheet.Sheet = fetchSheet(null, 'RFQ');
  const rfqHeaders: _Headers = getHeaders(rfqSheet);
  const rfqBody: Body = rfqSheet.getDataRange().getValues();
  const apoAmzSheet: GoogleAppsScript.Spreadsheet.Sheet = fetchSheet(null, 'APO - Amz');
  const apoAmzHeaders: _Headers = getHeaders(apoAmzSheet);
  const apoAmzBody: Body = apoAmzSheet.getDataRange().getValues();
  const [ asinHeader, statusHeader ] = ['ASIN', 'Status'];
  const { reference, comparison }: ComparativeAsins = getComparativeAsins([[rfqSheet, rfqHeaders, rfqBody], [apoAmzSheet, apoAmzHeaders, apoAmzBody]], asinHeader); 
  const duplicates: number[] = getDuplicates(reference, comparison);
  if (!duplicates.length) return;
  const [ statusValues, valuesCoordinates ] = updateStatusValues(rfqHeaders, rfqBody, statusHeader, duplicates); // TODO: SPLIT INTO TWO FUNCTIONS
  updateSheet(rfqSheet, statusValues, valuesCoordinates);
  notifyTeam(duplicates);
}