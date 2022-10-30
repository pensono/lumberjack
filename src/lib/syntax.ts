
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

export class Query {
    input: TableLookup;
    operators: Operator[];

    constructor(input: TableLookup, operators: Operator[]) {
        this.input = input;
        this.operators = operators;
    }
}
