export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
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
   * An established connection.
   */
  connected: boolean;

  /**
   * A fully disconnected state.
   */
  disconnected: boolean;
}
