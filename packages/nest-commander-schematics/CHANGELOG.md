# nest-commander-schematics

## 3.2.0

### Minor Changes

- ca7ee4b: Bump @golevelup/nestjs-discovery from v4 to v5

## 3.1.0

### Minor Changes

- ce3d4f4: Support NestJS v11

## 3.0.2

### Patch Changes

- 08f72e5: Update angular changeset

## 3.0.1

### Patch Changes

- 15b0d87: Actually publish the schematic templates

## 3.0.0

### Major Changes

- 1bfc69f: Schematics now create command that extends the CommandRunner abstract
  class

- 799b143: Update @nestjs/schematics to version 9

  There should not be "breaking" functionality, but there was a major version
  change of a dependent pacakge with no backwards support guaranteed.

### Patch Changes

- 67662f6: fix typo

## 2.1.0

### Minor Changes

- 9ef701c: Add prompt to every schematic option

## 2.0.1

### Patch Changes

- b3c16cd: Fix the directory that the pnpm publish command looks at

## 2.0.0

### Major Changes

- ee001cc: Upgrade all Nest dependencies to version 8

  WHAT: Upgrade `@nestjs/` dependencies to v8 and RxJS to v7 WHY: To support the
  latest version of Nest HOW: upgrading to Nest v8 should be all that's
  necessary (along with rxjs to v7)

## 1.0.0

### Major Changes

- 28cc116: Releases two schematics for the angular and nest CLI's to make use of
  `command` and `question`. To use one, you can pass
  `--collection nest-commander-schematic` to Nest's CLI and then the schematic
  name followed by the name of the feature. e.g.
  `nest g --collection nest-commander-schematics command foo`.
