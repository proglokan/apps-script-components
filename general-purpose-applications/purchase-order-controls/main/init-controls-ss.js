"use strict";
// * Open the query purchase order sidebar
const initControlsMain = () => {
    const html = HtmlService.createHtmlOutputFromFile("init-controls-cs").setTitle("Purchase Order Query");
    const ui = SpreadsheetApp.getUi();
    ui.showSidebar(html);
};
//# sourceMappingURL=init-controls-ss.js.map