import * as dfd from "danfojs"
import _ from "lodash";

expect.extend({
    toFrameStrictEqual(actual: dfd.DataFrame, expected: dfd.DataFrame) {
        expect(actual.columns).toStrictEqual(expected.columns);
        expect(actual.dtypes).toStrictEqual(expected.dtypes);

        const frameEq = _.isEqual(actual.values, expected.values);
        if(frameEq) {
            return {
                message: () => "dataframes match",
                pass: true
            };
        } else {
            return {
                message: () => `
Expected: 
${expected} 
Actual:
${actual}`,
                pass: false
            };
        }
    },
});
