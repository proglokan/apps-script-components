"use strict";
import { configRenderedFormMain } from "./render-form-config";

SpreadsheetApp.getUi().createMenu("Forms").addItem("Warehouse", "renderWarehouseForm").addToUi();

// * Return the global configuration ID
const globalConfigID = (): number => {
  return 132112722;
};

// * Define the form name and global configuration ID at author time and pass it to the respective helper function
const renderWarehouseForm = () => {
  const form = "Warehouse";
  const gcID = globalConfigID();
  configRenderedFormMain(form, gcID);
};
