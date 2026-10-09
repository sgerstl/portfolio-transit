import { test, expect, type Page } from '@playwright/test';

// Loads a page and waits for its scripts (the router, the hero) to settle
async function home(page: Page, path = '/') {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

// Scroll position once it has held still for three readings in a row. Back navigation swaps the page in a few
// hundred milliseconds after the URL changes, so a quick double reading can catch the moment before the swap.
async function settledScrollY(page: Page) {
  let last = -1;
  let same = 0;
  for (let i = 0; i < 60; i++) {
    const y = await page.evaluate(() => Math.round(window.scrollY));
    same = y === last ? same + 1 : 0;
    if (same >= 3) return y;
    last = y;
    await page.waitForTimeout(150);
  }
  return last;
}

// The home page is back on screen (its hero exists only there)
async function backHome(page: Page, url: RegExp) {
  await expect(page).toHaveURL(url);
  await expect(page.locator('.hero')).toBeVisible();
}

async function scrollToY(page: Page, y: number) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(y);
  await page.waitForTimeout(300); // let the router record the position
}

// Clicks the card's link without Playwright's scroll-into-view, so the reader's position is the one the test set
async function openCase(page: Page, slug: string) {
  await page.locator(`a.station-link[href="/work/${slug}/"]`).evaluate((a: HTMLAnchorElement) => a.click());
  await expect(page).toHaveURL(new RegExp(`/work/${slug}/$`));
  await page.waitForLoadState('networkidle');
}

test.describe('Back to the cases', () => {
  test('the back link returns to the same scroll position', async ({ page }) => {
    await home(page);
    const y = (await page.viewportSize())!.width < 768 ? 2600 : 1500;
    await scrollToY(page, y);
    await openCase(page, 'ziggy');
    await page.locator('a[data-back]').click();
    await backHome(page, /\/$/);
    expect(await settledScrollY(page)).toBe(y);
  });

  test("the browser's back button does the same", async ({ page }) => {
    await home(page);
    await scrollToY(page, 1500);
    await openCase(page, 'cal');
    await page.goBack();
    await backHome(page, /\/$/);
    expect(await settledScrollY(page)).toBe(1500);
  });

  test('after a header link, back still returns to where the reader was', async ({ page }) => {
    test.skip((await page.viewportSize())!.width < 1200, 'the header links are behind the menu on narrow screens');
    await home(page);
    await page.locator('.nav-primary--desktop a', { hasText: /about/i }).click();
    await expect(page).toHaveURL(/#case-about$/);
    await settledScrollY(page);
    await scrollToY(page, 1700);
    await openCase(page, 'epilog');
    await page.locator('a[data-back]').click();
    await backHome(page, /\/#case-about$/);
    expect(await settledScrollY(page)).toBe(1700);
  });

  test('landing on a case directly, the back link puts that card under the header', async ({ page }) => {
    await page.goto('/work/fleet/');
    await page.waitForLoadState('networkidle');
    await page.locator('a[data-back]').click();
    await backHome(page, /\/#case-fleet$/);
    await settledScrollY(page);
    const top = await page.locator('#case-fleet').evaluate((el) => Math.round(el.getBoundingClientRect().top));
    expect(top).toBeGreaterThanOrEqual(70);
    expect(top).toBeLessThanOrEqual(90);
  });
});

test.describe('Gallery viewer', () => {
  async function openDrawing(page: Page, i = 1) {
    await home(page);
    const tile = page.locator('.gallery-tile').nth(i);
    await tile.scrollIntoViewIfNeeded();
    await settledScrollY(page);
    const y = await page.evaluate(() => Math.round(window.scrollY));
    await tile.click();
    await expect(page.locator('#lightbox')).toHaveClass(/is-open/);
    return y;
  }

  test('arrow keys and buttons move between drawings', async ({ page }) => {
    await openDrawing(page, 1);
    const count = page.locator('.lightbox-count');
    await expect(count).toHaveText('2 / 7');
    await page.keyboard.press('ArrowRight');
    await expect(count).toHaveText('3 / 7');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(count).toHaveText('1 / 7');
    await page.keyboard.press('ArrowLeft');
    await expect(count).toHaveText('7 / 7');
    await page.locator('.lightbox-next').click();
    await expect(count).toHaveText('1 / 7');
  });

  test('back closes the viewer and keeps the page and scroll', async ({ page }) => {
    const y = await openDrawing(page, 2);
    await page.goBack();
    await expect(page.locator('#lightbox')).not.toHaveClass(/is-open/);
    await expect(page).toHaveURL(/\/$/);
    expect(await settledScrollY(page)).toBe(y);
    // and the page is still the home page, not a fresh swap
    await expect(page.locator('.hero')).toBeVisible();
  });

  test('Escape closes, and leaves no extra history behind', async ({ page }) => {
    await openDrawing(page, 0);
    await page.keyboard.press('Escape');
    await expect(page.locator('#lightbox')).not.toHaveClass(/is-open/);
    expect(await page.evaluate(() => !!history.state?.lightbox)).toBe(false);
  });
});

test.describe('Phone layout', () => {
  test('phones skip the hero tiles and the cards carry their figures', async ({ page }) => {
    test.skip((await page.viewportSize())!.width >= 768, 'phone only');
    await home(page);
    await expect(page.locator('.hvf-work')).toBeHidden();
    await expect(page.locator('#case-brightly .station-metric--phone')).toContainText('$1.575B');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});
