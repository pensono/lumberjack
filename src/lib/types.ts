import type * as dfd from "danfojs"

export interface LumberjackContext {
    getTable(name: string): dfd.DataFrame | undefined
}

export class SimpleContext implements LumberjackContext {
    tables: Map<String, dfd.DataFrame>;

    constructor(tables: Map<String, dfd.DataFrame>) {
        this.tables = tables;
    }

    getTable(name: string): dfd.DataFrame | undefined {
        return this.tables.get(name);
    }
}