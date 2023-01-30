---
'nest-commander': minor
---

Allow for use of request scoped providers through a new module decorator

By making use of the `@RequestModule()` decorator for modules, as mock request object can be set as a singleton to help the use of `REQUEST` scoped providers in a singleton context. There's now also an error that is logged in the case of a property of `undefined` being called, as this is usually indicative of a `REQUEST` scoped provider being called from a `SINGLETON` context.
