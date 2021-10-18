#!/usr/bin/env node

import { CommandFactory } from 'nest-commander'
import { FooModule } from './foo.module'

async function bootstrap () {
  await CommandFactory.run(FooModule, {
    logger: ['error', 'warn'],
    usePlugins: true,
    cliName: 'custom-name'
  })
}

bootstrap()