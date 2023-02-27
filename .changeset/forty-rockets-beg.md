---
'nest-commander': minor
---

Add serviceErrorHandler option

This option allows for catching and handling errors at the Nest service execution level so that
lifecycle hooks still properly work. By default it is set to
`(err: Error) => process.stderr.write(err.toString())`.
