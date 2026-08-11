export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Ticket {
    id: string;
    title: string;
    description: string | null;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt: string;
}

export interface CreateTicketRequest {
    title: string;
    description?: string;
    priority?: TicketPriority;
}

export interface UpdateTicketRequest {
    status?: TicketStatus;
    priority?: TicketPriority;
}

export interface PageResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
