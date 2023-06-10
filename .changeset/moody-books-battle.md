---
'nest-commander': minor
---

Add ability to pass NestApplicationContextOptions to CommandFactoryRunOptions.

Now CommandFactory.createWithoutRunning() can accept more options, for example,
bufferLogs to pre-save Nest startup logs.
