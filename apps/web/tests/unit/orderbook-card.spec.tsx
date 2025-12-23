import type {
  OrderbookControlsRootProps,
  OrderbookControlsToolbarProps,
  OrderbookPanelProps,
} from '@krono/kit';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OrderbookCard } from '@/components/orderbook-card';

vi.mock('@krono/kit', () => ({
  formatDigits: vi.fn((value) => value.toString()),
  formatUSD: vi.fn((value) => `$${value}`),
  Orderbook: {
    Panel: ({ children, renderTable }: OrderbookPanelProps) => (
      <div data-testid="orderbook-panel">
        {renderTable?.({ data: [], type: 'bids' })}
        {children}
      </div>
    ),
  },
  OrderbookControls: {
    Root: ({ children }: OrderbookControlsRootProps) => (
      <div data-testid="orderbook-controls">{children}</div>
    ),
    LiveBadge: () => <div data-testid="live-badge">Live</div>,
    Toolbar: ({ children }: OrderbookControlsToolbarProps) => (
      <div data-testid="toolbar">{children}</div>
    ),
    PlaybackButtons: () => <div data-testid="playback-buttons">Playback</div>,
    Timeline: () => <div data-testid="timeline">Timeline</div>,
  },
  OrderbookTable: {
    Root: () => <div data-testid="orderbook-table">Table</div>,
  },
}));

describe('OrderbookCard', () => {
  it('renders the orderbook card component', () => {
    render(<OrderbookCard />);
    expect(screen.getByTestId('orderbook-panel')).toBeInTheDocument();
  });

  it('renders the orderbook controls', () => {
    render(<OrderbookCard />);
    expect(screen.getByTestId('orderbook-controls')).toBeInTheDocument();
  });

  it('displays the live badge', () => {
    render(<OrderbookCard />);
    expect(screen.getByTestId('live-badge')).toBeInTheDocument();
  });

  it('renders the playback buttons', () => {
    render(<OrderbookCard />);
    expect(screen.getByTestId('playback-buttons')).toBeInTheDocument();
  });

  it('renders the timeline', () => {
    render(<OrderbookCard />);
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
  });

  it('renders the orderbook table', () => {
    render(<OrderbookCard />);
    expect(screen.getByTestId('orderbook-table')).toBeInTheDocument();
  });
});
