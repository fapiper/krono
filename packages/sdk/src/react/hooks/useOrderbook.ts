import { useOrderbookConfig } from './useOrderbookConfig';
import { useOrderbookConnection } from './useOrderbookConnection';
import { useOrderbookData } from './useOrderbookData';
import { useOrderbookLifecycle } from './useOrderbookLifecycle';
import { useOrderbookStatus } from './useOrderbookStatus';

export function useOrderbook() {
  const status = useOrderbookStatus();
  const { connect, disconnect } = useOrderbookConnection();
  const data = useOrderbookData();
  const lifecycle = useOrderbookLifecycle();
  const config = useOrderbookConfig();

  return {
    status,
    data,
    connect,
    disconnect,
    ...lifecycle,
    ...config,
  };
}
