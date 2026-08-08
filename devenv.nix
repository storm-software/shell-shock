{ pkgs, ... }:
{
  name = "storm-software/shell-shock";

  dotenv.enable = true;
  dotenv.filename = [
    ".env"
    ".env.local"
  ];
  dotenv.disableHint = true;
}
