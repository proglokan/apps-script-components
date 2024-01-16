"use strict";
// @subroutine {Function} Impure: GoogleAppsScript.Spreadsheet.Spreadsheet → get active spreadsheet
function getSpreadsheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    return ss;
}
// @subroutine {Function} Impure: string[][] → get invoice config data
// @arg {GoogleAppsScript.Spreadsheet.Sheet} configSheet → config sheet
function getConfig(configSheet) {
    const upperX = configSheet.getLastRow() - 1;
    const upperY = configSheet.getLastColumn();
    const configRange = configSheet.getRange(2, 1, upperX, upperY);
    const configData = configRange.getValues();
    return configData;
}
// @subroutine {Procedure} Void → render inputs in template modal
// @arg {string[][]} config → invoice inputs config data
function renderConfig(config) {
    const template = HtmlService.createTemplateFromFile('invoicing-cs');
    template.config = config;
    const html = template.evaluate().setWidth(500).setHeight(700);
    const ui = SpreadsheetApp.getUi();
    ui.showModelessDialog(html, 'Invoicing Config');
}
// @subroutine {Procedure} Void → helper
function invoicingHelper() {
    const ss = getSpreadsheet();
    const configSheet = ss.getSheetByName('Invoicing Config');
    const config = getConfig(configSheet);
    renderConfig(config);
}
// @subroutine {Function} Impure: Map<string, number> → get sheet headers
// @arg {GoogleAppsScript.Spreadsheet.Sheet} invoicesSheet → invoices sheet
// function getHeaders(invoicesSheet: GoogleAppsScript.Spreadsheet.Sheet): Map<string, number> {
//     const headers: Map<string, number> = new Map();  
//     const upperY: number = invoicesSheet.getLastColumn();
//     const headerRange: GoogleAppsScript.Spreadsheet.Range = invoicesSheet.getRange(1, 1, 1, upperY);
//     const headerData: string[] = headerRange.getValues()[0];
//     for (const title of headerData) {
//         const row: number = headerData.indexOf(title);
//         headers.set(title, row);
//     }
//     return headers;
// }
// @subroutine {Procedure} Void → post invoice data to invoices sheet
// @arg {string[]} invoice → user-inputted invoice data
function handleInvoice(invoice) {
    const ss = getSpreadsheet();
    const invoicesSheet = ss.getSheetByName('Invoices');
    // const headers: Map<string, number> = getHeaders(invoicesSheet);
    const row = invoicesSheet.getLastRow() + 1;
    invoicesSheet.getRange(row, 1, 1, invoice.length).setValues([invoice]);
}
//# sourceMappingURL=user-rendered-form-ss.js.map