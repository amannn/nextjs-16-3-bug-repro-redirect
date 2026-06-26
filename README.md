# Next.js 16.3 preview: proxy redirect not applied to the URL on client-side navigation

Minimal reproduction (no `next-intl`, no third-party deps) of a regression in
`next@16.3.0-preview.5`.

## The bug

A [proxy](./proxy.ts) (formerly "middleware") implements the common i18n
pattern for a default locale with an "as-needed" prefix (default `en`,
secondary `de`):

```ts
//   /     -> rewrite to /en   (default locale served without a prefix)
//   /en   -> redirect to /    (strip the redundant default-locale prefix)
//   /de   -> served as-is
```

The `[locale]` page is **dynamically rendered** (`export const dynamic =
'force-dynamic'`), like a real localized page that reads the request.

When you are on `/de` and click a link to `/en` (e.g. a locale switcher):

- **Hard navigation** to `/en` (typing the URL, reloading, `curl`) is
  redirected to `/` ✅
- **Client-side navigation** to `/en` (clicking `<Link href="/en">` or
  `router.push('/en')`) is **not** applied to the URL on 16.3. The browser
  commits the link's href (`/en`) and the 307 redirect to `/` is never
  reflected in the address bar — even though the request is made and the
  content of `/` is rendered. ❌

So after the click you end up with the `/` content showing under the wrong
`/en` URL. On Next.js 16.2 the URL correctly becomes `/`.

### Required ingredient

The destination must be **dynamically rendered**. If the `[locale]` page is
statically prerendered (remove `export const dynamic = 'force-dynamic'` and add
`generateStaticParams`), the client resolves the redirect correctly and the bug
disappears.

## Steps to reproduce

```sh
npm install
npm run build
npm start
```

1. Open http://localhost:3000/de
2. Click **"Switch to en"**
3. Expected: the URL becomes `/` (showing the English page).
4. Actual (16.3 preview): the URL stays `/en`.

A hard request still redirects correctly:

```sh
curl -so /dev/null -w "%{http_code} -> %{redirect_url}\n" http://localhost:3000/en
# 307 -> http://localhost:3000/
```

## Automated reproduction

```sh
npm install
npx playwright install chromium
npm test
```

`tests/repro.spec.ts` contains:

- `hard navigation to /en redirects to /` — passes
- `client-side navigation from /de to /en should redirect to /` — **fails on 16.3**

## Environment

- `next@16.3.0-preview.5`
- `react@19.2.3`, `react-dom@19.2.3`
- App Router, dynamic `[locale]` segment
