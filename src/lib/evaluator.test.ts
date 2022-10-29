import {describe, test} from '@jest/globals';
import { evaluate } from "./evaluator"
import {mkTable, SimpleContext, Table} from "./types";

describe('evaluate', () => {
    test.each([
        ["Input", new Map([["Input", mkTable(["column"],[["value"]])]]), mkTable(["column"],[["value"]])],
    ])
    ('evaluate(%s,...)', (program: string, inputs: Map<string, Table>, expected: Table) => {
        let context = new SimpleContext(new Map(inputs));
        let actual = evaluate("Input", context);
        expect(actual).toEqual(expected);
    });
});