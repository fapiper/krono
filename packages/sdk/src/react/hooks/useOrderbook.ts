import { useOrderbookConfig } from './useOrderbookConfig';
import { useOrderbookConnection } from './useOrderbookConnection';
import { useOrderbookHistory } from './useOrderbookHistory';
import { useOrderbookLifecycle } from './useOrderbookLifecycle';
import { useOrderbookSnapshot } from './useOrderbookSnapshot';
import { useOrderbookStatus } from './useOrderbookStatus';

export function useOrderbook() {
  const status = useOrderbookStatus();
  const { connect, disconnect } = useOrderbookConnection();
  const { history, length: historyLength, getSnapshot } = useOrderbookHistory();
  const { snapshot: currentSnapshot } = useOrderbookSnapshot();
  const lifecycle = useOrderbookLifecycle();
  const config = useOrderbookConfig();

  return {
    status,
    connect,
    disconnect,
    ...lifecycle,
    ...config,
    currentSnapshot,
    history,
    historyLength,
    getSnapshot,
  };
}
