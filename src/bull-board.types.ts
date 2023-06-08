import { createBullBoard } from "@bull-board/api";
import { BoardOptions, QueueAdapterOptions } from "@bull-board/api/dist/typings/app";
import { BaseAdapter } from "@bull-board/api/dist/src/queueAdapters/base";

export type BullBoardModuleOptions = {
  route: string;
  boardOptions?: BoardOptions,
  middleware?: any
}

export type BullBoardQueueOptions = {
  name: string;
  adapter: { new(queue: any, options?: QueueAdapterOptions) : BaseAdapter },
  options?: QueueAdapterOptions,
};

export type BullBoardInstance = ReturnType<typeof createBullBoard>;