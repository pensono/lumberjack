import {describe, test} from '@jest/globals'
import {evaluate, KustoSyntaxError, KustoEvaluationError, EvaluationResult} from "../src/lib/evaluator";
import {SimpleContext} from "@/lib/types"
import * as dfd from "danfojs"

describe('evaluate successes', () => {
    test.each([
        ["Input", new Map([["Input", new dfd.DataFrame({"column":["value"]})]]), new dfd.DataFrame({"column":["value"]})],
        ["Input | take 1 | take 5", new Map([["Input", new dfd.DataFrame({"column":["value1", "value2", "value3"]})]]), new dfd.DataFrame({"column":["value1"]})],
        ["Input | where column == 3", new Map([["Input", new dfd.DataFrame({"column":[1,2,3,4,5]})]]), new dfd.DataFrame({"column":[3]})],
        ["Input | where column < 3", new Map([["Input", new dfd.DataFrame({"column":[1,2,3,4,5]})]]), new dfd.DataFrame({"column":[1,2]})],
        ["Input | extend constant = 2", new Map([["Input", new dfd.DataFrame({"column":[1,2,3,4,5]})]]), new dfd.DataFrame({"column":[1,2,3,4,5],"constant":[2,2,2,2,2]})],
        ["Input | extend double = column * 2", new Map([["Input", new dfd.DataFrame({"column":[1,2,3,4,5]})]]), new dfd.DataFrame({"column":[1,2,3,4,5],"double":[2,4,6,8,10]})],
        ["Input | extend value = extract(\"value=(\\\\d+)\", 1, column)", new Map([["Input", new dfd.DataFrame({"column":["value=4","value=5"]})]]), new dfd.DataFrame({"column":["value=4","value=5"],"value":["4","5"]})],
        ["Input | extend a = 1 | extend b = 2", new Map([["Input", new dfd.DataFrame({"column":["value1"]})]]), new dfd.DataFrame({"column":["value1"],"a":[1],"b":[2]})],
        ["Input | extend str = \"wow\" | extend str2 = 'lol'", new Map([["Input", new dfd.DataFrame({"column":["value1"]})]]), new dfd.DataFrame({"column":["value1"],"str":["wow"],"str2":["lol"]})],
        ["Input | where value contains_cs \"abc\"", new Map([["Input", new dfd.DataFrame({"value":["abc", "bcd", "aBc"]})]]), new dfd.DataFrame({"value":["abc"]})],
        ["Input | where value contains \"aBc\"", new Map([["Input", new dfd.DataFrame({"value":["abc", "bcd", "aBc"]})]]), new dfd.DataFrame({"value":["abc", "aBc"]})],
        ["Input | where value contains substr", new Map([["Input", new dfd.DataFrame({"value":["abc", "bcd", "aBc"], "substr":["a", "abc", "abc"]})]]), new dfd.DataFrame({"value":["abc", "aBc"], "substr":["a", "abc"]})],
        ["Input | summarize sum(v) by a", new Map([["Input", new dfd.DataFrame({"a":["a", "b", "a"], "v":[1, 2, 3]})]]), new dfd.DataFrame({"a":["a", "b"], "sum_v":[4, 2]})],
    ])
    ('evaluate(%s,...)', (program: string, inputs: Map<string, dfd.DataFrame>, expected: dfd.DataFrame) => {
        let context = new SimpleContext(inputs);
        let actual = evaluate(program, context) as EvaluationResult;
        expect(actual.result).toFrameStrictEqual(expected);
    });
});

describe('evaluate syntax errors', () => {
    test.each([
        ["Input | tak", {kind: "syntaxError", column: 9, line: 1, length: 3}],
        ["Input | take", {kind: "syntaxError", column: 13, line: 1, length: 0}],
        ["", {kind: "syntaxError", column: 0, line: 0, length: 0}],
    ])
    ('evaluate(%s,...)', (program: string, expected: KustoSyntaxError) => {
        let context = new SimpleContext(new Map());
        let actual = evaluate(program, context);
        expect(actual).toEqual(expected);
    });
});

describe('evaluate evaluation errors', () => {
    test.each([
        ["TableThatDoesNotExist", {kind: "evaluationError", message: "Cannot find table TableThatDoesNotExist"}],
    ])
    ('evaluate(%s,...)', (program: string, expected: KustoEvaluationError) => {
        let context = new SimpleContext(new Map());
        let actual = evaluate(program, context);
        expect(actual).toEqual(expected);
    });
});