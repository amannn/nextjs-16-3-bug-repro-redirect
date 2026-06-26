import Link from 'next/link';

// The page is dynamically rendered (like a localized page that reads the
// request). This is required to trigger the bug: when the redirect target is
// statically prerendered, the client resolves it correctly.
export const dynamic = 'force-dynamic';

export default async function LocalePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const other = locale === 'en' ? 'de' : 'en';
  return (
    <main>
      <h1 data-testid="page">{locale} page</h1>
      {/*
        Force-prefixed link to the other locale. Switching to the default
        locale (`en`) targets `/en`, which the proxy redirects to `/`.
      */}
      <Link href={`/${other}`}>
        Switch to {other}
      </Link>
    </main>
  );
}
