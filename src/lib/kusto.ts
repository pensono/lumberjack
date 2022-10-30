// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var number_literal: any;
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
    {"name": "operator", "symbols": [{"literal":"take"}, "__", (lexer.has("number_literal") ? {type: "number_literal"} : number_literal)], "postprocess": (d) => new syntax.Operator("take", {rows: d[2].value})},
    {"name": "identifier", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": d => d[0].text},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": ["_", /[\s]/], "postprocess": function() {}},
    {"name": "__", "symbols": [/[\s]/]},
    {"name": "__", "symbols": ["__", /[\s]/], "postprocess": function() {}}
  ],
  ParserStart: "json",
};

export default grammar;
