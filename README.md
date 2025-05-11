This project aims to simplify the user experience when submitting a rating for a service or product by allowing ratings for anything. Client-Server and Event Driven architectures are incorporated to every aspect of this project. A client can make a review, sending an HTTPRequest to the server. The server will then update the database and send and event to all connected clients, letting them see the new rating in real time. This project was built using Next.js for the frontend, Prisma for the ORM, and a PostgreSQL serverless database hosted by Neon for data storage. You can view the deployed website at this URL: https://rate-everything.vercel.app

## Getting Started

1. Download the project.
2. Ensure you have Node.js and npm installed. You can check by running:
    - `node --version`: Version 20.5.1 was used during development.
    - `npm --version`: Version 9.8.0 was used during development.
3. Open a new terminal and navigate to the project's directory.
4. Install necessary dependencies by running `npm install`.
5. Run the development server using `npm run dev`.
6. Open your browser and visit http://localhost:3000 to see the website.

## Project Files

### Frontend

- `src/app`: Contains folders for each webpage
    - `/page.tsx`: Where the browser looks for what to display upon opening the website. Currently redirects to the login screen.
    - `/login/page.tsx`: Contains frontend logic and display of the login page. Sends a HTTPRequest for the entered user and sets context for use across pages.
    - `/home/page.tsx`: Currently only contains a call to `PostFeed` for rendering the review feed.
    - `/home/PostFeed.tsx`: Contains all logic and display for the review feed seen after logging in. Handles the search bar, liking/disliking reviews, and review deletion.
    - `/new_post/page.tsx`: Contains all logic and display for the window which allows users to create a new rating. 
    - `/globals.css`: Contains some of the styling used in the website. Some styling is inlined using Tailwind for simplicity.


### Backend (API Endpoints & Server Side Events)

- `src/app/queries.ts`: Defines functions for querying the database using Prisma.
- `src/app/api`: Defines all API endpoints.
    - `/event_stream/route.ts`: Endpoint which allows clients to subscribe to server side events. Handles the initial connection of a client to the server.
    - `/event_stream/server_side_events.ts`: Defines the `broadcast()` function which is used to send server side events. This ensures clients stay synced with changes made to the database in real time.
    - `/posts/route.ts`: GET, POST, and DELETE endpoints for updating posts within the database. POST and DELETE endpoints call a `broadcast()` to ensure all clients receive the changes.
    - `/user/route.ts`: POST request receives a user from the database, or creates one if the user does not exist yet. DELETE will delete a user from the database.
    - `/vote/route.ts`: POST request updates the vote value in the database, or deletes it if the delete flag is set. GET request for getting all likes & dislikes for a particular user.

### Database

- `prisma/schema.prisma`: Prisma is used for ORM. This file defines the schema for the database used by the website for storing users and posts.


## Known Bugs/Issues

1. If the database has not been accessed recently the database "goes to sleep" and the first fetch times out, requiring the user to refresh the page.
2. Reloading the page while creating a rating prevents the user from being able to submit the rating.
3. When liking/disliking a rating there is a delay while the value is fetched.
4. Other clients don't see real time updates to the like/dislike counter.
