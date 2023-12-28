type AccountingValues = Array<[string, string, number, string]>;

function getSheetData() {
  const ss = SpreadsheetApp.getActive() as GoogleAppsScript.Spreadsheet.Spreadsheet;
  const sheet = ss.getSheetByName('test') as GoogleAppsScript.Spreadsheet.Sheet;
  return [ss, sheet];
}

function getValues(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
  const upperX: number = sheet.getLastRow();
  const upperY: number = sheet.getLastColumn();
  const range: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(2, 1, upperX, upperY);
  const values = range.getValues() as AccountingValues;
  return values;
}

function createMapByCategories(values: AccountingValues) {
}

function accountingHelper() {
  const [ss, sheet] = getSheetData() as [GoogleAppsScript.Spreadsheet.Spreadsheet, GoogleAppsScript.Spreadsheet.Sheet];
  const values: AccountingValues = getValues(sheet);
  const mapByCategories = createMapByCategories(values);
  Logger.log(mapByCategories);
}
