---
'nest-commander': minor
---

Add new `@Options<T[]>` decorator for variadic options with array defaults. When
values are provided, they replace the default array instead of prepending to it.
The existing `@Option` decorator is unchanged.
