---
'nest-commander': major
'nest-commander-testing': major
---

Migrate `CommandRunner` from interface to abstract class and add `.command`

This change was made so that devs could access `this.command` inside the `CommandRunner` instance and have access to the base command object from commander. This allows for access to the `help` commands in a programatic fashion.

To update to this version, any `implements CommandRunner` should be changed to `extends CommandRunner`. If there is a `constructor` to the `CommandRunner` then it should also use `super()`.
