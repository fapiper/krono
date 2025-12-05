import { useOrderbookInstance } from '../context';
import { useOrderbookHistory } from './useOrderbookHistory';
import { useOrderbookSnapshot } from './useOrderbookSnapshot';

export function useOrderbookData() {
  const ob = useOrderbookInstance();

  const history = useOrderbookHistory();
  const snapshot = useOrderbookSnapshot();

  return {
    ...snapshot,
    ...history,
  };
}
