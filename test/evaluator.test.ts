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
        ["Input | extend double = column * 2", new Map([["Input", new dfd.DataFrame({"column":[1,2,3,4,5]})]]), new dfd.DataFrame({"column":[1,2,3,4,5],"double":[2,4,6,8,10]})],
        ["Input | extend value = extract(\"value=(\\\\d+)\", 1, column)", new Map([["Input", new dfd.DataFrame({"column":["value=4","value=5"]})]]), new dfd.DataFrame({"column":["value=4","value=5"],"value":["4","5"]})],
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