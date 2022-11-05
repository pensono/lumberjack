
export class Query {
    input: TableLookup;
    operators: Operator[];

    constructor(input: TableLookup, operators: Operator[]) {
        this.input = input;
        this.operators = operators;
    }
}

export class TableLookup {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export type Operator =
    Take
    | Where
    | Extend;

export interface Take {
    kind: "take";
    rows: number;
}

export interface Where {
    kind: "where";
    predicate: Expression;
}

export interface Extend {
    kind: "extend";
    columnName: string;
    value: Expression;
}

export type Expression = Literal | ColumnName | BinaryExpression

export interface Literal {
    kind: "literal";
    value: any;
}

export interface ColumnName {
    kind: "columnIdentifier";
    name: string;
}

export interface BinaryExpression {
    kind: "equals" | "lessThan" | "add" | "multiply";
    left: Expression;
    right: Expression;
}