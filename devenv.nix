{ pkgs, ... }:
{
  name = "storm-software/shell-shock";

  env.NODE_OPTIONS = "--disable-warning=DEP0190 --experimental-modules --no-experimental-strip-types";

  dotenv.enable = true;
  dotenv.filename = [
    ".env"
    ".env.local"
  ];
  dotenv.disableHint = true;
}
