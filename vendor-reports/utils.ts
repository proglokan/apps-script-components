// @subroutine {Function} Pure: GoogleAppsScript.Spreadsheet.Sheet → get the sheet from the middleware workbook using its ID
function getMiddlewareSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  const ID = '1xi0VHDawZanfVc0JoR9gcysZgp_oHcAM04mrMTWN4Mo';
  const SHEET_NAME = 'Vendor Reports';
  const middlewareWorkbook: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.openById(ID);
  const middlewareSheet: GoogleAppsScript.Spreadsheet.Sheet | null = middlewareWorkbook.getSheetByName(SHEET_NAME);
  if (middlewareSheet === null) throw new Error(`Sheet ${SHEET_NAME} not found`);
  return middlewareSheet;
}