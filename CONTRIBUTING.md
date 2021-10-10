# Contributing

## Reporting Issues

If you find an issue, please [report it here](https://github.com/jmcdo29/nest-commander/issues/new/choose). Follow the issue template and please fill out the information. Especially if it is a bug, please provide a [minimum reproduction repository](https://minimum-reproduction.wtf).

## Pre-Requisites

- [pnpm installed](https://pnpm.io) (you can try using `yarn` or `npm`, but sometimes they don't play nicely with the pnpm workspace)
- [Basic knowledge of Nx](https://nx.dev)

### Getting Started

The following steps are all it should really take to get started

1. Create a fork of the project
2. `git clone <your fork>`
3. `cd nest-commander`
4. `pnpm i`

And now you should be good to go

### Project Structure

`nest-commander` uses an [`nx`](https://nx.dev) workspace for development. This means that the packages can be found under `packages/` and each package has its own set of commands that can be found in the [`workspace.json`](./workspace.json) file. All of the docs for `nest-commander` can be found at `apps/docs/docs` and are all markdown files [thanks to docusaurus](https://docusaurus.io/). All integration tests can be found at `integration/`

### Making changes

Generally changes and improvements are appreciated, especially if they make logic less complex or they end up causing [codebeat](https://codebeat.co/) report a major (greater than .2) loss in code GPA. Other than that, follow the lint rules set up in the project, and make sure the git hooks run before [opening a Pull Request](https://github.com/jmcdo29/nest-commander/compare). Also, make sure if it's a new feature or a bug fix that a test is added to the integration tests. Lastly, please resolve any merge conflicts by [rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing). The easiest way to go about this is to use `git pull --rebase upstream main` where `upstream` is a remote set to `https://github.com/jmcdo29/nest-commander.git` or `git@github.com:jmcdo29/nest-commander.git` depending on if you use HTTPS or SSH with your git client.

#### Adding a Changeset

If you're making a change that you'd like to be published, please consider running `pnpm changeset` and following the wizard for setting up a changeset for the change. When this gets merged into `main`, the GitHub Actions will end up opening a new PR afterwards for updating the version and publishing to npm. [If you're interested in how, there's a blog post about it here](https://dev.to/jmcdo29/automating-your-package-deployment-in-an-nx-monorepo-with-changeset-4em8). The wizard is pretty straight forward, I do ask that you try to follow [semver](https://semver.org/) as much as possible and don't make major changes unless absolutely necessary.

### Building just one project

If you need to just build a single project, you can use `pnpm nx build <project-name>`. If you want to build everything that has been affected you can instead use `pnpm build` which will use `nx affected:build` instead.

### Testing just one suite

To run the tests, you can use `pnpm e2e` or `pnpm nx e2e integration`, this will run all of the integration tests, it shouldn't take more than 15 seconds. If it does, there's most likely an `exit` call that was mocked and not restored. Ping me on discord and we can try to find it.

If you need to just run one of the test suites you can use `pnpm e2e -- --testFile=<fileName>`.

## Keeping in touch

You can get a hold of me (Jay) by [emailing me](mailto:me@jaymcdoniel.dev) or by contacting me on [the Nest Discord](https://discord.gg/6byqVsXzaF) (there's a channel dedicated to `nest-commander`)
