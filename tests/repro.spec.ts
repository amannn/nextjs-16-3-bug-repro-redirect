import {test, expect} from '@playwright/test';

// Hard navigation: the proxy redirect IS followed.
// `/en` -> `/` (which is rewritten to the `en` page). Passes on 16.3.
test('hard navigation to /en redirects to /', async ({page}) => {
  await page.goto('/en');
  await expect(page).toHaveURL('/');
  await expect(page.getByTestId('page')).toHaveText('en page');
});

// Client-side (soft) navigation: the proxy redirect is NOT followed on
// Next.js 16.3 preview, so the URL stays on `/en` instead of `/`.
// This FAILS, demonstrating the regression.
test('client-side navigation from /de to /en should redirect to /', async ({
  page
}) => {
  await page.goto('/de');
  await page.getByRole('link', {name: 'Switch to en'}).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByTestId('page')).toHaveText('en page');
});
