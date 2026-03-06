# User Manager — Oyana Technical Task

A single-page React application built with TypeScript and Vite that interacts with the [ReqRes API](https://reqres.in) to display and manage a list of users.

## Features

- **List & Paginate** — Fetches users from `GET /users?page={n}` with numbered pagination controls
- **Create** — Add new users via `POST /users`; new records appear immediately at the top of the list
- **Edit** — Update any user attribute via `PUT /users/{id}`; changes reflect instantly in the UI
- **Delete** — Remove users via `DELETE /users/{id}` with a confirmation step before removal
- **Search** — Client-side filter by name or email across the current page
- **Optimistic UI** — Since ReqRes is a mock API that doesn't persist data, all mutations are applied to local React state after the API confirms success, mirroring real-world eventual consistency patterns

## Tech Stack

- **React 19** with TypeScript
- **Vite** as the build tool and dev server
- **CSS** (plain `App.css`) with CSS custom properties for theming
- Vanilla `fetch` for API calls — no third-party HTTP client

## Project Structure

```
oyana-user-manager/
├── public/
├── src/
│   ├── api/
│   │   └── users.ts              # All API calls (fetchUsers, createUser, updateUser, deleteUser)
│   ├── assets/
│   ├── components/
│   │   ├── AvatarCell.tsx
│   │   ├── Modal.tsx
│   │   ├── SkeletonRow.tsx
│   │   ├── Toast.tsx
│   │   └── UserFormFields.tsx
│   ├── App.css                   # All styling via CSS variables and class names
│   ├── App.tsx                   # Root component and application logic
│   ├── index.css
│   ├── main.tsx
│   └── types.ts                  # Shared TypeScript interfaces
├── .env.example                  # Template — copy to .env and fill in the API key provided in email submission
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts                # Dev proxy config to handle CORS
```

## Local Setup

### Prerequisites

- Node.js 24
- Git

### Steps

**1. Clone the repository**

```bash
git clone https://github.com/Nyamekesse/oyana-user-management.git
cd oyana-user-management
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure the API key**

The ReqRes API requires an `x-api-key` header on all requests. A temporary API key for this submission has been provided in the submission email.

Copy the example env file and paste in the key:

```bash
cp .env.example .env
```

Then open `.env` and set your key:

```
VITE_REQRES_API_KEY=<provided in email submission>
```

**4. Start the dev server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Design Decisions

**Component separation** — Rather than a single monolithic file, each UI concern lives in its own component file under `src/components/`. This keeps `App.tsx` focused on state and data flow, while components like `Modal`, `Toast`, and `AvatarCell` are independently readable and reusable.

**API layer isolation** — All fetch calls are in `src/api/users.ts`, typed with proper return types and throwing on non-OK responses. This means if the API base URL or auth strategy changes, there's exactly one file to update.

**TypeScript throughout** — All API responses, component props, and form data are fully typed via shared interfaces in `types.ts`, catching shape mismatches at compile time rather than runtime.

**CSS custom properties** — All colours and border radii are defined as CSS variables on `:root` in `App.css`, so visual theming is a single-file change.

**CORS via Vite proxy** — Direct browser requests to `reqres.in` are blocked by CORS on `localhost`. The `vite.config.ts` proxies all `/api/*` requests to `https://reqres.in` server-side, so the browser only ever talks to `localhost`. The API base URL in `users.ts` is `/api` (not the full external URL) to take advantage of this.

**Local ID fallback** — ReqRes returns a mock ID on `POST /users`. A local counter is used as a fallback to ensure newly created users always have a stable React key.

**Skeleton loaders** — Loading states use animated skeletons rather than a spinner to reduce perceived latency and avoid layout shift when data arrives.
