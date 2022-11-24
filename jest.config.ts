/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  moduleNameMapper: {
    "^@/(.*)": "<rootDir>/src/$1"
  },
  setupFilesAfterEnv : ["<rootDir>/test/danfoSetup.ts"],
  testPathIgnorePatterns: ["<rootDir>/test/danfoSetup.ts"],
  reporters: ['jest-junit']
};
