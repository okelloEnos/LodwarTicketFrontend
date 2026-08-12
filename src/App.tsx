import { useEffect, useState } from 'react';
import { createTicket, fetchTickets, updateTicket } from './api';
import type { CreateTicketRequest, Ticket, TicketStatus, TicketPriority, PageResponse } from './types';
import TicketList from './components/AllTickets';
import CreateTicketForm from './components/CreateTicketForm';
import TicketModal from './components/TicketModal';
import './App.css';

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState<PageResponse<Ticket>['pagination'] | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  async function loadTickets() {
    setLoading(true);
    setListError(null);
    try {
      const result = await fetchTickets({ page, limit });
      setTickets(result.data);

      const p = result.pagination || { page, limit, total: result.data.length, totalPages: 1 };
      const computedTotalPages =
        p.totalPages && p.totalPages > 0
          ? p.totalPages
          : Math.max(1, Math.ceil((p.total ?? result.data.length) / (p.limit ?? limit)));
      setPagination({
        page: p.page ?? page,
        limit: p.limit ?? limit,
        total: p.total ?? result.data.length,
        totalPages: computedTotalPages,
      });
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
  }, [page, limit]);

  async function handleCreate(payload: CreateTicketRequest) {
    await createTicket(payload);
    setPage(1);
  }

  async function handleUpdate(status?: TicketStatus, priority?: TicketPriority) {
    if (!selectedTicket) return;
    await updateTicket(selectedTicket.id, { status, priority });
    await loadTickets();
  }

  function handlePageChange(newPage: number) {
    if (!pagination) {
      setPage(newPage);
      return;
    }
    if (newPage < 1) return;
    if (newPage > pagination.totalPages) return;
    setPage(newPage);
  }

  function handleLimitChange(newLimit: number) {
    setLimit(newLimit);
    setPage(1);
  }

  return (
      <div className="app">
        <header className="app-header">
          <h1>Mini Ticket Tracker</h1>
        </header>

        <main className="app-layout">
          <TicketList
              tickets={tickets}
              pagination={pagination}
              loading={loading}
              error={listError}
              onSelectTicket={setSelectedTicket}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
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
