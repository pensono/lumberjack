import * as nearley from "nearley"
import pl from "nodejs-polars";
import { LumberjackContext } from "@/lib/types"
import {default as kusto_grammar} from "@/lib/kusto";
import {Query, Operator, Expression} from "@/lib/syntax";


export function evaluate(program: string, context: LumberjackContext) : pl.DataFrame {
    const parser = new nearley.Parser(kusto_grammar)

    parser.feed(program);
    let query: Query = parser.results[0];

    var result = context.getTable(query.input.name);
    for (let operator of query.operators) {
        result = performOperator(operator, result, context);
    }

    return result;
}

function performOperator(operator: Operator, input: pl.DataFrame, context: LumberjackContext) : pl.DataFrame {
    switch (operator.kind) {
        case "take": { return take(input, operator.rows); }
        case "where": { return where(input, operator.predicate); }
        case "extend": { return extend(input, operator.columnName, operator.value); }
    }
}

function take(input: pl.DataFrame, rows: number) : pl.DataFrame {
    return input.limit(rows);
}

function where(input: pl.DataFrame, predicate: Expression) : pl.DataFrame {
    return input.where(toPolarsExpression(predicate));
}

function extend(input: pl.DataFrame, columnName: string, expression: Expression) : pl.DataFrame {
    return input.withColumn(toPolarsExpression(expression).alias(columnName));
}

function toPolarsExpression(expression: Expression) : pl.Expr {
    switch (expression.kind) {
        case "literal": return pl.lit(expression.value);
        case "columnIdentifier": return pl.col(expression.name);
        case "equals": return toPolarsExpression(expression.left).eq(toPolarsExpression(expression.right));
        case "lessThan": return toPolarsExpression(expression.left).lessThan(toPolarsExpression(expression.right));
        case "add": return toPolarsExpression(expression.left).plus(toPolarsExpression(expression.right));
        case "multiply": return toPolarsExpression(expression.left).mul(toPolarsExpression(expression.right));
    }
}