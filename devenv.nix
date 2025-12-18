{ pkgs, inputs, ... }:
{
  name = "storm-software/shell-shock";

  dotenv.enable = true;
  dotenv.filename = [
    ".env"
    ".env.local"
  ];
  dotenv.disableHint = true;

  # https://devenv.sh/basics/
  env.DEFAULT_LOCALE = "en_US";
  env.DEFAULT_TIMEZONE = "America/New_York";

  packages = with pkgs; [
    zig
  ];
}
