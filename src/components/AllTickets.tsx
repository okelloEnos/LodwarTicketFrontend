import type { Ticket } from '../types';

interface Props {
    tickets: Ticket[];
    loading: boolean;
    error: string | null;
}

export default function TicketList({
    tickets,
    loading,
    error,
}: Props) {
    return (
        <div className="card">
            <h2>Tickets</h2>

            {error && <p className="error-text">{error}</p>}

            {loading ? (
                <p className="muted">Loading tickets…</p>
            ) : tickets.length === 0 ? (
                <p className="muted">No tickets found.</p>
            ) : (
                <ul className="ticket-list">
                    {tickets.map((ticket) => (
                        <li key={ticket.id}>
                            {ticket.title} - {ticket.status} ({ticket.priority})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
