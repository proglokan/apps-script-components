function asinQueryMain() {
  const html: GoogleAppsScript.HTML.HtmlOutput = HtmlService.createHtmlOutputFromFile('asin-query-cs').setTitle('ASIN Query');
  const ui: GoogleAppsScript.Base.Ui = SpreadsheetApp.getUi();
  ui.showSidebar(html);
}