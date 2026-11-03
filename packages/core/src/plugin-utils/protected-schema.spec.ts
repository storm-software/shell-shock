import { commandTreeBaseSchema } from "../../../schema/src/schema/command-tree";

const input = {
  id: "private",
  name: "private",
  path: "private",
  segments: ["private"],
  title: "Private",
  description: "Private command",
  alias: [],
  tags: [],
  virtual: false,
  entry: { file: "command.ts" },
  options: {},
  args: []
};

describe("protected command tree schema", () => {
  it("preserves a protected flag during schema parsing", () => {
    expect(
      commandTreeBaseSchema.parse({ ...input, protected: true })
    ).toHaveProperty("protected", true);
  });

  it("rejects a non-boolean protected flag", () => {
    expect(
      commandTreeBaseSchema.safeParse({ ...input, protected: "true" }).success
    ).toBe(false);
  });

  it("keeps omitted protection compatible with public commands", () => {
    expect(commandTreeBaseSchema.parse(input).protected).toBeUndefined();
  });
});
