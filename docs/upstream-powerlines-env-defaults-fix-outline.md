# Powerlines environment defaults

The `@powerlines/plugin-env` base schema currently requires `MINIMAL`,
`NO_COLOR`, `FORCE_HYPERLINK`, `INCLUDE_ERROR_DATA`, and `CI` even when the
host does not define them. Shell Shock supplies local defaults in its
extended schema so a generated CLI can start without these exports.

In the Powerlines repository, give these fields `false` defaults in the
base env schema while retaining their existing metadata and explicit input
values. `FORCE_HYPERLINK` must still accept numeric levels. Test parsing an
input with all five fields absent and one with explicit `true` values and a
numeric hyperlink level. Once released, Shell Shock can remove its local
overrides.
