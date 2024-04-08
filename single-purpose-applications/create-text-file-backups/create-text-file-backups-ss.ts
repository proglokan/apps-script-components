import { fetchSheet, newError } from "../../global/global";
import { type SheetValues, type SheetRow, SheetHeaders } from "../../global/definitions";

const convertValuesToStrings = (values: SheetValues) => {
  for (let x = 0; x < values.length; x++) {
    for (let y = 0; y < values[x].length; y++) {
      values[x][y] = String(values[x][y]);
    }
  }
}

interface BinaryFormatSchema {
  fields: { name: string, type: string }[];
}

const getSchema = (keys: string[]) => {
  const schema: BinaryFormatSchema = {
    fields: []
  };
  for (const key of keys) {
    schema.fields.push({ name: key, type: 'string' });
  }
  return schema;
}

const sheetToListOfObjectLiterals = (keys: string[], values: SheetValues) => {
  const listOfObjectLiterals = [];
  for (let x = 0; x < values.length; x++) {
    const row: SheetRow = values[x];
    const obj: Record<string, string> = {};
    obj.id = `${x}`;
    for (let y = 0; y < row.length; y++) {
      const key = keys[y];
      const value = row[y];
      obj[key] = value;
    }
    listOfObjectLiterals.push(obj);
  }
  return listOfObjectLiterals;
}

const encodeData = (data: Record<string, string>[], schema: BinaryFormatSchema) => {
  const bytes = 12;
  const buffer = new ArrayBuffer(data.length * bytes);
  const view = new DataView(buffer);
  let offset = 0;
  for (const datum of data) {
    view.setInt32(offset, Number(datum.id));
    offset += bytes;
  }
  return buffer;
}

const decodeData = (buffer: ArrayBuffer, schema: BinaryFormatSchema) => {
  const view = new DataView(buffer);
  const data = [];
  const bytes = 12;
  for (let offset = 0; offset < buffer.byteLength; offset += bytes) {
    const id = view.getInt32(offset);
    const datum = { id: String(id) };
    data.push(datum);
  }
  return data;
}

const createTextFileBackups = () => {
  const sheet = fetchSheet(null, 1844782191);
  const values = sheet.getDataRange().getValues();
  convertValuesToStrings(values);
  const keys = values.shift();
  if (keys === undefined) return newError('createTextFileBackups', 'No keys found in sheet');
  const schema: BinaryFormatSchema = getSchema(keys);
  const data = sheetToListOfObjectLiterals(keys, values);
  const encodedData = encodeData(data, schema);
  const fileData = JSON.stringify(data, null, 2);
  const date = Utilities.formatDate(new Date(), 'PST', 'dd MMM yyyy');
  const hour = new Date().getHours();
  const fileName = `${date} Backup ${hour}`;
  const fileType = 'text/plain';
  const textFileBlob = Utilities.newBlob(fileData, fileType, fileName);
  const compressedBlob = Utilities.gzip(textFileBlob, fileName);
  const file = DriveApp.createFile(textFileBlob);
  Logger.log(file.getUrl());
};

