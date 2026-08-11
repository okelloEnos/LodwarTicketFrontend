import { useEffect, useState } from 'react';
import { createTicket, fetchTickets, updateTicket } from './api';
import type { CreateTicketRequest, Ticket, TicketStatus, TicketPriority } from './types';
import TicketList from './components/AllTickets';
import CreateTicketForm from './components/CreateTicketForm';
import TicketModal from './components/TicketModal';
import './App.css';

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

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

  async function handleCreate(payload: CreateTicketRequest) {
    await createTicket(payload);
    await loadTickets();
  }

  async function handleUpdate(status?: TicketStatus, priority?: TicketPriority) {
    if (!selectedTicket) return;
    await updateTicket(selectedTicket.id, { status, priority });
    await loadTickets();
  }

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
              onSelectTicket={setSelectedTicket}
          />
          <CreateTicketForm onCreate={handleCreate} />
        </main>

        {selectedTicket && (
            <TicketModal
                ticket={selectedTicket}
                onClose={() => setSelectedTicket(null)}
                onUpdate={handleUpdate}
            />
        )}
      </div>
  );
}
