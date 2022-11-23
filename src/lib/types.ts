import type * as dfd from "danfojs"

export type LumberjackContext = Record<string, dfd.DataFrame>;

export type DocumentFormat = CsvFormat | LogFormat;

export interface CsvFormat {
    kind: "csv",
    delimiter: string,
}

export interface LogFormat {
    kind: "log",
}

export interface LumberjackDocument {
    contents: string;
    format: DocumentFormat;
}

export interface LumberjackSession {
    documents: Record<string, LumberjackDocument>;
    query: string;
}