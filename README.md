# Next.js: proxy redirect not applied to the URL on client-side navigation

Minimal reproduction (no dependencies beyond `next`/`react`) of a regression in
`next@16.3.0-preview.5`.

## Affected versions

| Next.js | Result |
| --- | --- |
| `16.2.9` | works ✅ (URL becomes `/`) |
| `16.3.0-preview.5` | broken ❌ (URL stays `/a`) |

## The bug

A [proxy](./proxy.ts) (formerly "middleware") redirects `/a` to `/`, and `/` is
rewritten to the dynamic `/a` page:

```ts
//   /a -> redirect to /
//   /  -> rewrite to /a
```

`app/[slug]/page.tsx` is dynamically rendered and reads its route `params`.

When you navigate to `/a`:

- **Hard navigation** to `/a` (typing the URL, reloading, `curl`) is redirected
  to `/` ✅
- **Client-side navigation** to `/a` (clicking `<Link href="/a">` or
  `router.push('/a')`) is **not** applied to the URL on 16.3. The browser
  commits the link's href (`/a`); the 307 redirect to `/` is never reflected in
  the address bar — even though the request is made and the redirected content
  is rendered. ❌

So after the click you see the redirected content under the wrong `/a` URL.

### Required ingredients

All three are needed to trigger the bug:

1. A **client-side** navigation (a plain hard navigation redirects correctly).
2. The redirect **target is rewritten** (a plain redirect to a normal route is
   followed correctly).
3. The rewritten page is **dynamically rendered and reads route `params`** (a
   statically prerendered, or non-param, target is resolved correctly).

This lines up with the dynamic-route shell changes in Next.js 16.3
("Instant Navigations") and the known issue around accessing `params` in a
route shell.

## Steps to reproduce

```sh
npm install
npm run build
npm start
```

1. Open http://localhost:3000/two
2. Click **"Go to /a"**
3. Expected: the URL becomes `/`.
4. Actual (16.3 preview): the URL stays `/a`.

A hard request still redirects correctly:

```sh
curl -so /dev/null -w "%{http_code} -> %{redirect_url}\n" http://localhost:3000/a
# 307 -> http://localhost:3000/
```

## Automated reproduction

```sh
npm install
npx playwright install chromium
npm test
```

`tests/repro.spec.ts`:

- `hard navigation to /a redirects to /` — passes
- `client-side navigation to /a should redirect to /` — **fails on 16.3**

To verify it works on the previous release, `npm install next@16.2.9` and run
the tests again — both pass.

## Environment

- `next@16.3.0-preview.5`
- `react@19.2.3`, `react-dom@19.2.3`
- App Router, dynamic `[slug]` segment
