import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "C:/Users/HP 1030 G3/.gemini/antigravity/brain/af8e380f-8a01-49bb-a3e8-1584142c4c14";
const BASE_URL = "http://localhost:3000";

async function verifyHover() {
  console.log("Starting Playwright verification of text-only cursor hover...");
  const browser = await chromium.launch({ headless: true });

  // 1. Light Mode Verification
  const contextLight = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  await contextLight.addInitScript(() => {
    localStorage.removeItem("logged_out");
    localStorage.setItem("hammet-user", JSON.stringify({
      id: "learner-test",
      email: "learner@hammet.com",
      name: "Alex Rivera",
      role: "learner",
      scope: "b2c",
    }));
  });

  const pageLight = await contextLight.newPage();
  await pageLight.goto(`${BASE_URL}/learner/learn`, { waitUntil: "domcontentloaded" });
  await pageLight.waitForSelector("text=School of AI foundation", { timeout: 20000 });

  const aiSchoolLinkLight = pageLight.locator("a:has-text('School of AI foundation')").first();
  const textSpanLight = aiSchoolLinkLight.locator("span").first();

  // Before hover
  const colorBefore = await textSpanLight.evaluate((el) => window.getComputedStyle(el).color);
  const bgBefore = await aiSchoolLinkLight.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  const textBgBefore = await textSpanLight.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  console.log("Light Mode - Before Hover:");
  console.log("  Text color:", colorBefore);
  console.log("  Link background:", bgBefore);
  console.log("  Text background:", textBgBefore);

  // Hover cursor over School of AI foundation
  await aiSchoolLinkLight.hover();
  await pageLight.waitForTimeout(300);

  const colorAfter = await textSpanLight.evaluate((el) => window.getComputedStyle(el).color);
  const bgAfter = await aiSchoolLinkLight.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  const textBgAfter = await textSpanLight.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  const textShadowAfter = await textSpanLight.evaluate((el) => window.getComputedStyle(el).textShadow);

  console.log("\nLight Mode - After Hovering Cursor:");
  console.log("  Text color (changed to purple):", colorAfter);
  console.log("  Link background (must be transparent/none):", bgAfter);
  console.log("  Text background (must be transparent/none):", textBgAfter);
  console.log("  Text shadow (must be none):", textShadowAfter);

  await pageLight.screenshot({
    path: path.join(ARTIFACT_DIR, "verify-hover-light-mode.png"),
    clip: { x: 0, y: 0, width: 300, height: 400 }
  });

  // 2. Dark Mode Verification
  const contextDark = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  await contextDark.addInitScript(() => {
    localStorage.removeItem("logged_out");
    localStorage.setItem("hammet-theme", "dark");
    localStorage.setItem("hammet-user", JSON.stringify({
      id: "learner-test",
      email: "learner@hammet.com",
      name: "Alex Rivera",
      role: "learner",
      scope: "b2c",
    }));
  });

  const pageDark = await contextDark.newPage();
  await pageDark.goto(`${BASE_URL}/learner/learn`, { waitUntil: "domcontentloaded" });
  await pageDark.evaluate(() => document.documentElement.classList.add("dark"));
  await pageDark.waitForSelector("text=School of AI foundation", { timeout: 20000 });

  const aiSchoolLinkDark = pageDark.locator("a:has-text('School of AI foundation')").first();
  const textSpanDark = aiSchoolLinkDark.locator("span").first();

  await aiSchoolLinkDark.hover();
  await pageDark.waitForTimeout(300);

  const colorDarkAfter = await textSpanDark.evaluate((el) => window.getComputedStyle(el).color);
  const bgDarkAfter = await aiSchoolLinkDark.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  const textBgDarkAfter = await textSpanDark.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  const textShadowDarkAfter = await textSpanDark.evaluate((el) => window.getComputedStyle(el).textShadow);

  console.log("\nDark Mode - After Hovering Cursor:");
  console.log("  Text color (changed to purple-300):", colorDarkAfter);
  console.log("  Link background (must be transparent/none):", bgDarkAfter);
  console.log("  Text background (must be transparent/none):", textBgDarkAfter);
  console.log("  Text shadow (must be none):", textShadowDarkAfter);

  await pageDark.screenshot({
    path: path.join(ARTIFACT_DIR, "verify-hover-dark-mode.png"),
    clip: { x: 0, y: 0, width: 300, height: 400 }
  });

  await browser.close();
  console.log("\n✓ Verification complete! Screenshots saved.");
}

verifyHover().catch((err) => {
  console.error(err);
  process.exit(1);
});
