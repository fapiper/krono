import {
  ConstantBackoff,
  RingQueue,
  type Websocket,
  WebsocketBuilder,
} from 'websocket-ts';
import { mergeDeep } from '../utils';
import type {
  InternalWebsocketConnectionConfig,
  WebsocketConnectionConfig,
} from './types';

export const defaultConfig: InternalWebsocketConnectionConfig = {
  debug: false,
  reconnect: {
    backoff: new ConstantBackoff(1000),
  },
  buffer: {
    queue: new RingQueue(200),
  },
};

export class WebsocketConnection {
  private ws: Websocket | null = null;

  private readonly url: string;
  private readonly config: InternalWebsocketConnectionConfig;

  constructor(url: string, config?: WebsocketConnectionConfig) {
    this.url = url;
    this.config = mergeDeep(defaultConfig, config ?? {});
  }

  create(
    onOpen: () => void,
    onClose: (event: CloseEvent) => void,
    onError: (event: Event) => void,
    onMessage: (event: MessageEvent) => void,
  ): Websocket {
    let builder = new WebsocketBuilder(this.url)
      .onOpen(onOpen)
      .onClose((_, event) => onClose(event))
      .onError((_, event) => onError(event))
      .onMessage((_, event) => onMessage(event));

    if (this.config.reconnect?.backoff) {
      builder = builder.withBackoff(this.config.reconnect.backoff);
    }

    if (this.config.buffer?.queue) {
      builder = builder.withBuffer(this.config.buffer.queue);
    }

    this.ws = builder.build();
    return this.ws;
  }

  close(code = 1000, reason = 'Client disconnect'): void {
    this.ws?.close(code, reason);
    this.ws = null;
  }

  send(message: unknown): void {
    if (!this.ws) return;
    this.ws.send(JSON.stringify(message));
  }
}
