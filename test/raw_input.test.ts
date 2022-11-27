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
        [
`number,string
3,wow
5,lol
`, { kind: "csv" }, new dfd.DataFrame({"number":[3,5],"string":["wow", "lol"]})],
//         [
//             `time,number,string
// 2018-03-31T14:40:28.000,3,wow
// 2018-03-31T14:40:28.000,5,lol
// `, { kind: "csv" }, new dfd.DataFrame({
//             "time":[Date.UTC(2018,3,14,14,40,28), Date.UTC(2018,3,14,14,40,28)],
//             "number":[3,5],
//             "string":["wow", "lol"]}
//         )],
//     ])
    ])
    ('toDataFrame(%s,...)', (input: string, format: DocumentFormat, expected: dfd.DataFrame) => {
        let actual = toDataFrame({contents: input, format: format});
        expect(actual).toFrameStrictEqual(expected);
    });
});
