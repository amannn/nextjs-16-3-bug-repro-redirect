import Link from 'next/link';

// Dynamically rendered and reads the `[slug]` param.
export const dynamic = 'force-dynamic';

export default async function Page({
  params
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  return (
    <main>
      <h1 data-testid="page">slug: {slug}</h1>
      {/*
        Links to `/a`, which the proxy redirects to `/`. The expected result
        of clicking is to land on `/` (which is rewritten back to `/a`).
      */}
      <Link href="/a">Go to /a</Link>
    </main>
  );
}
