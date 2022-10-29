import {zip} from "lodash";

export interface Table {
    rows: Array<Map<String, Object>>;
}

export function mkTable(columnNames: String[], values: Object[][]) : Table {
    let rows = values.map(row => new Map(zip(columnNames, row)));
    return { rows: rows };
}

export interface LumberjackContext {
    getTable(name: string): Table
}

export class SimpleContext implements LumberjackContext {
    tables: Map<String, Table>;

    constructor(tables: Map<String, Table>) {
        this.tables = tables;
    }

    getTable(name: string): Table {
        return this.tables.get(name)!;
    }
}