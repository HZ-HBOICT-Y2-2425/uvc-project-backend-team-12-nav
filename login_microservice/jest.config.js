export default {
  transform: {
    "^.+\\.js$": "babel-jest", // Use babel-jest for JS files
  },
  testEnvironment: "node", // Set Node.js as the test environment
  extensionsToTreatAsEsm: [".js"], // Treat .js files as ESM
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Remove .js extension from imports
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"], // Match test files
};
