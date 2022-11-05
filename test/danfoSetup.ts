import * as dfd from "danfojs"
import _ from "lodash";

expect.extend({
    toFrameStrictEqual(actual: dfd.DataFrame, expected: dfd.DataFrame) {
        const frameEq = _.isEqual(actual.values, expected.values);
        const dtypesEq = this.equals(actual.dtypes, expected.dtypes);
        if(frameEq && dtypesEq) {
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
