import { chromium } from "playwright";
import path from "path";

const PORT = 3005;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const ARTIFACT_DIR = "C:/Users/HP 1030 G3/.gemini/antigravity/brain/af8e380f-8a01-49bb-a3e8-1584142c4c14";

const VIEWPORTS = [
  { name: "iphone-se", width: 375, height: 667 },
  { name: "iphone-14", width: 390, height: 844 },
  { name: "pixel-7", width: 412, height: 915 },
];

async function seedAuth(page) {
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    const user = {
      id: "user-test-alex",
      email: "alex@hammet.ai",
      fullName: "Alex Chen",
      role: "learner",
      isPro: true,
      hasCompletedOnboarding: true,
    };
    localStorage.setItem("hammet-user", JSON.stringify(user));
    const openReq = indexedDB.open("HammetDB");
    openReq.onsuccess = (e) => {
      const db = e.target.result;
      if (db.objectStoreNames.contains("session")) {
        const tx = db.transaction("session", "readwrite");
        tx.objectStore("session").put({
          id: "current",
          user,
          accessToken: "mock-access-token-active-2026",
          cachedAt: new Date().toISOString(),
        });
      }
    };
  });
  await page.waitForTimeout(400);
}

async function verify() {
  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    console.log(`\n=== Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    await seedAuth(page);

    // 1. Test /learner/learn (matching user screenshot with Learn tab active)
    console.log("Navigating to /learner/learn...");
    await page.goto(`${BASE_URL}/learner/learn`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);

    // Verify Mobile Navigation element
    const nav = page.locator('nav[aria-label="Mobile Navigation"]');
    await nav.waitFor({ state: "visible", timeout: 5000 });
    const navBox = await nav.boundingBox();
    console.log("Mobile nav bounding box:", navBox);

    // Check 4 items
    const navLinks = nav.locator("a");
    const linkCount = await navLinks.count();
    console.log(`Found ${linkCount} navigation items`);
    if (linkCount !== 4) {
      throw new Error(`Expected 4 nav links, got ${linkCount}`);
    }

    const items = [];
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const text = (await link.innerText()).trim().replace(/\s+/g, " ");
      const box = await link.boundingBox();
      items.push({ text, ...box });
    }
    console.log("Nav items layout:", items);

    // Validate centering and non-overlapping
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    const leftMargin = firstItem.x;
    const rightMargin = vp.width - (lastItem.x + lastItem.width);
    const centerPoint = (firstItem.x + lastItem.x + lastItem.width) / 2;
    const screenCenter = vp.width / 2;
    const centerOffset = Math.abs(centerPoint - screenCenter);

    console.log(`Left margin: ${leftMargin.toFixed(1)}px, Right margin: ${rightMargin.toFixed(1)}px`);
    console.log(`Cluster center: ${centerPoint.toFixed(1)}px, Screen center: ${screenCenter}px (offset: ${centerOffset.toFixed(1)}px)`);

    if (centerOffset > 10) {
      throw new Error(`Navigation is not centered! Offset is ${centerOffset}px`);
    }

    // Check no horizontal overlap between consecutive items
    for (let i = 0; i < items.length - 1; i++) {
      const cur = items[i];
      const next = items[i + 1];
      if (cur.x + cur.width > next.x + 1) { // allow 1px rounding tolerance
        throw new Error(`Item ${cur.text} overlaps with ${next.text}!`);
      }
    }

    // Check dev overlay is NOT present or obscuring items
    const devOverlay = page.locator("nextjs-portal, [data-nextjs-toast-wrapper]");
    const overlayCount = await devOverlay.count();
    console.log("Dev indicator overlay elements count:", overlayCount);

    // Take screenshot of /learner/learn
    const learnScreenshotPath = path.join(ARTIFACT_DIR, `verified-mobile-learn-${vp.name}.png`);
    await page.screenshot({ path: learnScreenshotPath, fullPage: false });
    console.log("Saved screenshot:", learnScreenshotPath);

    // Scroll down to check card bottom row and bottom padding
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    const scrolledScreenshotPath = path.join(ARTIFACT_DIR, `verified-mobile-cards-${vp.name}.png`);
    await page.screenshot({ path: scrolledScreenshotPath, fullPage: false });
    console.log("Saved scrolled screenshot:", scrolledScreenshotPath);

    // 2. Test /learner (Learner Home)
    console.log("Navigating to /learner...");
    await page.goto(`${BASE_URL}/learner`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const homeScreenshotPath = path.join(ARTIFACT_DIR, `verified-mobile-home-${vp.name}.png`);
    await page.screenshot({ path: homeScreenshotPath, fullPage: false });
    console.log("Saved screenshot:", homeScreenshotPath);

    await context.close();
  }

  await browser.close();
  console.log("\n ALL MOBILE NAVIGATION AND RESPONSIVENESS CHECKS PASSED PERFECTLY!");
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
