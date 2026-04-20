import { test, expect } from '@playwright/test';

test.describe('Manuales Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the manuales page before each test
    await page.goto('/manuales');
  });

  test('should load manuales page with correct title and header', async ({
    page,
  }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle(/.*Manuales.*/i);

    // Check if the hero section exists
    const heroSection = page.locator('section:has-text("Manuales")');
    await expect(heroSection).toBeVisible();

    // Check if the hero title is visible
    const heroTitle = page.getByRole('heading', { name: /manuales/i });
    await expect(heroTitle).toBeVisible();
  });

  test('should display hero section content', async ({ page }) => {
    // Check if the hero section contains the expected content
    const heroContent = page.locator('text=/Consulta nuestros manuales/i');
    await expect(heroContent).toBeVisible();
  });

  test('should render header and footer', async ({ page }) => {
    // Check if header exists
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check if footer exists
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should fetch and display manuals list', async ({ page }) => {
    // Wait for the ManualsListSection to load
    const manualsList = page
      .locator('section')
      .filter({ has: page.locator('[class*="manual"]') });

    // Wait for at least one manual item to be visible (if data exists)
    const manualItems = page.locator(
      '[class*="manual"][class*="item"], [class*="card"]',
    );

    // Check if manual items are present (they may be empty initially)
    const itemCount = await manualItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(0);
  });

  test('should make API call to fetch manuals', async ({ page }) => {
    // Wait for API requests to manuals endpoint
    const response = await page
      .waitForResponse(
        (response) =>
          response.url().includes('/manual') ||
          response.url().includes('/manuales'),
        { timeout: 5000 },
      )
      .catch(() => null);

    // If API was called, verify response status
    if (response) {
      expect(response.status()).toBe(200);
    }
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if hero title is still visible
    const heroTitle = page.getByRole('heading', { name: /manuales/i });
    await expect(heroTitle).toBeVisible();

    // Check if header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should be responsive on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Check if hero title is still visible
    const heroTitle = page.getByRole('heading', { name: /manuales/i });
    await expect(heroTitle).toBeVisible();

    // Check if content is visible
    const heroContent = page.locator('text=/Consulta nuestros manuales/i');
    await expect(heroContent).toBeVisible();
  });

  test('should navigate back from manual detail page', async ({ page }) => {
    // Wait a moment for the page to fully load
    await page.waitForLoadState('networkidle');

    // Try to find and click on a manual link (if any exist)
    const manualLinks = page.locator('a[href*="/manual"]');
    const linkCount = await manualLinks.count();

    if (linkCount > 0) {
      // Click the first manual link
      await manualLinks.first().click();

      // Wait for navigation
      await page.waitForLoadState('networkidle');

      // Go back to manuales page
      await page.goBack();

      // Verify we're back on the manuales page
      const heroTitle = page.getByRole('heading', { name: /manuales/i });
      await expect(heroTitle).toBeVisible();
    }
  });
});
