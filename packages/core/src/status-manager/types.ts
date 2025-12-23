export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'reconnecting'
  | 'connected'
  | 'error';

/**
 * Orderbook connection state.
 */
export interface IOrderbookStatus {
  /**
   * Connection status.
   */
  status: ConnectionStatus;

  /**
   * Last connection error, if any.
   */
  error: Error | null;

  /**
   * An active connection attempt.
   */
  connecting: boolean;

  /**
   * An active reconnect attempt.
   */
  reconnecting: boolean;

  /**
   * An established connection.
   */
  connected: boolean;

  /**
   * A fully disconnected state.
   */
  disconnected: boolean;
}
