import type { CreateTicketRequest, PageResponse, Ticket, UpdateTicketRequest } from './types';

const BASE_URL = 'http://localhost:8080/tickets';

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        let message = `Request failed with status ${res.status}`;
        try {
            const body = await res.json();
            if (body?.message) message = body.message;
        } catch {
            // response had no JSON body — keep the default message
        }
        throw new Error(message);
    }
    const text = await res.text();
    return (text ? JSON.parse(text) : undefined) as T;
}

export interface FetchTicketsParams {
    page?: number;
    limit?: number;
}

export async function fetchTickets(params?: FetchTicketsParams): Promise<PageResponse<Ticket>> {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set('page', String(params.page));
    if (params?.limit !== undefined) query.set('limit', String(params.limit));

    const res = await fetch(`${BASE_URL}?${query.toString()}`);
    return handleResponse<PageResponse<Ticket>>(res);
}

export async function createTicket(
    payload: CreateTicketRequest,
): Promise<Ticket> {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse<Ticket>(res);
}

export async function updateTicket(
    id: string,
    payload: UpdateTicketRequest,
): Promise<Ticket> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse<Ticket>(res);
}
