function main() {
    const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = getSpreadsheet();
    const configSheet: GoogleAppsScript.Spreadsheet.Sheet = ss.getSheetByName('Invoicing Config') as GoogleAppsScript.Spreadsheet.Sheet;
    const config: any[][] = getConfig(configSheet);
    renderConfig(config);
}

function getSpreadsheet(): GoogleAppsScript.Spreadsheet.Spreadsheet {
    const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    return ss;
}

function getConfig(configSheet: GoogleAppsScript.Spreadsheet.Sheet): any[][] {
    const upperX: number = configSheet.getLastRow();
    const upperY: number = configSheet.getLastColumn();
    const configRange: GoogleAppsScript.Spreadsheet.Range = configSheet.getRange(1, 1, upperX, upperY);
    const configData: any[][] = configRange.getValues();
    return configData;
}

function renderConfig(config: any[][]): void {
    const template: any = HtmlService.createTemplateFromFile('invoicing-cs');
    template.config = config;
    const html: any = template.evaluate().setWidth(400).setHeight(400);
    const ui: GoogleAppsScript.Base.Ui = SpreadsheetApp.getUi();
    ui.showModelessDialog(html, 'Invoicing Config');
}

function handleInvoice(invoice: Map<string, string | number>): void {
    const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = getSpreadsheet();
    const archiveSheet: GoogleAppsScript.Spreadsheet.Sheet = ss.getSheetByName('Invoices') as GoogleAppsScript.Spreadsheet.Sheet;
    const headers: Map<string, number> = getHeaders(archiveSheet);

}

function getHeaders(archiveSheet: GoogleAppsScript.Spreadsheet.Sheet): Map<string, number> {
    const headers: Map<string, number> = new Map();  
    const upperY: number = archiveSheet.getLastColumn();
    const headerRange: GoogleAppsScript.Spreadsheet.Range = archiveSheet.getRange(1, 1, 1, upperY);
    const headerData: string[] = headerRange.getValues()[0];
    for (const title of headerData) {
        const row: number = headerData.indexOf(title);
        headers.set(title, row);
    }
    return headers;
}


