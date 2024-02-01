'use strict';
import { fetchSheet, sheetToMap, MappedSheet, getHeaders, _Headers, getBody, Body, getUniqueIdentifier } from "../../global/global";

type InputConfigSetting = { [key: string]: string | boolean };

function getLocalConfigID(form: string, globalConfigHeaders: _Headers, globalConfigBody: Body): number {
  const formNameHeaderIndex = globalConfigHeaders.get('Form name');
  if (formNameHeaderIndex === undefined) throw new Error(`Header 'Form name' not found in global config sheet`);
  for (let x = 0; x < globalConfigBody.length; ++x) {
    const row = globalConfigBody[x];
    if (row[formNameHeaderIndex] !== form) continue;
    const localConfigIDHeaderIndex = globalConfigHeaders.get('Config Sheet');
    if (localConfigIDHeaderIndex === undefined) throw new Error(`Header 'Config Sheet' not found in global config sheet`);
    return +row[localConfigIDHeaderIndex];
  }
  throw new Error(`Form ${form} not found in global config sheet`);
}

function getGlobalConfigSettings(localConfigName: string, globalConfigHeaders: _Headers, globalConfigBody: Body): (string | number)[] {
  for (let x = 0; x < globalConfigBody.length; ++x) {
    const row = globalConfigBody[x];
    const formNameHeaderIndex = globalConfigHeaders.get('Form name');
    if (formNameHeaderIndex === undefined) throw new Error(`Header 'Form name' not found in global config sheet`);
    const formName = row[formNameHeaderIndex];
    if (formName !== localConfigName) continue;
    return row;
  }
  throw new Error(`Form name ${localConfigName} not found in global config sheet`);
}

function getLocalConfigSettings(mappedLocalConfigSheet: MappedSheet): InputConfigSetting[] {
  if (!mappedLocalConfigSheet.size) throw new Error(`No settings found in local config sheet`);
  const localConfigSettings: InputConfigSetting[] = [];
  const entriesIterator = mappedLocalConfigSheet.entries();
  const firstEntry = entriesIterator.next().value;
  for (let x = 0; x < firstEntry[1]!.length; ++x) localConfigSettings.push({ uniqueIdentifier: '' });
  for (const [attribute, settings] of mappedLocalConfigSheet) {
    for (let x = 0; x < settings.length; ++x) {
      const setting = settings[x];
      const inputConfig = localConfigSettings[x];
      inputConfig[attribute] = setting;
    }
  }
  for (let x = 0; x < localConfigSettings.length; ++x) localConfigSettings[x]['uniqueIdentifier'] = getUniqueIdentifier();
  return localConfigSettings;
}

function createHtmlOutput(formName: string, targetSpreadsheet: number | null, targetSheet: number, renderType: string, localConfigSettings: InputConfigSetting[]): GoogleAppsScript.HTML.HtmlOutput {
  const template = HtmlService.createTemplateFromFile('config-rendered-form-cs');
  template.targetSpreadsheet = targetSpreadsheet;
  template.targetSheet = targetSheet;
  template.localConfigSettings = localConfigSettings;
  const htmlOutput: GoogleAppsScript.HTML.HtmlOutput = template.evaluate();
  if (renderType !== 'Sidebar') htmlOutput.setTitle(formName);
  return htmlOutput;
}

function renderHtmlOutput(htmlOutput: GoogleAppsScript.HTML.HtmlOutput, formName: string, renderType: string): void {
  const ui: GoogleAppsScript.Base.Ui = SpreadsheetApp.getUi();
  switch (renderType) {
    case 'Modeless dialog':
      ui.showModelessDialog(htmlOutput, formName);
      break;
    case 'Modal dialog':
      ui.showModalDialog(htmlOutput, formName)
      break;
    case 'Sidebar':
      ui.showSidebar(htmlOutput);
      break;
  }
}

function configRenderedFormMain(form: string, globalConfigID: number) {
  const globalConfigSheet: GoogleAppsScript.Spreadsheet.Sheet = fetchSheet(null, globalConfigID);
  const globalConfigHeaders: _Headers = getHeaders(globalConfigSheet);
  const globalConfigBody: Body = getBody(globalConfigSheet);
  const localConfigID = getLocalConfigID(form, globalConfigHeaders, globalConfigBody);
  const localConfigSheet = fetchSheet(null, localConfigID);
  const localConfigSheetName = localConfigSheet.getSheetName();
  const mappedLocalConfigSheet: MappedSheet = sheetToMap(localConfigSheet);
  const localConfigName = localConfigSheetName.match(/(.+?) Form Config/)![1];
  const globalConfigSettings = getGlobalConfigSettings(localConfigName, globalConfigHeaders, globalConfigBody);
  const [formName, targetSpreadsheet, configSheet, targetSheet, renderType] = globalConfigSettings as [string, (number | null), number, number, string];
  const localConfigSettings: InputConfigSetting[] = getLocalConfigSettings(mappedLocalConfigSheet);
  const htmlOutput: GoogleAppsScript.HTML.HtmlOutput = createHtmlOutput(formName, targetSpreadsheet, targetSheet, renderType, localConfigSettings);
  renderHtmlOutput(htmlOutput, formName, renderType);
}

function renderForm(form: string) {
  switch (form) {
    case 'Warehouse':
      configRenderedFormMain(form, 132112722);
      break;
    default:
      throw new Error(`Form '${form}' not found`);
  }
}