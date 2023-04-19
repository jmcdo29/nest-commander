---
'nest-commander': minor
---

Add a new method to create an application but nott run it in case of needing to
modify the logger or similar situations.

Now the `CommandFactory.createWithoutRunning()` method can be used to create a
Nest commander application without running the `commandRunner.run()`. To run the
newly created application, `CommandFactory.runApplicaiton(app)` can be called. I
may change this to be a simple `app.run()` in the future.
