'use strict';
import { fetchSheet } from '../../../global/global';

// @subroutine {Procedure} Void → add menu items to the Forms menu
// @arg {GoogleAppsScript.Base.Menu} formsMenu → the Forms menu
// @arg {SheetValues} configData → the configuration data
function addMenuItems(formsMenu: GoogleAppsScript.Base.Menu, configData: string[][]) {
  for (let x = 1; x < configData.length; ++x) {
    const row = configData[x];
    const formName = row[0];
    formsMenu.addItem(`${formName} Form`, `${formName.toLowerCase()}Form`);
  }
}

// @subroutine {Procedure} Void → render the forms menu based on the global config sheet
function renderFormsMenu(ui: GoogleAppsScript.Base.Ui) {
  const gcid = 0;
  const formsMenu = ui.createMenu('Forms');
  const gcSheet = fetchSheet(null, gcid);
  const configData = gcSheet.getDataRange().getValues();
  addMenuItems(formsMenu, configData);
  formsMenu.addToUi();
}