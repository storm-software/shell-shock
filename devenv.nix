{ pkgs, inputs, ... }:
{
  name = "storm-software/shell-shock";

  dotenv.enable = true;
  dotenv.filename = [
    ".env"
    ".env.local"
  ];
  dotenv.disableHint = true;

  packages = with pkgs; [
    zig
  ];
}
