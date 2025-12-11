import type { KrakenMessage, KrakenSubscription } from './types';

export const KrakenWebsocketEventKey = {
  Message: 'message',
  Connected: 'connected',
  Disconnected: 'disconnected',
  Error: 'error',
} as const;

export type KrakenWebsocketEventKey =
  (typeof KrakenWebsocketEventKey)[keyof typeof KrakenWebsocketEventKey];

export type KrakenWebsocketEventMap = {
  [KrakenWebsocketEventKey.Message]: KrakenMessage;
  [KrakenWebsocketEventKey.Connected]: KrakenSubscription;
  [KrakenWebsocketEventKey.Disconnected]: KrakenSubscription | undefined;
  [KrakenWebsocketEventKey.Error]: Error;
};
