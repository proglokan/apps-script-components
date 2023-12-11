'use strict';
// @subroutine {Function} Pure: [string, (string | boolean)[][]] → deconstructs an entry into a date and respective report data
// @arg {string} entry → a stringified entry from the middleware sheet
function deconstructEntry(entry: string): [string, (string | boolean)[][]] {
  const [date, reportString] = entry.split('→');
  const report: (string | boolean)[][] = JSON.parse(reportString);
  return [ date, report ];
}

// @subroutine {Procedure} Void → update the status of a report given a report and index
function updateStatus(report: (string | boolean)[][], index: number): void {
  const row = report[index];
  const lastElement = row.length - 1;
  row[lastElement] = !row[lastElement];
  report[index] = row;
}

// @subroutine {Function} Pure: string → reconstructs an entry from a date and appended report data
function reconstructEntry(date: string, report: (string | boolean)[][]): string {
  const reportString = JSON.stringify(report);
  const entry = `${date}→${reportString}`;
  return entry;
}

// @subroutine {Procedure} Void → send appended entry to middleware workbook as an update
function sendAppendedEntry(middlewareSheet: GoogleAppsScript.Spreadsheet.Sheet, row: number, appendedEntry: string): void {
  const range = middlewareSheet.getRange(row, 1);
  range.setValue(appendedEntry);
}

// @subroutine {Helper} Void → append the report in the middleware workbook given a row and index
// @arg {number} row → the row of the report to append
// @arg {number} index → the index of the row in the report data to append
function appendReport(row: number, index: number) {
  const middlewareSheet: GoogleAppsScript.Spreadsheet.Sheet = getMiddlewareSheet();
  const entry = middlewareSheet.getRange(row, 1).getValue();
  const [ date, report ] = deconstructEntry(entry);
  updateStatus(report, index);
  const appendedEntry = reconstructEntry(date, report);
  sendAppendedEntry(middlewareSheet, row, appendedEntry);
}