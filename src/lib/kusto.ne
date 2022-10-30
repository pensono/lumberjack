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

operator ->
    "take" __ %number_literal {% (d) => new syntax.Operator("take", {rows: d[2].value}) %}

identifier -> %identifier {% d => d[0].text %}

# Whitespace
_ -> null | _ [\s] {% function() {} %}
__ -> [\s] | __ [\s] {% function() {} %}
