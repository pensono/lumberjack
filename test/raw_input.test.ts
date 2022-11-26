import {describe, test} from '@jest/globals'
import * as dfd from "danfojs"
import type {DocumentFormat} from "../src/lib/types";
import {toDataFrame} from "../src/lib/raw_input";

describe('raw_input', () => {
    test.each([
        [
`line1

line2
`, { kind: "log" }, new dfd.DataFrame({"line":["line1", "line2"]})],
    ])
    ('toDataFrame(%s,...)', (input: string, format: DocumentFormat, expected: dfd.DataFrame) => {
        let actual = toDataFrame({contents: input, format: format});
        expect(actual).toFrameStrictEqual(expected);
    });
});
