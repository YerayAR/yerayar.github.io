const { test, expect } = require('@playwright/test');
const path = require('path');

function fileUrl(fileName) {
  const built = path.resolve(__dirname, '..', '_site', fileName);
  const src = path.resolve(__dirname, '..', fileName);
  const filePath = require('fs').existsSync(built) ? built : src;
  return 'file://' + filePath;
}

test('python viz unit tests pass', async ({ page }) => {
  await page.goto(fileUrl('python-viz.test.html'));
  const output = page.locator('#test-results');
  await expect(output).toContainText('Failed: 0');
});

test('chat unit tests pass', async ({ page }) => {
  await page.goto(fileUrl('chat.test.html'));
  const output = page.locator('#test-results');
  await expect(output).toContainText('Failed: 0');
});

test('nav dropdown opens and closes', async ({ page }) => {
  await page.goto(fileUrl('index.html'));
  const toggle = page.locator('.nav-dropdown-toggle');
  await toggle.click();
  await expect(page.locator('.nav-dropdown')).toHaveClass(/open/);
  await page.click('body', { position: { x: 5, y: 5 } });
  await expect(page.locator('.nav-dropdown')).not.toHaveClass(/open/);
});
