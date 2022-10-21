

export type Table = {
    rows: Array<Map<String, String>>;
};

export interface LumberjackContext {
    getTable(name: string): Table
}