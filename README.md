# Rate Everything Application

## Getting Started

1. Download the project.
2. Ensure you have Next.js installed.
    - Check by running `npm --version`.
3. Open a new terminal and navigate to the project's directory.
4. Install dependencies by running `npm install`.
5. Run the development server using `npm run dev`.
6. Open up http://localhost:3000 in order to see the website.




## Project Files

### Database

- `prisma/schema.prisma`: Prisma is used for ORM. This file defines the schema for the database used by the website for storing users and posts.

### Backend & API Endpoints

- `src/app/queries.ts`: Defines functions for querying the database using Prisma.
- `src/app/api`: Defines all API endpoints.
    - `/event_stream/route.ts`: Endpoint which allows clients to subscribe to server side events. Handles the initial connection of a client to the server.
    - `/event_stream/server_side_events.ts`: Defines the `broadcast()` function which is used to send server side events. This ensures clients stay synced with changes made to the database in real time.
    - `/posts/route.ts`: GET, POST, and DELETE endpoints for updating posts within the database. POST and DELETE endpoints call a `broadcast()` to ensure all clients recieve the changes.
    - `/user/route.ts`: POST request recieves a user from the database, or creates one if the user does not exist yet. DELETE will delete a user from the databse.
