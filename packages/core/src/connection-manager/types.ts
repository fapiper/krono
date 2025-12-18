/**
 * Controls an orderbook websocket data connection lifecycle.
 */
export interface IOrderbookConnection {
  /**
   * Opens the websocket connection and subscribes
   * to the orderbook feed.
   */
  connect(): Promise<void>;

  /**
   * Closes the websocket connection and stops updates.
   */
  disconnect(): void;
}
