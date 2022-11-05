import * as nearley from "nearley"
import * as dfd from "danfojs"
import { LumberjackContext } from "@/lib/types"
import {Query, Operator, Expression} from "@/lib/syntax"
import kusto_grammar from "@/lib/kusto"
import RE2 from "re2"


export function evaluate(program: string, context: LumberjackContext) : dfd.DataFrame {
    const parser = new nearley.Parser(kusto_grammar)

    parser.feed(program);
    let query: Query = parser.results[0];

    var result = context.getTable(query.input.name);
    for (let operator of query.operators) {
        result = performOperator(operator, result, context);
    }

    return result;
}

function performOperator(operator: Operator, input: dfd.DataFrame, context: LumberjackContext) : dfd.DataFrame {
    switch (operator.kind) {
        case "take": { return take(input, operator.rows); }
        case "where": { return where(input, operator.predicate); }
        case "extend": { return extend(input, operator.columnName, operator.value); }
    }
}

function take(input: dfd.DataFrame, rows: number) : dfd.DataFrame {
    return input.head(rows);
}

function where(input: dfd.DataFrame, predicate: Expression) : dfd.DataFrame {
    return input.loc({rows: evaluateExpression(input, predicate)});
}

function extend(input: dfd.DataFrame, columnName: string, expression: Expression) : dfd.DataFrame {
    return input.addColumn(columnName, evaluateExpression(input, expression));
}

function evaluateExpression(input: dfd.DataFrame, expression: Expression): dfd.Series {
    switch (expression.kind) {
        case "literal": return expression.value;
        case "columnIdentifier": return input[expression.name];
        case "equals": return evaluateExpression(input, expression.left).eq(evaluateExpression(input, expression.right));
        case "lessThan": return evaluateExpression(input, expression.left).lt(evaluateExpression(input, expression.right));
        case "add": return evaluateExpression(input, expression.left).add(evaluateExpression(input, expression.right));
        case "multiply": return evaluateExpression(input, expression.left).mul(evaluateExpression(input, expression.right));
        case "extract": {
            let regex = new RE2(expression.regex);
            return evaluateExpression(input, expression.source).map(data => regex.exec(data)?.at(expression.captureGroup));
        }
    }
}