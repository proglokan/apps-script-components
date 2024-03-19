export type SheetHeaders = Map<string, number>
export type SheetValues = string[][]
export type SheetRow = SheetValues[number]
export type SheetCoordinates<T extends number[]> = T & { length: 4 }
export type MappedSheet = Map<string, string[]>
