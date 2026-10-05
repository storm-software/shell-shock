import { envSchema } from "../env";

const requiredBuildEnv = {
  APP_NAME: "example",
  BUILD_ID: "build",
  BUILD_TIMESTAMP: "2026-10-05T00:00:00Z",
  BUILD_CHECKSUM: "checksum",
  RELEASE_ID: "release",
  RELEASE_TAG: "example@1.0.0",
  ORGANIZATION: "example",
  DEBUG: false,
  TEST: false,
  FORCE_COLOR: false,
  STACKTRACE: false
};

describe("Shell Shock environment defaults", () => {
  it("accepts an unset optional runtime environment", () => {
    const result = envSchema.parse(requiredBuildEnv);

    expect(result).toMatchObject({
      MINIMAL: false,
      NO_COLOR: false,
      FORCE_HYPERLINK: false,
      INCLUDE_ERROR_DATA: false,
      CI: false
    });
  });

  it("preserves explicitly enabled runtime flags", () => {
    const result = envSchema.parse({
      ...requiredBuildEnv,
      MINIMAL: true,
      NO_COLOR: true,
      FORCE_HYPERLINK: 2,
      INCLUDE_ERROR_DATA: true,
      CI: true
    });

    expect(result).toMatchObject({
      MINIMAL: true,
      NO_COLOR: true,
      FORCE_HYPERLINK: 2,
      INCLUDE_ERROR_DATA: true,
      CI: true
    });
  });

  it("keeps the base schema metadata used by env generation", () => {
    expect(envSchema.shape.CI.meta()).toMatchObject({
      alias: ["CONTINUOUS_INTEGRATION"],
      category: "neutral",
      defaultValue: false
    });
    expect(envSchema.shape.NO_COLOR.meta()).toMatchObject({
      category: "node",
      defaultValue: false
    });
  });
});
