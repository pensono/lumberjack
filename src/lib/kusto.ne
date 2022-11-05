@preprocessor typescript

@{%
import * as moo from "moo"
import * as syntax from "./syntax"

const lexer = moo.compile({
    ws: /[ \t]+/,
    nl: { match: "\n", lineBreaks: true },
    pipe: "|",
    lte: "<=",
    lt: "<",
    gte: ">=",
    gt: ">",
    eq: "==",
    lparan: "(",
    rparan: ")",
    comma: ",",
    lbracket: "[",
    rbracket: "]",
    lbrace: "{",
    rbrace: "}",
    assignment: "=",
    plus: "+",
    minus: "-",
    multiply: "*",
    divide: "/",
    modulo: "%",
    colon: ":",
    comment: {
        match: /#[^\n]*/,
        value: s => s.substring(1)
    },
    string_literal: {
        match: /"(?:[^\n\\"]|\\["\\ntbfr])*"/,
        value: s => JSON.parse(s)
    },
    number_literal: {
        match: /[0-9]+(?:\.[0-9]+)?/,
        value: s => Number(s)
    },
    identifier: {
        match: /[a-z_A-Z][a-zA-Z_0-9]*/,
        type: moo.keywords({
            in: "in",
            true: "true",
            false: "false"
        })
    }
});

%}

@lexer lexer

json -> _ identifier _ operator_list _ {%
    function(d) {
        let input = new syntax.TableLookup(d[1]);
        let operations = d[3];
        return new syntax.Query(input, operations);
    }
%}

operator_list -> ("|" _ operator _):* {%
    d => {
        let output = [];

        for (let i in d[0]) {
            output.push(d[0][i][2]);
        }

        return output;
    }
%}

operator
    -> "take" __ %number_literal {% (d) => new syntax.Operator("take", {rows: d[2].value}) %}
    | "where" __ expression {% (d) => new syntax.Operator("where", {predicate: d[2]}) %}
    | "extend" __ identifier _ "=" _ expression {% (d) => new syntax.Operator("extend", {columnName: d[2], expression: d[6]}) %}

expression
    -> identifier {% (d) => ({kind: "columnIdentifier", name: d[0]}) %}
    | %number_literal {% (d) => ({kind: "literal", value: d[0].value}) %}
    | expression _ "==" _ expression {% (d) => ({kind: "equals", left: d[0], right: d[4]}) %}
    | expression _ "<" _ expression {% (d) => ({kind: "lessThan", left: d[0], right: d[4]}) %}
    | expression _ "+" _ expression {% (d) => ({kind: "add", left: d[0], right: d[4]}) %}
    | expression _ "*" _ expression {% (d) => ({kind: "multiply", left: d[0], right: d[4]}) %}

identifier -> %identifier {% d => d[0].text %}

# Whitespace
_ -> null | _ [\s] {% function() {} %}
__ -> [\s] | __ [\s] {% function() {} %}
