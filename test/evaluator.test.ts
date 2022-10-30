import {describe, test} from '@jest/globals';
import { evaluate } from "@/lib/evaluator"
import {SimpleContext} from "@/lib/types";
import pl from "nodejs-polars";

describe('evaluate', () => {
    test.each([
        ["Input", new Map([["Input", pl.DataFrame({"column":["value"]})]]), pl.DataFrame({"column":["value"]})],
        ["Input | take 1 | take 5", new Map([["Input", pl.DataFrame({"column":["value1", "value2", "value3"]})]]), pl.DataFrame({"column":["value1"]})],
    ])
    ('evaluate(%s,...)', (program: string, inputs: Map<string, pl.DataFrame>, expected: pl.DataFrame) => {
        let context = new SimpleContext(new Map(inputs));
        let actual = evaluate(program, context);
        expect(actual).toFrameStrictEqual(expected);
    });
});