import type { EventListener } from '../types';

/**
 * Simple type-safe event emitter
 */
export class TypedEventEmitter<EventMap extends Record<string, unknown>> {
  private listeners: Map<keyof EventMap, Set<EventListener>> = new Map();

  on<K extends keyof EventMap>(
    event: K,
    listener: EventListener<EventMap[K]>,
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)?.add(listener);

    return () => this.off(event, listener);
  }

  off<K extends keyof EventMap>(
    event: K,
    listener: EventListener<EventMap[K]>,
  ): void {
    this.listeners.get(event)?.delete(listener);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const listeners = this.listeners.get(event) ?? [];
    for (const listener of listeners) {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in ${String(event)} listener:`, error);
      }
    }
  }

  removeAllListeners<K extends keyof EventMap>(event?: K): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  listenerCount<K extends keyof EventMap>(event: K): number {
    return this.listeners.get(event)?.size ?? 0;
  }
}
