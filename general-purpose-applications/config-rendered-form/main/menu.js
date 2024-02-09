'use strict';
import { configRenderedFormMain } from './render-form-config';
SpreadsheetApp.getUi().createMenu('Forms')
    .addItem('Warehouse', 'renderWarehouseForm')
    .addToUi();
// @subroutine {Function} Pure: number → return the global configuration ID
function globalConfigID() {
    return 132112722;
}
// @subroutine {Procedure} Void → define the form name and global configuration ID at author time and pass it to the respective helper function
function renderWarehouseForm() {
    const form = 'Warehouse';
    const gcID = globalConfigID();
    configRenderedFormMain(form, gcID);
}
//# sourceMappingURL=menu.js.map