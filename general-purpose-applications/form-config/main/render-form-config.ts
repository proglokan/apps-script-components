"use strict";
import { fetchSheet, sheetToMap, getSheetHeaders, getSheetValues, getUniqueIdentifier } from "../../../global/global";
import {
  type MappedSheet,
  type SheetHeaders,
  type SheetValues,
  type SheetRow,
  type InputConfigSetting,
  type GlobalConfigSettings,
} from "../../../global/definitions";

// * Get global config settings for the form
function getGlobalConfigSettings(formName: string, gcHeaders: SheetHeaders, gcSheetValues: SheetValues): GlobalConfigSettings {
  const gcSettings = [];
  for (let x = 0; x < gcSheetValues.length; ++x) {
    const row: SheetRow = gcSheetValues[x];
    const formNameHeaderIndex = gcHeaders.get("Form name");
    if (formNameHeaderIndex === undefined) throw new Error(`Header 'Form name' not found in global config sheet`);
    const formNameInSheetRow = row[formNameHeaderIndex];
    if (formNameInSheetRow !== formName) continue;
    gcSettings.push(row);
    break;
  }

  return gcSettings[0] as GlobalConfigSettings;
}

// * Get local config settings for each input in the local config sheet
function getLocalConfigSettings(mappedLocalConfigSheet: MappedSheet): InputConfigSetting[] {
  if (!mappedLocalConfigSheet.size) throw new Error(`No settings found in local config sheet`);
  const lcSettings: InputConfigSetting[] = [];
  const entriesIterator = mappedLocalConfigSheet.entries();
  const firstEntry = entriesIterator.next().value;
  for (let x = 0; x < firstEntry[1]!.length; ++x) lcSettings.push({ uniqueIdentifier: "" });
  for (const [attribute, settings] of mappedLocalConfigSheet) {
    for (let x = 0; x < settings.length; ++x) {
      const setting = settings[x];
      const inputConfig = lcSettings[x];
      inputConfig[attribute] = setting;
    }
  }

  for (let x = 0; x < lcSettings.length; ++x) lcSettings[x]["uniqueIdentifier"] = getUniqueIdentifier();

  return lcSettings;
}

// * Create an HTML output for the form & define scriptlets for local config settings and the target sheet
function createHtmlOutput(
  formName: string,
  targetSpreadsheet: string | null,
  targetSheet: number,
  lcSettings: InputConfigSetting[],
): GoogleAppsScript.HTML.HtmlOutput {
  const template = HtmlService.createTemplateFromFile("render-warehouse-form-cs");
  template.targetSpreadsheet = targetSpreadsheet;
  template.targetSheet = targetSheet;
  template.lcSettings = lcSettings;
  const htmlOutput: GoogleAppsScript.HTML.HtmlOutput = template.evaluate();
  htmlOutput.setTitle(`${new Date().toLocaleDateString()} - ${formName} Form`).setWidth(700).setHeight(800);

  return htmlOutput;
}

// * Render the HTML output based on the render type
function renderHtmlOutput(htmlOutput: GoogleAppsScript.HTML.HtmlOutput, formName: string, renderType: string): void {
  const ui: GoogleAppsScript.Base.Ui = SpreadsheetApp.getUi();
  switch (renderType) {
    case "Modeless dialog":
      ui.showModelessDialog(htmlOutput, formName);
      break;

    case "Modal dialog":
      ui.showModalDialog(htmlOutput, formName);
      break;

    case "Sidebar":
      ui.showSidebar(htmlOutput);
      break;
  }
}

// * Given a form name and global config ID, render a form based on local config settings
function configRenderedFormMain(formName: string, gcID: number) {
  const gcSheet: GoogleAppsScript.Spreadsheet.Sheet = fetchSheet(null, gcID);
  const gcHeaders: SheetHeaders = getSheetHeaders(gcSheet);
  const gcSheetValues: SheetValues = getSheetValues(gcSheet);
  const [lcName, targetSpreadsheet, lcID, targetSheet, renderType] = getGlobalConfigSettings(
    formName,
    gcHeaders,
    gcSheetValues,
  ) as GlobalConfigSettings;
  const lcSheet = fetchSheet(null, lcID);
  const mappedLocalConfigSheet: MappedSheet = sheetToMap(lcSheet);
  const lcSettings: InputConfigSetting[] = getLocalConfigSettings(mappedLocalConfigSheet);
  const htmlOutput: GoogleAppsScript.HTML.HtmlOutput = createHtmlOutput(lcName, targetSpreadsheet, targetSheet, lcSettings);
  renderHtmlOutput(htmlOutput, formName, renderType);
}

export { configRenderedFormMain };
