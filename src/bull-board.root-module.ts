import {
  DynamicModule,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider
} from "@nestjs/common";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BULL_BOARD_ADAPTER, BULL_BOARD_INSTANCE, BULL_BOARD_OPTIONS } from "./bull-board.constants";
import { BullBoardModuleOptions } from "./bull-board.types";

@Module({})
export class BullBoardRootModule implements NestModule {

  constructor(
    @Inject(BULL_BOARD_ADAPTER) private readonly adapter: ExpressAdapter,
    @Inject(BULL_BOARD_OPTIONS) private readonly options: BullBoardModuleOptions
  ) {
  }

  configure(consumer: MiddlewareConsumer): any {
    this.adapter.setBasePath(this.options.route);

    consumer
      .apply(this.options.middleware, this.adapter.getRouter())
      .forRoutes(this.options.route);
  }

  static forRoot(options: BullBoardModuleOptions): DynamicModule {
    const serverAdapter = new ExpressAdapter();

    const bullBoardProvider: Provider = {
      provide: BULL_BOARD_INSTANCE,
      useFactory: () => createBullBoard({
        queues: [],
        serverAdapter: serverAdapter,
        options: options.boardOptions,
      })
    };

    const serverAdapterProvider: Provider = {
      provide: BULL_BOARD_ADAPTER,
      useFactory: () => serverAdapter
    };

    const optionsProvider: Provider = {
      provide: BULL_BOARD_OPTIONS,
      useValue: options
    };

    return {
      module: BullBoardRootModule,
      global: true,
      imports: [],
      providers: [
        serverAdapterProvider,
        optionsProvider,
        bullBoardProvider
      ],
      exports: [
        serverAdapterProvider,
        bullBoardProvider,
        optionsProvider
      ],
    };
  }
}