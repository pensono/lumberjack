import * as nearley from "nearley"
import {LumberjackContext, Table} from "./types"
import * as kusto_grammar from "./kusto";
import {Query, Operator} from "@/lib/syntax";
import pl from "nodejs-polars";


export function evaluate(program: string, context: LumberjackContext) : pl.DataFrame {
    const parser = new nearley.Parser(kusto_grammar.default)

    parser.feed(program);
    let query: Query = parser.results[0];

    var result = context.getTable(query.input.name);
    for (let operator of query.operators) {
        result = performOperator(operator, result, context);
    }

    return result;
}

function performOperator(operator: Operator, input: Table, context: LumberjackContext) : pl.DataFrame {
    switch (operator.name) {
        case "take": { return take(input, operator.arguments.rows); }
        default: { throw new Error(`No implementation for operator ${operator.name}`)}
    }
}

function take(input: Table, rows: number) : pl.DataFrame {
    return input.limit(rows);
}