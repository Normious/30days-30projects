import { test, expect } from "@playwright/test";

test("visitor can browse discover and open a project", async ({ page }) => {
  await page.goto("/discover");
  await expect(page.getByRole("heading", { name: "Discover" })).toBeVisible();
});

test("landing shows hero CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Ship. Showcase. Get discovered.").first()).toBeVisible();
});
