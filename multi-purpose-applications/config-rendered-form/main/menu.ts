'use strict';
import { configRenderedFormMain } from './render-form-config';
SpreadsheetApp.getUi().createMenu('Forms')
  .addItem('Warehouse', 'renderWarehouseForm')
  .addToUi();

function renderWarehouseForm() {
  const form = 'Warehouse';
  const gcID = 132112722;
  configRenderedFormMain(form, gcID);
}