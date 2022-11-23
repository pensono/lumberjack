import * as dfd from "danfojs"

export type DocumentFormat = CsvFormat | LogFormat;

export interface CsvFormat {
    kind: "csv",
    delimiter: string,
}

export interface LogFormat {
    kind: "log",
}

export function toDataFrame(input: string, format: DocumentFormat) : dfd.DataFrame {
    let lines = input.split(/\r?\n|\r|\n/g);
    return new dfd.DataFrame({lines: lines});
}