# Mustache Playground

Client-side web app to experiment with [Mustache](https://mustache.github.io/) templates. Paste a template and a JSON view, see the rendered result live — as raw text and as a Markdown preview.

Built for authoring Markdown-emitting templates (`**bold**`, links, `{{{unescaped}}}` triple-mustache).

## Features

- **Template** and **JSON view** editor panes, pre-seeded with a working example
- Live render on every keystroke (via [`mustache`](https://www.npmjs.com/package/mustache))
- **Raw output** pane — literal rendered string, whitespace preserved
- **Markdown preview** pane — output rendered to HTML (via [`marked`](https://www.npmjs.com/package/marked))
- **Format JSON** button
- Graceful errors — malformed JSON or a broken template shows an inline error instead of crashing
- Light/dark theme, responsive layout

## Requirements

- Node.js 18+ (developed on Node 22)

## Getting started

```bash
npm install
npm run dev
```

Open the printed URL (default http://localhost:5173/).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |

## How it works

`src/App.jsx` holds the entire app:

1. `JSON.parse(jsonText)` — parse the view (errors surfaced inline).
2. `Mustache.render(template, view)` — render the template (errors surfaced inline).
3. `marked.parse(rendered)` — render the output string to HTML for the preview.

All in the browser. No backend, no persistence.

## Tech stack

- Vite + React 18
- `mustache` — template rendering
- `marked` — Markdown to HTML

## Notes

Markdown preview injects rendered HTML via `dangerouslySetInnerHTML`. Fine for a local dev-only playground; do **not** expose this to untrusted input without sanitizing (e.g. DOMPurify).
