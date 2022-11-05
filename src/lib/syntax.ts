
export class TableLookup {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export class Operator {
    name: string;
    arguments: object;

    constructor(name: string, args: object) {
        this.name = name;
        this.arguments = args;
    }
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

export class Query {
    input: TableLookup;
    operators: Operator[];

    constructor(input: TableLookup, operators: Operator[]) {
        this.input = input;
        this.operators = operators;
    }
}
