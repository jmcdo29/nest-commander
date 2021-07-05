# nest-commander

## 1.3.0

### Minor Changes

- f3f687b: Allow for commands to be run indefinitely

  There is a new `runWithoutClosing` method in the `CommandFactory` class. This command allows for not having the created Nest Application get closed immediately, which should allow for the use of indefinitely runnable commands.

## 1.2.0

### Minor Changes

- 7cce284: Add ability to use error handler for commander errors

  Within the `CommandFactory.run()` now as a second parameter you can either keep passing just the logger, or you can pass in an object with the logger and an `errorHandler`. Ths `errorHandler` is a method that takes in an `Error` and returns `void`. The errorHandler will be passed to commander's `exitOverride` method, if it exists. This is useful for better handling errors and giving the dev more control over what is seen. There is also no longer an `unhandledPromiseRejection` on empty commands.
