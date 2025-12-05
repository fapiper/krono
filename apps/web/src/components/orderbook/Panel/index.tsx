'use client';

import { useOrderbook } from '@orderbook-visualizer/sdk/react';
import { Button } from '@orderbook-visualizer/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@orderbook-visualizer/ui/components/ui/card';
import { Separator } from '@orderbook-visualizer/ui/components/ui/separator';
import { Switch } from '@orderbook-visualizer/ui/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@orderbook-visualizer/ui/components/ui/table';
import { Label } from '@ui/components/ui/label';

export function OrderbookPanel() {
  const { symbol, status, debug, setDebug, connect, disconnect, data } =
    useOrderbook();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Orderbook — {symbol}</span>
          <span
            className={`text-sm font-normal ${
              status === 'connected' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {status}
          </span>
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4">
        <div>
          {/* CONFIG / CONTROLS */}
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={connect}>Connect</Button>
            <Button variant="outline" onClick={disconnect}>
              Disconnect
            </Button>

            <div className="flex items-center gap-2">
              <Label htmlFor={'debug'}>Debug</Label>
              <Switch
                id={'debug'}
                checked={!!debug}
                onCheckedChange={(enabled: boolean) => setDebug(enabled)}
              />
            </div>
          </div>

          <Button variant="outline" onClick={data.prev} disabled={!data.prev}>
            Back
          </Button>

          <Button variant="outline" onClick={data.next} disabled={!data.next}>
            Forward
          </Button>

          <span className="text-xs opacity-60">Live?</span>
        </div>

        {/* ERRORS */}
        {/*
        {error && (
          <p className="text-red-500 text-sm uppercase">{error.message}</p>
        )}
*/}

        {/* ORDERBOOK TABLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BIDS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-500">Bids</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.bids?.map((bid, i) => (
                    <TableRow key={`${bid[0]}-${bid[1]}`}>
                      <TableCell>
                        {bid[0]} ({data?.timestamp})
                      </TableCell>
                      <TableCell>{bid[1]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* ASKS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">Asks</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Price</TableHead>
                    <TableHead>Volume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.asks?.map((ask, i) => (
                    <TableRow key={`${ask[0]}-${ask[1]}`}>
                      <TableCell>{ask[0]}</TableCell>
                      <TableCell>{ask[1]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
