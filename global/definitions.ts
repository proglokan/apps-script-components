export type SheetHeaders = Map<string, number>;
export type SheetValues = string[][];
export type SheetRow = SheetValues[number];
export type SheetCoordinates<T extends number[]> = T & { length: 4 };
export type MappedSheet = Map<string, string[]>;

export type ClientQueryResponse = {
  coordinates: SheetCoordinates<number[]>;
  bodyJSON: string;
};

export type InputConfigSetting = { [key: string]: string | boolean };
export type GlobalConfigSettings = [string, string | null, number, number, string];

export type InputData = { [key: string]: string | boolean };

export type ComparativeAsins = {
  reference: string[];
  comparison: string[];
};
export type Data = [GoogleAppsScript.Spreadsheet.Sheet, SheetHeaders, SheetValues];
export type Coordinates<T extends number[]> = T & { length: 4 };
