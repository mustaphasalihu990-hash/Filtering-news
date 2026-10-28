# NewsHub

NewsHub is a responsive, dark-themed React news dashboard built with Vite. It uses original sample stories rather than a news API, so it runs without an account, API key, or backend. The stories are clearly labeled as samples and are not real-world reporting.

## Run the app

From this folder, install dependencies and start Vite:

```sh
npm install
npm run dev
```

Vite prints a local URL to open in your browser. To check the production build and code style, run:

```sh
npm run build
npm run lint
```

## Project structure

- `src/App.jsx` contains the page and its reusable UI components.
- `src/data/articles.js` contains all 28 sample articles: four for each topic.
- `public/images/` contains the local SVG illustrations used for article thumbnails. Keeping them local avoids broken thumbnails when an external image service is unavailable.
- `src/App.css` contains the dashboard, card, and responsive layout styles.
- `src/index.css` contains global styles, colors, and visible keyboard focus states.

## Components

The components are kept together in `src/App.jsx` so a beginner can follow the flow from the page down to its smaller pieces:

- `App` owns the selected topic, search text, saved article IDs, current view, and number of visible articles.
- `Navbar` renders the desktop navigation, search box, and animated mobile menu. `NavigationItems` shares the same links between desktop and mobile.
- `HeroSection` introduces the demo and links visitors to the stories.
- `CategoryFilter` renders the topic buttons and moves the green active indicator.
- `SearchBar` provides the controlled search input.
- `NewsGrid` and `NewsCard` show the current articles and their bookmark controls.
- `BookmarkButton` toggles one article in or out of the saved list.
- `EmptyState` explains when no stories match.
- `Footer` contains the NewsHub branding and contact links.

## How filtering works

`App` derives the visible list from the source data instead of keeping a separate article list for each topic. Its `useMemo` callback calls JavaScript's `filter()` method on `articles`. For every article, the callback checks:

1. Whether its category matches the selected topic, unless **All** is selected.
2. Whether its headline or summary matches the search text. Searches of one or two characters match whole words, so searching for `AI` does not also match the `ai` inside `repair`.
3. Whether the article is saved, when the **Saved** view is active.

All three checks must pass. This is why selecting **Technology** and searching for `AI` narrows the same list to the matching technology story. `useMemo` recalculates that derived list only when one of its inputs changes.

The search input is controlled by React state: its displayed value comes from `searchQuery`, and each edit updates that state. Category changes and search edits reset the visible page to the first six articles. **Load more stories** increases that limit without changing the filters.

`savedIds` stores the IDs of bookmarked articles. The `toggleSaved` function uses `filter()` to remove an ID that is already saved, or adds it otherwise. Bookmarks stay in React state for the current page session; they are not written to a server or browser storage.

## Motion and React keys

NewsHub uses [Motion for React](https://motion.dev/) from `motion/react`:

- `MotionConfig` applies the user's reduced-motion preference across the interface.
- The hero's `variants` describe its hidden and visible states. `staggerChildren` offsets the heading, description, and call-to-action instead of animating them all at once.
- `AnimatePresence` keeps removed cards mounted long enough to play their exit animation. Each card also has an enter variant; the small per-card delay creates a staggered entrance.
- `layout` lets Motion smoothly reposition the remaining cards after filtering.
- The category indicator uses a shared `layoutId`, which animates the green highlight from one button to the next.
- Hover and tap props give cards and buttons small, quick feedback.

Each article has a stable string `id`, used as the card's React `key`. Stable keys let React recognize the same story between renders, which is important when cards are filtered, reordered, or animated out.

## Try the interactions

1. Choose **Sports**, **Technology**, or another topic and confirm the cards update without a page reload.
2. Select **Technology**, then search for `AI`; one matching story should remain.
3. Clear the search and select a bookmark. Open **Saved** to see it, then remove it from the saved list.
4. Select **Politics** and use **Load more stories** to reveal the remaining topic articles.
5. Search for a phrase with no matches and use the empty state's **Clear filters** action.
6. Resize to a phone-width viewport to try the animated menu and one-column cards.
7. Enable the operating system's reduced-motion setting and check that Motion reduces movement.

The search is intentionally immediate and does not animate on every keystroke. All filtering and saved-story behavior still works when animations are reduced or disabled.
