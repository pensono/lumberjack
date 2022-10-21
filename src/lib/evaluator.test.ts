import {describe, test} from '@jest/globals';
import { evaluate } from "./evaluator"

describe('evaluate', () => {
    test('basic parse', () => {
        evaluate("my program", null);
    });
});