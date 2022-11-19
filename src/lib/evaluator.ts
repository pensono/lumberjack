import * as nearley from "nearley"
import type * as dfd from "danfojs"
import {Series} from "danfojs";
import type { LumberjackContext } from "@/lib/types"
import type {Query, Operator, Expression} from "@/lib/syntax"
import kusto_grammar from "@/lib/kusto"
import * as _ from 'lodash'


export interface KustoSyntaxError {
    kind: "syntaxError";
    line: number;
    column: number;
    length: number;
}

export interface KustoEvaluationError {
    kind: "evaluationError";
    message: string;
}

export interface EvaluationResult {
    kind: "evaluationResult";
    result: dfd.DataFrame;
}

export function evaluate(program: string, context: LumberjackContext) : EvaluationResult | KustoSyntaxError | KustoEvaluationError {
    const parser = new nearley.Parser(kusto_grammar)

    try {
        parser.feed(program);
    } catch (parseError: any) {
        return {
            kind: "syntaxError",
            line: parseError.token.line,
            column: parseError.token.col,
            length: parseError.token.text.length
        }
    }

    if (parser.results.length != 1) {
        // Either an ambiguous parse (bug!) or more input is needed
        return {
            kind: "syntaxError",
            line: parser.lexerState?.line ?? 0,
            column: parser.lexerState?.col ?? 0,
            length: 0
        }
    }

    let query: Query = parser.results[0];

    let result = context.getTable(query.input.name);
    if (result === undefined) {
        return {
            kind: "evaluationError",
            message: `Cannot find table ${query.input.name}`
        };
    }

    for (let operator of query.operators) {
        result = performOperator(operator, result, context);
    }

    return {
        kind: "evaluationResult",
        result: result,
    };
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
        case "literal": return new Series(new Array(input.shape[0]).fill(expression.value)); // Would be nice to do this without creating a giant array
        case "columnIdentifier": return input[expression.name];
        case "equals": return evaluateExpression(input, expression.left).eq(evaluateExpression(input, expression.right));
        case "lessThan": return evaluateExpression(input, expression.left).lt(evaluateExpression(input, expression.right));
        case "add": return evaluateExpression(input, expression.left).add(evaluateExpression(input, expression.right));
        case "multiply": return evaluateExpression(input, expression.left).mul(evaluateExpression(input, expression.right));
        case "contains": {
            let op;
            if (expression.caseSensitive) {
                op = (r: any, l: any) => r.includes(l);
            } else {
                op = (r: any, l: any) => r.toUpperCase().includes(l.toUpperCase());
            }
            return binaryOperation(evaluateExpression(input, expression.left), (evaluateExpression(input, expression.right)), op);
        }
        case "extract": {
            let regex = new RegExp(expression.regex);
            return evaluateExpression(input, expression.source).map(data => regex.exec(data)?.at(expression.captureGroup));
        }
    }
}

function binaryOperation(lhs: dfd.Series, rhs: dfd.Series, operation: (l: any, r: any) => any) {
    // Based on https://github.com/javascriptdata/danfojs/blob/fe37f10c83265e22a645e9921e0d880b9b75a180/src/danfojs-base/core/math.ops.ts#L40
    return new Series(_.zip(lhs.values, rhs.values).map(([l, r]) => operation(l, r)));
}