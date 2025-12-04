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

export type WebSocketManager = {
  connect(): Promise<void>;
  disconnect(): void;
  on(event: 'message', handler: (message: KrakenMessage) => void): void;
  on(event: 'error', handler: (error: Error) => void): void;
  on(event: 'close', handler: () => void): void;
};
