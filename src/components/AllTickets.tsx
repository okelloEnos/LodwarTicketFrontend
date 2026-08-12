import type { Ticket } from '../types';

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface Props {
    tickets: Ticket[];
    pagination: Pagination | null;
    loading: boolean;
    error: string | null;
    onSelectTicket: (ticket: Ticket) => void;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

export default function TicketList({
    tickets,
    pagination,
    loading,
    error,
    onSelectTicket,
    onPageChange,
}: Props) {
    return (
        <div className="card">
            <h2>Tickets</h2>

            <div className="ticket-headers">
                <span className="ticket-title">Title</span>
                <span className="ticket-status">Status</span>
                <span className="ticket-priority">Priority</span>
                <span className="ticket-action-header" />
            </div>

            {error && <p className="error-text">{error}</p>}

            {loading ? (
                <p className="muted">Loading tickets…</p>
            ) : tickets.length === 0 ? (
                <p className="muted">No tickets found.</p>
            ) : (
                <>
                    <ul className="ticket-list">
                        {tickets.map((ticket) => (
                            <li key={ticket.id} className="ticket-item">
                                <span className="ticket-title">{ticket.title}</span>
                                <span className={`ticket-status status-${ticket.status.toLowerCase()}`}>{ticket.status.replace('_',' ')}</span>
                                <span className={`ticket-priority priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
                                <button
                                    className="edit-btn"
                                    onClick={() => onSelectTicket(ticket)}
                                    title="Edit ticket"
                                >
                                    ✎
                                </button>
                            </li>
                        ))}
                    </ul>
                    {pagination && (
                        <div className="pagination">
                            <button
                                onClick={() => onPageChange(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                            >
                                Previous
                            </button>

                            <div className="page-numbers">
                                {
                                  (() => {
                                    const total = pagination.totalPages;
                                    const current = pagination.page;
                                    const maxButtons = 7;
                                    if (total <= maxButtons) {
                                      return Array.from({ length: total }, (_, i) => i + 1).map((pageNum) => (
                                        <button
                                          key={pageNum}
                                          className={`page-btn ${pageNum === current ? 'active' : ''}`}
                                          onClick={() => onPageChange(pageNum)}
                                        >
                                          {pageNum}
                                        </button>
                                      ));
                                    }

                                    const pages: (number | string)[] = [];
                                    pages.push(1);

                                    const side = Math.floor((maxButtons - 3) / 2); // pages shown around current
                                    let left = Math.max(2, current - side);
                                    let right = Math.min(total - 1, current + side);

                                    if (current - 1 <= side) {
                                      left = 2;
                                      right = maxButtons - 2;
                                    }
                                    if (total - current <= side) {
                                      left = total - (maxButtons - 3);
                                      right = total - 1;
                                    }

                                    if (left > 2) pages.push('...');
                                    for (let p = left; p <= right; p++) pages.push(p);
                                    if (right < total - 1) pages.push('...');

                                    pages.push(total);

                                    return pages.map((p, idx) => {
                                      if (p === '...') return (
                                        <span key={`e-${idx}`} className="ellipsis">…</span>
                                      );
                                      const pageNum = p as number;
                                      return (
                                        <button
                                          key={pageNum}
                                          className={`page-btn ${pageNum === current ? 'active' : ''}`}
                                          onClick={() => onPageChange(pageNum)}
                                        >
                                          {pageNum}
                                        </button>
                                      );
                                    });
                                  })()
                                }
                            </div>

                            <button
                                onClick={() => pagination.page < pagination.totalPages && onPageChange(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
