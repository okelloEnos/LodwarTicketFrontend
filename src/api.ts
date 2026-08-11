import type { PageResponse, Ticket } from './types';

const BASE_URL = 'http://localhost:8080/ticketss';

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

export async function fetchTickets(): Promise<PageResponse<Ticket>> {
    const res = await fetch(`${BASE_URL}`);
    return handleResponse<PageResponse<Ticket>>(res);
}
