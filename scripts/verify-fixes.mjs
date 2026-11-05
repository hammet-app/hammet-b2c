import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "C:/Users/HP 1030 G3/.gemini/antigravity/brain/af8e380f-8a01-49bb-a3e8-1584142c4c14";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  // Navigate to login or root to let Dexie initialize, then seed session
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.evaluate(async () => {
    localStorage.setItem(
      "hammet-user",
      JSON.stringify({
        id: "user-test-alex",
        email: "alex@hammet.ai",
        fullName: "Alex Chen",
        role: "learner",
        isPro: true,
        hasCompletedOnboarding: true,
      })
    );
    // Open IndexedDB directly
    const openReq = indexedDB.open("HammetDB");
    openReq.onsuccess = (e) => {
      const db = e.target.result;
      if (db.objectStoreNames.contains("session")) {
        const tx = db.transaction("session", "readwrite");
        tx.objectStore("session").put({
          id: "current",
          user: {
            id: "user-test-alex",
            email: "alex@hammet.ai",
            fullName: "Alex Chen",
            role: "learner",
            isPro: true,
            hasCompletedOnboarding: true,
          },
          accessToken: "mock-access-token-active-2026",
          cachedAt: new Date().toISOString(),
        });
      }
    };
  });
  await page.waitForTimeout(500);

  console.log("1. Visiting /learner/pro...");
  await page.goto("http://localhost:3000/learner/pro", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const badgeSection = page.locator("text=COMING SOON").first();
  if (await badgeSection.count() > 0) {
    await badgeSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "verify-pro-badge-blur.png"), fullPage: false });
  console.log("Saved verify-pro-badge-blur.png");

  console.log("2. Visiting /learner/ai-schools...");
  await page.goto("http://localhost:3000/learner/ai-schools", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "verify-ai-schools-icons.png"), fullPage: false });
  console.log("Saved verify-ai-schools-icons.png");

  console.log("3. Visiting /learner/ai-schools/school-ai-foundations...");
  await page.goto("http://localhost:3000/learner/ai-schools/school-ai-foundations", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "verify-school-foundations-courses.png"), fullPage: false });
  console.log("Saved verify-school-foundations-courses.png");

  console.log("4. Visiting /learner/ai-schools/school-ai-safety...");
  await page.goto("http://localhost:3000/learner/ai-schools/school-ai-safety", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "verify-school-safety-courses.png"), fullPage: false });
  console.log("Saved verify-school-safety-courses.png");

  console.log("5. Visiting /learner/projects...");
  await page.goto("http://localhost:3000/learner/projects", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "verify-projects-courses-unlocked.png"), fullPage: false });
  console.log("Saved verify-projects-courses-unlocked.png");

  await browser.close();
  console.log("All verifications completed!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

