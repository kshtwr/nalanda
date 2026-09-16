# Nalanda

A personal knowledge capture tool: highlight text on any webpage, save it to your account, and revisit your highlights in a dashboard — with the original highlight automatically restored on the page when you return. Ask an AI assistant questions across everything you've saved, and it answers using your own highlights as its source, with links back to exactly where each answer came from.

**[Install on Chrome Web Store](https://chromewebstore.google.com/detail/nalanda-web-highlighter-d/hdlbgaocldooigilaoeaplmhjkgddfal)** · **[View Dashboard](https://mynalanda.vercel.app/)** · **[Demo Video](https://www.youtube.com/watch?v=0pvSvrw-lXs)**

## What it does

- **Capture** — select text on any webpage, click the button that appears, and the highlight is saved with its source URL and surrounding context
- **Rehighlight** — revisit a page and previously saved highlights are automatically re-marked in place, even when the highlighted text spans multiple paragraphs, links, list items, or contains inline footnote markers (e.g. Wikipedia-style `[1]` references)
- **Dashboard** — a web app showing all your highlights in a masonry grid, with source links and timestamps
- **Ask** — a RAG-powered chat on the dashboard answers questions using only your own highlights as context, with clickable source citations that scroll you back to the exact highlight
- **Auth** — sign in with Google; each user only sees and saves their own highlights, enforced at the database level via Row-Level Security

## How it's built

**Chrome Extension (Manifest V3)**
- Vanilla JS content script detects text selection and renders a save button
- [mark.js](https://markjs.io/) re-applies highlights on page load, using a custom regex-based matching strategy to handle text that spans across DOM elements
- A background service worker handles Google OAuth via `chrome.identity`, independent of any webpage's session, and opens the dashboard automatically on first install for onboarding

**Dashboard (Next.js 15, App Router)**
- Server-rendered pages with `@supabase/ssr` for session-aware data fetching
- Protected routes via Next.js proxy (middleware), redirecting unauthenticated users to a login page
- Tailwind CSS for styling, `react-masonry-css` for the highlight grid layout
- A chat interface (AI SDK v7 `useChat`) streams responses and renders collapsible, per-message source citations

**Backend (Supabase)**
- Postgres database with Row-Level Security policies scoped to `auth.uid()`
- Google OAuth provider for authentication, shared across the extension and dashboard
- `pgvector` extension storing a 1536-dim embedding per highlight for similarity search

**RAG pipeline**
- A database webhook fires on every highlight insert, calling a Supabase Edge Function (Deno) that embeds the highlight's content with OpenAI `text-embedding-3-small` and writes the vector back to the row — embeddings generation stays decoupled from the extension and dashboard entirely
- Queries are answered via a `match_highlights` Postgres function doing cosine similarity search (`embedding <=> query_embedding`) scoped to `user_id`, so RLS-equivalent isolation holds even for vector search
- A two-pass query router keeps cost and relevance balanced: a hotword pass (e.g. "everything", "summarize", "all") flags queries that might need broader context; flagged queries go through a cheap `gpt-3.5-turbo` intent classification (meta vs. broad-specific) that decides whether to fetch the full highlight set or a wider top-k similarity match, while unflagged queries go straight to a tight top-5 similarity search
- A similarity threshold gates whether retrieved highlights are used as context at all, letting the assistant fall back to plain conversation (e.g. "tell me more") instead of forcing irrelevant highlights into every answer
- Responses stream from `gpt-4o-mini` via `streamText`, with the retrieved highlights' ids and content returned alongside the stream in a response header and rendered as clickable source chips once the message finishes

## Notable engineering challenges

- **Cross-element text matching** — browser text selections don't map cleanly onto the DOM's text node structure. Solved by building a dynamic regex from the saved highlight text that tolerates whitespace differences and inline elements (links, footnotes) between matched segments.
- **Extension authentication** — content scripts have no persistent state and can't share sessions with a separate dashboard origin. Solved with a background service worker that performs its own OAuth flow via `chrome.identity.launchWebAuthFlow` and persists the session in `chrome.storage`.
- **Next.js 16 migration quirks** — adapted to the `middleware` → `proxy` rename and Turbopack workspace-root resolution in monorepo-style layouts.
- **Meta queries vs. vector search** — "summarize everything I've saved" defeats top-k similarity search, since no single embedding is "most similar" to the whole knowledge base. Solved with hotword detection gating a cheap LLM classification pass that reroutes such queries to a full-table fetch instead of a similarity search.
- **Passing retrieved sources to the UI without polluting the message stream** — the AI SDK v7 UI message stream has no clean channel for arbitrary side-band data. Solved by returning source metadata in a response header, read client-side via a custom `fetch` wrapper on the chat transport before the stream is consumed.

## Status

Live. Extension (v2) is published on the Chrome Web Store with the RAG assistant, and the dashboard is deployed on Vercel.

**Planned:**
- Different highlight colors for a folder-based categorization system
