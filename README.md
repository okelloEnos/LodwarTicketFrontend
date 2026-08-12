# Mini Ticket Tracker Frontend

It provides a simple interface for creating, viewing and updating tickets.

## Setup and Run Instructions

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm

### Setup

Clone the repository and navigate to the frontend project:

```bash
cd LodwarTicketFrontend
```

Install the dependencies:

```bash
npm install
```

The frontend expects the backend API to be running at:

```text
http://localhost:8080
```

The API endpoint is currently configured in `src/api.ts`:

```typescript
const BASE_URL = 'http://localhost:8080/tickets';
```

Make sure the backend is running before starting the frontend.

### Running the Application

Start the development server:

```bash
npm run dev
```


## Decisions & Tradeoffs

1. React's built-in state management because the application has a relatively small amount of shared state. 
2. The native Fetch API was used instead of adding a data-fetching library to keep the implementation lightweight.
3. The API base URL is currently hardcoded to `localhost`, which keeps local setup simple but should be moved to an environment variable for different environments. 
4. The ticket edit functionality is implemented using a modal so users can update status and priority without leaving the ticket list.


With more time: 
I would introduce environment-based API configuration, add a dedicated API layer and add more comprehensive error handling and accessibility improvements plus responsiveness.
