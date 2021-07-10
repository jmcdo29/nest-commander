# nest-commander-schematics

## 2.0.1

### Patch Changes

- b3c16cd: Fix the directory that the pnpm publish command looks at

## 2.0.0

### Major Changes

- ee001cc: Upgrade all Nest dependencies to version 8

  WHAT: Upgrade `@nestjs/` dependencies to v8 and RxJS to v7 WHY: To support the latest version of Nest HOW: upgrading to Nest v8 should be all that's necessary (along with rxjs to v7)

## 1.0.0

### Major Changes

- 28cc116: Releases two schematics for the angular and nest CLI's to make use of `command` and `question`. To use one, you can pass `--collection nest-commander-schematic` to Nest's CLI and then the schematic name followed by the name of the feature. e.g. `nest g --collection nest-commander-schematics command foo`.
