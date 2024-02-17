'use strict';
import { fetchSheet, Coordinates } from "../../../../global/global";

type Cipher = [string, Uint8Array, CryptoKey];
type Values = Values;

async function placehlder() {
  const [name, iv, key] = await getCipher();

  const data: Uint8Array = new TextEncoder().encode('string'); //?

  const encryptedData: ArrayBuffer = await encryptData(name, iv, key, data); //?
  const encryptedDataValue = new Uint8Array(encryptedData); //?
  const value = JSON.stringify(encryptedDataValue); //?
  const uint8array = new Uint8Array(encryptedDataValue); //?
  const encryptedDataValueBack = uint8array.buffer; //?

  const decryptedData: ArrayBuffer = await decryptData(name, iv, key, encryptedDataValueBack); //? 
  const decryptedText: string = new TextDecoder().decode(decryptedData); //?

  console.log('Decrypted text:', decryptedText);
};

placehlder();

async function getCipher(): Promise<Cipher> {
  const name = 'AES-GCM';
  const iv: Uint8Array = new Uint8Array(12);
  const key: CryptoKey = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  return [name, iv, key];
}

async function encryptData(name: string, iv: Uint8Array, key: CryptoKey, data: ArrayBuffer,): Promise<ArrayBuffer> {
  return crypto.subtle.encrypt({ name, iv }, key, data);
}

async function decryptData(name: string, iv: Uint8Array, key: CryptoKey, encryptedData: ArrayBuffer,): Promise<ArrayBuffer> {
  return crypto.subtle.decrypt({ name, iv }, key, encryptedData);
}

function getCoordinates(values: Values, sheet: GoogleAppsScript.Spreadsheet.Sheet): Coordinates<number[]> { // TODO: replace global getCoordinates
  const row = sheet.getLastRow() + 1;
  const column = 1;
  const rows = values.length;
  const columns = values[0].length;
  return [row, column, rows, columns];
}

function postCredentials(sheet: GoogleAppsScript.Spreadsheet.Sheet, coordinates: Coordinates<number[]>, values: Values): void {
  const [row, column, rows, columns] = coordinates;
  const range = sheet.getRange(row, column, rows, columns);
  range.setValues(values);
}

async function handleCredentialsMain(loginIdentifier: string, password: string, targetSheet: number) {
  const data: Uint8Array = new TextEncoder().encode(password);
  const [name, iv, key] = await getCipher();
  const encryptedData: ArrayBuffer = await encryptData(name, iv, key, data);
  const byteArray = new Uint8Array(encryptedData);
  const encryptedPassword = JSON.stringify(byteArray);
  const values = [[loginIdentifier, encryptedPassword]];
  const sheet = fetchSheet(null, targetSheet);
  const coordinates: Coordinates<number[]> = getCoordinates(values, sheet);
  postCredentials(sheet, coordinates, values);
}

// TODO: write function to decrypt password from the stringified Uint8Array from the sheet