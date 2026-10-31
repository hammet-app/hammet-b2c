import { chromium } from "playwright";
import path from "path";

const PORT = 3005;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const ARTIFACT_DIR = "C:/Users/HP 1030 G3/.gemini/antigravity/brain/af8e380f-8a01-49bb-a3e8-1584142c4c14";

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
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await seedAuth(page);

  // 1. Verify /learner/ai-schools
  console.log("Navigating to /learner/ai-schools...");
  await page.goto(`${BASE_URL}/learner/ai-schools`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const hoursTag = page.locator("text=Hours of Curriculum").first();
  const labsTag = page.locator("text=Practical Labs & Projects").first();
  const old60 = page.locator("text=60+ Hours of Curriculum");
  const old44 = page.locator("text=44 Practical Labs & Projects");

  const hasHours = (await hoursTag.count()) > 0;
  const hasLabs = (await labsTag.count()) > 0;
  const hasOld60 = (await old60.count()) > 0;
  const hasOld44 = (await old44.count()) > 0;

  console.log("Found 'Hours of Curriculum':", hasHours);
  console.log("Found 'Practical Labs & Projects':", hasLabs);
  console.log("Old '60+ Hours of Curriculum' present:", hasOld60);
  console.log("Old '44 Practical Labs & Projects' present:", hasOld44);

  if (!hasHours || !hasLabs || hasOld60 || hasOld44) {
    throw new Error("Figures 60 / 44 verification failed on /learner/ai-schools!");
  }

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "verified-ai-schools-no-figures.png"),
    fullPage: false,
  });
  console.log("Saved verified-ai-schools-no-figures.png");

  // 2. Verify /learner/projects
  console.log("Navigating to /learner/projects...");
  await page.goto(`${BASE_URL}/learner/projects`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const workspaceBadge = page.locator("text=Project Workspace").first();
  const oldCapstone = page.locator("text=// CAPSTONE LABS");

  const hasWorkspace = (await workspaceBadge.count()) > 0;
  const hasOldCapstone = (await oldCapstone.count()) > 0;

  console.log("Found 'Project Workspace':", hasWorkspace);
  console.log("Old '// CAPSTONE LABS' present:", hasOldCapstone);

  if (!hasWorkspace || hasOldCapstone) {
    throw new Error("Capstone badge removal verification failed on /learner/projects!");
  }

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "verified-projects-workspace-badge.png"),
    fullPage: false,
  });
  console.log("Saved verified-projects-workspace-badge.png");

  await browser.close();
  console.log("\n ALL CONTENT UPDATES VERIFIED SUCCESSFULLY!");
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});

