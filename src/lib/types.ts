import type * as dfd from "danfojs"

export type LumberjackContext = Record<string, LumberjackTable>;

export type DocumentFormat = CsvFormat | LogFormat;

export interface CsvFormat {
    kind: "csv",
    delimiter: string,
}

export interface LogFormat {
    kind: "log",
}

export interface LumberjackTable {
    data: dfd.DataFrame,
    schema: KustoSchema,
}

export interface LumberjackDocument {
    contents: string;
    format: DocumentFormat;
}

// Can theoretically be saved/loaded to share with others
export interface LumberjackSession {
    documents: Record<string, LumberjackDocument>;
    query: string;
}

export interface KustoSchema {
    columns: ColumnSchema[]
}

export interface ColumnSchema {
    name: string,
    type: KustoType
}

// https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/scalar-data-types/
export type KustoType =
    "bool"
    | "string"
    | "datetime"
    | "dynamic"
    | "guid"
    | "int"
    | "long"
    | "real"
    | "timespan"
    | "decimal"