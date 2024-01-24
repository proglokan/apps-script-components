'use strict';
// @subroutine {Helper} Void → open the query purchase order sidebar
function initControlsMain() {
    const html = HtmlService.createHtmlOutputFromFile('init-controls-cs').setTitle('Purchase Order Query');
    const ui = SpreadsheetApp.getUi();
    ui.showSidebar(html);
}
//# sourceMappingURL=init-controls-ss.js.map