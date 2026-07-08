# Nalanda

A personal knowledge capture tool: highlight text on any webpage, save it to your account, and revisit your highlights in a dashboard — with the original highlight automatically restored on the page when you return.

**[Install on Chrome Web Store](https://chromewebstore.google.com/detail/nalanda-web-highlighter-d/hdlbgaocldooigilaoeaplmhjkgddfal)** · **[View Dashboard](https://mynalanda.vercel.app/)** · **[Demo Video](https://www.youtube.com/watch?v=dzeM2ZCz9AU)**

## What it does

- **Capture** — select text on any webpage, click the button that appears, and the highlight is saved with its source URL and surrounding context
- **Rehighlight** — revisit a page and previously saved highlights are automatically re-marked in place, even when the highlighted text spans multiple paragraphs, links, list items, or contains inline footnote markers (e.g. Wikipedia-style `[1]` references)
- **Dashboard** — a web app showing all your highlights in a masonry grid, with source links and timestamps
- **Auth** — sign in with Google; each user only sees and saves their own highlights, enforced at the database level via Row-Level Security

## How it's built

**Chrome Extension (Manifest V3)**
- Vanilla JS content script detects text selection and renders a save button
- [mark.js](https://markjs.io/) re-applies highlights on page load, using a custom regex-based matching strategy to handle text that spans across DOM elements
- A background service worker handles Google OAuth via `chrome.identity`, independent of any webpage's session

**Dashboard (Next.js 15, App Router)**
- Server-rendered pages with `@supabase/ssr` for session-aware data fetching
- Protected routes via Next.js proxy (middleware), redirecting unauthenticated users to a login page
- Tailwind CSS for styling, `react-masonry-css` for the highlight grid layout

**Backend (Supabase)**
- Postgres database with Row-Level Security policies scoped to `auth.uid()`
- Google OAuth provider for authentication, shared across the extension and dashboard

## Notable engineering challenges

- **Cross-element text matching** — browser text selections don't map cleanly onto the DOM's text node structure. Solved by building a dynamic regex from the saved highlight text that tolerates whitespace differences and inline elements (links, footnotes) between matched segments.
- **Extension authentication** — content scripts have no persistent state and can't share sessions with a separate dashboard origin. Solved with a background service worker that performs its own OAuth flow via `chrome.identity.launchWebAuthFlow` and persists the session in `chrome.storage`.
- **Next.js 16 migration quirks** — adapted to the `middleware` → `proxy` rename and Turbopack workspace-root resolution in monorepo-style layouts.

## Status

Live. Extension is published on the Chrome Web Store and the dashboard is deployed on Vercel.

**Version 2 planned:**
- A RAG-based AI assistant that lets you query your personally curated knowledge base (second brain)
- Different highlight colors for a folder-based categorization system
