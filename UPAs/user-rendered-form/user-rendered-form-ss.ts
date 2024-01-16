'use strict';
import { fetchSheet } from "../../global/global";

// @subroutine {Procedure} Void → render inputs in template modal
// @arg {string[][]} config → invoice inputs config data
function renderConfig(config: string[][]): void {
    const template: any = HtmlService.createTemplateFromFile('invoicing-cs');
    template.config = config;
    const html: any = template.evaluate().setWidth(500).setHeight(700);
    const ui: GoogleAppsScript.Base.Ui = SpreadsheetApp.getUi();
    ui.showModelessDialog(html, 'Invoicing Config');
}

// @subroutine {Helper} Void → 
function invoicingHelper() {
    const configSheet: GoogleAppsScript.Spreadsheet.Sheet = fetchSheet(null, 'Config');
    const config: string[][] = configSheet.getDataRange().getValues();
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
function handleInvoice(invoice: string[]): void {
    const invoicesSheet: GoogleAppsScript.Spreadsheet.Sheet = fetchSheet(null, 'Invoices');
    // const headers: Map<string, number> = getHeaders(invoicesSheet);
    const row: number = invoicesSheet.getLastRow() + 1;
    invoicesSheet.getRange(row, 1, 1, invoice.length).setValues([invoice]);
}