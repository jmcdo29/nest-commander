---
title: UtilityService
sidebar: UtilityService
---

As parsing booleans and numbers is a common occurrence, and the values only come in naturally as strings, nest-commander exposes a `CliUtilityService` to make parsing even easier and to add some extra utility. There are three methods, `parseBoolean`, `parseInt`, and `parseFloat`. `parseInt` and `parseFloat` are simple wrappers around the corresponding `Number.parse*()` method, but the `parseBoolean` method has a few more tricks to it.

## parseBoolean

Sometimes with CLIs we want to have the simplest input as possible, and while `true` and `false` are clear, sometimes they're more than we really want to have to type out. Because of this, the `CliUtilityService` has a list of true and false values that can be accepted for a boolean input, even if it's not a boolean primitive. All inputs passed to `parseBoolean` are passed through `toLowerCase()` before any comparison is made.

### true Values

Any string that matches one of the following values is considered a `true` input:

- yes
- y
- true
- t
- 1

### false Values

Any string that matches one of the following values is considered a `false` input:

- no
- n
- false
- f
- 0
