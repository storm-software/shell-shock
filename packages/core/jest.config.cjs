const { declarePackage } = require("@storm-software/testing-tools");
module.exports = {
  ...declarePackage({
    projectRoot: "packages/core",
    isNode: true,
    displayName: "@shell-shock/core"
  }),
  collectCoverage: false,
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      { tsconfig: "<rootDir>/tsconfig.spec.json", useESM: true }
    ]
  }
};
