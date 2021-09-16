# nest-commander-testing

## 2.0.1

### Patch Changes

- 3831e52: Adds a new `@Help()` decorator for custom commander help output

  `nest-commander-testing` now also uses a `hex` instead of `utf-8` encoding when creating a random js file name during the `CommandTestFactory` command. This is to help create more predictable output names.

## 2.0.0

### Major Changes

- ee001cc: Upgrade all Nest dependencies to version 8

  WHAT: Upgrade `@nestjs/` dependencies to v8 and RxJS to v7 WHY: To support the latest version of Nest HOW: upgrading to Nest v8 should be all that's necessary (along with rxjs to v7)

## 1.2.0

### Minor Changes

- f3f687b: Allow for commands to be run indefinitely

  There is a new `runWithoutClosing` method in the `CommandFactory` class. This command allows for not having the created Nest Application get closed immediately, which should allow for the use of indefinitely runnable commands.
