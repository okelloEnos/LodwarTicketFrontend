import { useState } from 'react';
import type { Ticket, TicketStatus, TicketPriority } from '../types';

interface Props {
  ticket: Ticket;
  onClose: () => void;
  onUpdate: (status?: TicketStatus, priority?: TicketPriority) => Promise<void>;
}

export default function TicketModal({ ticket, onClose, onUpdate }: Props) {
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setLoading(true);
    setError(null);
    try {
      await onUpdate(status, priority);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{ticket.title}</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="modal-body">
          <div className="modal-field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as TicketStatus)} disabled={loading}>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <div className="modal-field">
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)} disabled={loading}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving…' : 'Save'}
          </button>
          <button onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
