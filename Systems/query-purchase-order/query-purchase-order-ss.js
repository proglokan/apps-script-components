'use strict';
// @subroutine {Helper} Void → open the query purchase order sidebar
function queryPurchaseOrderMain() {
    const html = HtmlService.createHtmlOutputFromFile('query-purchase-order-cs').setTitle('Purchase Order Query');
    const ui = SpreadsheetApp.getUi();
    ui.showSidebar(html);
}
//# sourceMappingURL=query-purchase-order-ss.js.map