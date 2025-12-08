import { useOrderbookConfig } from './useOrderbookConfig';
import { useOrderbookConnection } from './useOrderbookConnection';
import { useOrderbookHistory } from './useOrderbookHistory';
import { useOrderbookLifecycle } from './useOrderbookLifecycle';
import { useOrderbookSnapshot } from './useOrderbookSnapshot';
import { useOrderbookStatus } from './useOrderbookStatus';

export function useOrderbook() {
  const status = useOrderbookStatus();
  const { connect, disconnect } = useOrderbookConnection();
  const history = useOrderbookHistory();
  const snapshot = useOrderbookSnapshot();
  const lifecycle = useOrderbookLifecycle();
  const config = useOrderbookConfig();

  return {
    status,
    history,
    connect,
    disconnect,
    ...lifecycle,
    ...config,
    ...snapshot,
  };
}
