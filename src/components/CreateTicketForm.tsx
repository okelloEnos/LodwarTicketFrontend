import { useState } from 'react';
import type { CreateTicketRequest, TicketPriority } from '../types';

interface Props {
  onCreate: (payload: CreateTicketRequest) => Promise<void>;
}

export default function CreateTicketForm({ onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onCreate({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
      });
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Create Ticket</h2>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            disabled={loading}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            disabled={loading}
            rows={3}
          />
        </div>
        <div className="form-group">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TicketPriority)}
            disabled={loading}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create'}
        </button>
      </form>
    </div>
  );
}
