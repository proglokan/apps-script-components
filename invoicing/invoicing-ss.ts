// @subroutine {Function} Impure: GoogleAppsScript.Spreadsheet.Spreadsheet → get active spreadsheet
function getSpreadsheet(): GoogleAppsScript.Spreadsheet.Spreadsheet {
    const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    return ss;
}

// @subroutine {Function} Impure: string[][] → get invoice config data
// @arg {GoogleAppsScript.Spreadsheet.Sheet} configSheet → config sheet
function getConfig(configSheet: GoogleAppsScript.Spreadsheet.Sheet): string[][] {
    const upperX: number = configSheet.getLastRow() - 1;
    const upperY: number = configSheet.getLastColumn();
    const configRange: GoogleAppsScript.Spreadsheet.Range = configSheet.getRange(2, 1, upperX, upperY);
    const configData: any[][] = configRange.getValues();
    return configData;
}

// @subroutine {Procedure} Void → render inputs in template modal
// @arg {string[][]} config → invoice inputs config data
function renderConfig(config: string[][]): void {
    const template: any = HtmlService.createTemplateFromFile('invoicing-cs');
    template.config = config;
    const html: any = template.evaluate().setWidth(500).setHeight(700);
    const ui: GoogleAppsScript.Base.Ui = SpreadsheetApp.getUi();
    ui.showModelessDialog(html, 'Invoicing Config');
}

// @subroutine {Procedure} Void → helper
function invoicingHelper() {
    const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = getSpreadsheet();
    const configSheet: GoogleAppsScript.Spreadsheet.Sheet = ss.getSheetByName('Invoicing Config') as GoogleAppsScript.Spreadsheet.Sheet;
    const config: any[][] = getConfig(configSheet);
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
    const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = getSpreadsheet();
    const invoicesSheet: GoogleAppsScript.Spreadsheet.Sheet = ss.getSheetByName('Invoices') as GoogleAppsScript.Spreadsheet.Sheet;
    // const headers: Map<string, number> = getHeaders(invoicesSheet);
    const row: number = invoicesSheet.getLastRow() + 1;
    invoicesSheet.getRange(row, 1, 1, invoice.length).setValues([invoice]);
}