import { useEffect, useState } from 'react';
import { fetchTickets } from './api';
import type { Ticket } from './types';
import TicketList from './components/AllTickets';
import './App.css';

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  async function loadTickets() {
    setLoading(true);
    setListError(null);
    try {
      const result = await fetchTickets();
      setTickets(result.data);
    } catch (err) {
      setListError(
          err instanceof Error ? err.message : 'Failed to load tickets',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await loadTickets();
    })();
  }, []);

  return (
      <div className="app">
        <header className="app-header">
          <h1>Mini Ticket Tracker</h1>
        </header>

        <main className="app-layout">
          <TicketList
              tickets={tickets}
              loading={loading}
              error={listError}
          />
        </main>
      </div>
  );
}
