// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var number_literal: any;
declare var string_literal: any;
declare var identifier: any;

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
        match: /"(?:[^\n\\"]|\\["\\ntbfr])*"|'(?:[^\n\\"]|\\["\\ntbfr])*'/,
        value: s => JSON.parse("\"" + s.slice(1,-1) + "\"")
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


interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "json", "symbols": ["_", "identifier", "_", "operator_list", "_"], "postprocess": 
        function(d) {
            let input = new syntax.TableLookup(d[1]);
            let operations = d[3];
            return new syntax.Query(input, operations);
        }
        },
    {"name": "operator_list$ebnf$1", "symbols": []},
    {"name": "operator_list$ebnf$1$subexpression$1", "symbols": [{"literal":"|"}, "_", "operator", "_"]},
    {"name": "operator_list$ebnf$1", "symbols": ["operator_list$ebnf$1", "operator_list$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "operator_list", "symbols": ["operator_list$ebnf$1"], "postprocess": 
        d => {
            let output = [];
        
            for (let i in d[0]) {
                output.push(d[0][i][2]);
            }
        
            return output;
        }
        },
    {"name": "operator", "symbols": [{"literal":"take"}, "__", (lexer.has("number_literal") ? {type: "number_literal"} : number_literal)], "postprocess": (d) => ({kind: "take", rows: d[2].value})},
    {"name": "operator", "symbols": [{"literal":"where"}, "__", "expression"], "postprocess": (d) => ({kind: "where", predicate: d[2]})},
    {"name": "operator", "symbols": [{"literal":"extend"}, "__", "identifier", "_", {"literal":"="}, "_", "expression"], "postprocess": (d) => ({kind: "extend", columnName: d[2], value: d[6]})},
    {"name": "operator", "symbols": [{"literal":"summarize"}, "__", "aggregation", "__", {"literal":"by"}, "__", "groupExpression"], "postprocess": (d) => ({kind: "summarize", aggregations: [d[2]], groups: d[6]})},
    {"name": "expression", "symbols": ["identifier"], "postprocess": (d) => ({kind: "columnIdentifier", name: d[0]})},
    {"name": "expression", "symbols": [(lexer.has("number_literal") ? {type: "number_literal"} : number_literal)], "postprocess": (d) => ({kind: "literal", value: d[0].value})},
    {"name": "expression", "symbols": [(lexer.has("string_literal") ? {type: "string_literal"} : string_literal)], "postprocess": (d) => ({kind: "literal", value: d[0].value})},
    {"name": "expression", "symbols": ["expression", "_", {"literal":"=="}, "_", "expression"], "postprocess": (d) => ({kind: "equals", left: d[0], right: d[4]})},
    {"name": "expression", "symbols": ["expression", "_", {"literal":"<"}, "_", "expression"], "postprocess": (d) => ({kind: "lessThan", left: d[0], right: d[4]})},
    {"name": "expression", "symbols": ["expression", "_", {"literal":"+"}, "_", "expression"], "postprocess": (d) => ({kind: "add", left: d[0], right: d[4]})},
    {"name": "expression", "symbols": ["expression", "_", {"literal":"*"}, "_", "expression"], "postprocess": (d) => ({kind: "multiply", left: d[0], right: d[4]})},
    {"name": "expression", "symbols": ["expression", "_", {"literal":"contains"}, "_", "expression"], "postprocess": (d) => ({kind: "contains", left: d[0], right: d[4], caseSensitive: false})},
    {"name": "expression", "symbols": ["expression", "_", {"literal":"contains_cs"}, "_", "expression"], "postprocess": (d) => ({kind: "contains", left: d[0], right: d[4], caseSensitive: true})},
    {"name": "expression", "symbols": [{"literal":"extract"}, "_", {"literal":"("}, "_", (lexer.has("string_literal") ? {type: "string_literal"} : string_literal), "_", {"literal":","}, "_", (lexer.has("number_literal") ? {type: "number_literal"} : number_literal), "_", {"literal":","}, "_", "expression", "_", {"literal":")"}], "postprocess": (d) => ({kind: "extract", regex: d[4].value, captureGroup: d[8].value, source: d[12]})},
    {"name": "aggregation", "symbols": [{"literal":"sum"}, {"literal":"("}, "_", "identifier", "_", {"literal":")"}], "postprocess": d => ({kind: "sum", overColumn: d[3] })},
    {"name": "groupExpression", "symbols": ["identifier"]},
    {"name": "identifier", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": d => d[0].text},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": ["_", /[\s]/], "postprocess": function() {}},
    {"name": "__", "symbols": [/[\s]/]},
    {"name": "__", "symbols": ["__", /[\s]/], "postprocess": function() {}}
  ],
  ParserStart: "json",
};

export default grammar;
