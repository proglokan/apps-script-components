'use strict';
// @subroutine {Helper} Void → open the query purchase order sidebar
function queryPurchaseOrderMain(): void {
  const html: GoogleAppsScript.HTML.HtmlOutput = HtmlService.createHtmlOutputFromFile('query-purchase-order-cs').setTitle('Purchase Order Query');
  const ui: GoogleAppsScript.Base.Ui = SpreadsheetApp.getUi();
  ui.showSidebar(html);
}