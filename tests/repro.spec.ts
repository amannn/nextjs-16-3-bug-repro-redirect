import {test, expect} from '@playwright/test';

// Hard navigation: the proxy redirect IS followed.
// `/a` -> `/` (which is rewritten back to the `/a` page). Passes on 16.3.
test('hard navigation to /a redirects to /', async ({page}) => {
  await page.goto('/a');
  await expect(page).toHaveURL('/');
  await expect(page.getByTestId('page')).toHaveText('slug: a');
});

// Client-side (soft) navigation: the proxy redirect is NOT applied to the URL
// on Next.js 16.3 preview, so the URL stays on `/a` instead of `/`.
// This FAILS, demonstrating the regression.
test('client-side navigation to /a should redirect to /', async ({page}) => {
  await page.goto('/two');
  await page.getByRole('link', {name: 'Go to /a'}).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByTestId('page')).toHaveText('slug: a');
});
