'use strict';
interface FrontendEntry {
  date: string | Date;
  data: string[] | string;
  active: boolean;
  row: number;
}

// [+] REFERENCE FOR COMPILED FILE
// interface FrontendEntry {
//   date: string | Date;
//   data: string[] | string;
//   active: boolean;
// }

// @subroutine {Function} Pure: FrontendEntry[] → deconstruct the data from the middleware workbook into a frontend-friendly format
function deconstructData(constructedData: string[][]): FrontendEntry[] {
  const frontendData: FrontendEntry[] = [];
  for (let x = 1; x < constructedData.length; ++x) {
    const cell = constructedData[x][0];
    if (cell === 'Vendor Reports') continue;
    const [ date, rawData ] = constructedData[x][0].split('→');
    const data: string[] | string = JSON.parse(rawData);
    const active = !!data.length;
    const row = x;
    const frontendEntry: FrontendEntry = { date, data, active, row };
    frontendData.push(frontendEntry);
  }
  return frontendData;
}

// @subroutine {Procedure} Void → display the vendor reports in a modeless dialog
// @arg {FrontendEntry[]} frontendData → the data that makes up the accordions' table data
function renderUI(frontendData: FrontendEntry[]): void {
  const template: GoogleAppsScript.HTML.HtmlTemplate = HtmlService.createTemplateFromFile('display-vendor-reports-cs');
  template.frontendData = frontendData as GoogleAppsScript.HTML.HtmlTemplate['frontendData'];
  const html: GoogleAppsScript.HTML.HtmlOutput = template.evaluate().setWidth(1000).setHeight(1200);
  const ui: GoogleAppsScript.Base.Ui = SpreadsheetApp.getUi();
  ui.showModelessDialog(html, 'Vendor Reports');
}

// @subroutine {Procedure} Void → get the vendor reports from the middleware workbook and display them in a modeless dialog
function displayVendorReports(): void {
  const middlewareSheet: GoogleAppsScript.Spreadsheet.Sheet = getMiddlewareSheet();
  const data: string[][] = middlewareSheet.getDataRange().getValues();
  const deconstructedData: FrontendEntry[] = deconstructData(data);
  renderUI(deconstructedData);
}
