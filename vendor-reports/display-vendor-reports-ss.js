'use strict';
// [+] REFERENCE FOR COMPILED FILE
// interface FrontendEntry {
//   date: string | Date;
//   data: string[] | string;
//   active: boolean;
// }
// @subroutine {Function} Pure: FrontendEntry[] → deconstruct the data from the middleware workbook into a frontend-friendly format
function deconstructData(constructedData) {
    const frontendData = [];
    for (let x = 1; x < constructedData.length; ++x) {
        const cell = constructedData[x][0];
        if (cell === 'Vendor Reports')
            continue;
        const [date, rawData] = constructedData[x][0].split('→');
        const data = JSON.parse(rawData);
        const active = !!data.length;
        const row = x;
        const frontendEntry = { date, data, active, row };
        frontendData.push(frontendEntry);
    }
    return frontendData;
}
// @subroutine {Procedure} Void → display the vendor reports in a modeless dialog
// @arg {FrontendEntry[]} frontendData → the data that makes up the accordions' table data
function renderUI(frontendData) {
    const template = HtmlService.createTemplateFromFile('display-vendor-reports-cs');
    template.frontendData = frontendData;
    const html = template.evaluate().setWidth(1000).setHeight(1200);
    const ui = SpreadsheetApp.getUi();
    ui.showModelessDialog(html, 'Vendor Reports');
}
// @subroutine {Procedure} Void → get the vendor reports from the middleware workbook and display them in a modeless dialog
function displayVendorReports() {
    const middlewareSheet = getMiddlewareSheet();
    const data = middlewareSheet.getDataRange().getValues();
    const deconstructedData = deconstructData(data);
    renderUI(deconstructedData);
}
//# sourceMappingURL=display-vendor-reports-ss.js.map