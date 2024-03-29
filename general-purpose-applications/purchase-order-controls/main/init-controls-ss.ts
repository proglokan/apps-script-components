"use strict";

// * Open the query purchase order sidebar
const initControlsMain = (): void => {
  const html: GoogleAppsScript.HTML.HtmlOutput = HtmlService.createHtmlOutputFromFile("init-controls-cs").setTitle("Purchase Order Query");
  const ui: GoogleAppsScript.Base.Ui = SpreadsheetApp.getUi();
  ui.showSidebar(html);
};
