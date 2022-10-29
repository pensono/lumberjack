import * as nearley from "nearley"
import {LumberjackContext, mkTable, Table} from "./types"
import * as kusto_grammar from "./kusto";
import {Query} from "@/lib/syntax";

const parser = new nearley.Parser(kusto_grammar.default)

export function evaluate(program: string, context: LumberjackContext) : Table {
    parser.feed(program);
    let query: Query = parser.results[0];

    var result = context.getTable(query.input.name);

    return result;
}