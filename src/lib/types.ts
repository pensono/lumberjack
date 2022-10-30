import pl from "nodejs-polars";

export interface LumberjackContext {
    getTable(name: string): pl.DataFrame
}

export class SimpleContext implements LumberjackContext {
    tables: Map<String, pl.DataFrame>;

    constructor(tables: Map<String, pl.DataFrame>) {
        this.tables = tables;
    }

    getTable(name: string): pl.DataFrame {
        return this.tables.get(name)!;
    }
}