
export class TableLookup {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export class Query {
    input: TableLookup;


    constructor(input: TableLookup) {
        this.input = input;
    }
}
