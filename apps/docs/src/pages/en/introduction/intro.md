---
id: intro
title: Why nest-commander?
layout: ../../../layouts/MainLayout.astro
---

## Initial Motivation

[NestJS](https://docs.nestjs.com) is a super powerful NodeJS framework that allows developers to have the same architecture across all their applications. But other than the mention of [Standalone Applications](https://docs.nestjs.com/standalone-applications) there's only a few packages that attempt to bring together Nest's opinionated architecture and popular CLI packages. `nest-commander` aims to bring the most unified experience when it comes to being inline with Nest's ideologies and opinions, by wrapping the popular [Commander](https://github.com/tj/commander.js) and [Inquirer](https://github.com/SBoudrias/Inquirer.js) packages, and providing its own decorators for integration with all the corresponding libraries.

## Plugins

[Plugins](/en/features/plugins) raise nest-commander to the next level of CLI programming. With plugins, you, the CLI developer, are able to split out commands between global CLI and project specific CLI commands. Imagine, at some point, you'll notice that certain commands need to be separately evolved to run apace to a certain project. Or, you'll need different commands for different project types. So, instead of creating different versions of your one global CLI, with plugins, you could split out the local and global commands to their own packages. Plugins allow for version matching of a project's specialized CLI commands to different versions or types of projects. As you can imagine, this enables you to build very intricate CLIs.

The plugins feature will more likely be needed later in your project's evolution. That is, once your CLI needs grow, this ability to "break out" commands is ready and waiting for you to go to the next level of CLI development.

## Code Reuse of Your Nest Code - in the CLI

One of the biggest advantages to Nest's modularization techniques is the ability to separate standard or commonly used code to their own modules and build them as standalone libraries. With nest-commander, such libraries can also be used by your CLI commands too. Take, for instance, the scenario where you might need to build your own data seeding or data initialization scripts, where they only need to be ran once to start off a project. Running these scripts are perfect as CLI commands. And, instead of you creating new modules or having to copy code just for the CLI commands to gain access to your database layer to do the work, you simply use the same modules already built for your project, leveraging all of the great advantages Nest's DI system has to offer, at the same time.

All these reasons are why nest-commander is THE perfect companion to allow you to build flexible and smart CLI applications for your Nest-based projects.
