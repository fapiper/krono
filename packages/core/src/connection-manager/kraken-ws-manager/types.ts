import type { Backoff, Queue } from 'websocket-ts';

export type ReconnectConfig = {
  backoff?: Backoff;
};

export type BufferConfig<
  E extends string | ArrayBufferLike | Blob | ArrayBufferView,
> = {
  queue?: Queue<E>;
};

export type WebsocketConnectionConfig = {
  debug?: boolean;
  reconnect?: ReconnectConfig;
  buffer?: BufferConfig<string | ArrayBufferLike | Blob | ArrayBufferView>;
};

export type InternalWebsocketConnectionConfig =
  Required<WebsocketConnectionConfig>;

export type KrakenWebsocketConfig = {
  debug?: boolean;
  connection?: WebsocketConnectionConfig;
};

export type InternalKrakenWebsocketConfig = Required<
  Omit<KrakenWebsocketConfig, 'connection'>
>;

export type KrakenSubscription = {
  method: 'subscribe' | 'unsubscribe';
  params: {
    channel: string;
    symbol: string[];
    snapshot?: boolean;
    depth?: number;
  };
};

export type KrakenBookMessage = {
  channel: 'book';
  type: 'snapshot' | 'update';
  data: Array<{
    symbol: string;
    bids: Array<{ price: number; qty: number }>;
    asks: Array<{ price: number; qty: number }>;
    checksum?: number;
    timestamp?: string;
  }>;
};

export type KrakenBookMessageDataItem = KrakenBookMessage['data'][0];

export type KrakenHeartbeat = {
  channel: 'heartbeat';
};

export type KrakenStatus = {
  channel: 'status';
  data: Array<{
    api_version: string;
    connection_id: number;
    system: string;
    version: string;
  }>;
};

export type KrakenMessage = KrakenBookMessage | KrakenHeartbeat | KrakenStatus;

export type KrakenHandlerMap = {
  message: (msg: KrakenMessage) => void;
  error: (err: Error) => void;
  close: () => void;
};

export interface WebsocketManager {
  connect(): Promise<void>;
  disconnect(): void;
  on(event: 'message', handler: (message: KrakenMessage) => void): void;
  on(event: 'error', handler: (error: Error) => void): void;
  on(event: 'close', handler: () => void): void;
}
