"use strict";
function asinQueryMain() {
    const html = HtmlService.createHtmlOutputFromFile('asin-query-cs').setTitle('ASIN Query');
    const ui = SpreadsheetApp.getUi();
    ui.showSidebar(html);
}
//# sourceMappingURL=asin-query-ss.js.map