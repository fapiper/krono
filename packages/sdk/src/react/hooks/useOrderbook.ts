import { useOrderbookConfig } from './useOrderbookConfig';
import { useOrderbookConnection } from './useOrderbookConnection';
import { useOrderbookData } from './useOrderbookData';
import { useOrderbookHistory } from './useOrderbookHistory';
import { useOrderbookLifecycle } from './useOrderbookLifecycle';
import { useOrderbookStatus } from './useOrderbookStatus';

export function useOrderbook() {
  const status = useOrderbookStatus();
  const { connect, disconnect } = useOrderbookConnection();
  const history = useOrderbookHistory();
  const { ...currentData } = useOrderbookData();
  const lifecycle = useOrderbookLifecycle();
  const config = useOrderbookConfig();

  return {
    status,
    connect,
    disconnect,
    ...lifecycle,
    ...config,
    currentData,
    history,
  };
}
