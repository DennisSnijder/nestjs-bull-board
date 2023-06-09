# This package has been migrated
This package has been migrated to the official [bull-board repository](https://github.com/felixmosh/bull-board/tree/master/packages/nestjs) and will be maintained from there. 

Please use the official `@bull-board/nestjs` package for future support and maintenance.

# NestJS bull-board module
A simple NestJS module for using bull-board with NestJS.

[![NPM](https://img.shields.io/npm/v/nestjs-bull-board.svg)](https://www.npmjs.com/package/nestjs-bull-board)

## Installation

Install both @bull-board/api and this module.
```bash
$ npm install --save nestjs-bull-board @bull-board/api
```

Install the Express or Fastify adapter depending on what you use in NestJS (default is Express)
```bash
$ npm install --save @bull-board/express
//or 
$ npm install --save @bull-board/fastify
```

## Register the root module
Once the installation is completed, we can import the `BullBoardModule` into your rootmodule e.g. `AppModule`.

```typescript
import { Module } from '@nestjs/common';
import { BullBoardModule } from "nestjs-bull-board";
import { ExpressAdapter } from "@bull-board/express";

@Module({
  imports: [
    BullModule.forRoot({
      // your bull module config here.
    }),

    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter // Or FastifyAdapter from `@bull-board/fastify`
    }),
  ],
})
export class AppModule {
}
```

The `forRoot()` method registers the bull-board instance and allows you to pass several options to both the instance and module.
The following options are available.
- `route` the base route for the bull-board instance adapter.
- `adapter` The routing adapter to be used, either the Express Adapter or Fastify Adapter provided by bull-board.
- `boardOptions` options as provided by the bull-board package, such as `uiBasePath` and `uiConfig`
- `middleware` optional middleware for the express adapter (e.g. basic authentication)

## Register your queues
To register a new queue, you need to register `BullBoardModule.forFeature` in the same module as where your queues are registered.

```typescript
import { Module } from '@nestjs/common';
import { BullBoardModule } from "nestjs-bull-board";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'my_awesome_queue'
      }
    ),
    
    BullBoardModule.forFeature({
      name: 'my_awesome_queue',
      adapter: BullMQAdapter, //or use BullAdapter if you're using bull instead of bullMQ
    }),
  ],
})
export class FeatureModule {}
```

The `forFeature` method registers the given queues to the bull-board instance. 
The following options are available.
- `name` the queue name to register
- `adapter` either `BullAdapter` or `BullMQAdapter` depending on which package you use.
- `options` queue adapter options as found in the bull-board package, such as `readOnlyMode`, `description` etc.

##  Using the bull-board instance in your controllers and/or services.
The created bull-board instance is available via the `@InjectBullBoard()` decorator.
For example in a controller:

```typescript
import { Controller, Get } from "@nestjs/common";
import { BullBoardInstance, InjectBullBoard } from "nestjs-bull-board";

@Controller('my-feature')
export class FeatureController {

  constructor(
    @InjectBullBoard() private readonly boardInstance: BullBoardInstance
  ) {
  }
  
  //controller methods
}
```