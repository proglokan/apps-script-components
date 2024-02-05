'use strict';
// @subroutine {Helper} Void → open the query purchase order sidebar
function initControlsMain(): void {
  const html: GoogleAppsScript.HTML.HtmlOutput = HtmlService.createHtmlOutputFromFile('init-controls-cs').setTitle('Purchase Order Query');
  const ui: GoogleAppsScript.Base.Ui = SpreadsheetApp.getUi();
  ui.showSidebar(html);
}