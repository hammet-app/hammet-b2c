import { chromium } from "playwright";

async function debugCourses() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addInitScript(() => {
    localStorage.removeItem("logged_out");
    localStorage.setItem("hammet-user", JSON.stringify({
      id: "learner-test",
      email: "learner@hammet.com",
      name: "Alex Rivera",
      role: "learner",
      scope: "b2c",
    }));
  });

  const page = await context.newPage();
  page.on("response", async (res) => {
    if (res.url().includes("ai-schools") || res.url().includes("courses")) {
      console.log(`\n[HTTP ${res.status()}] ${res.url()}`);
      try {
        const json = await res.json();
        console.log("JSON response:", JSON.stringify(json, null, 2));
      } catch {
        console.log("Text response:", (await res.text()).slice(0, 200));
      }
    }
  });

  console.log("1. Navigating to /learner/ai-schools...");
  await page.goto("http://localhost:3000/learner/ai-schools", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);

  const exploreBtn = page.locator("button:has-text('Explore School Curriculum')").first();
  if (await exploreBtn.isVisible()) {
    console.log("\n2. Clicking Explore School Curriculum...");
    await exploreBtn.click();
    await page.waitForTimeout(4000);
    console.log("Navigated to:", page.url());

    const bodyText = await page.locator("body").innerText();
    console.log("\n3. Page body snippet:\n", bodyText.slice(0, 500));
  } else {
    console.log("Explore button not visible");
  }

  await browser.close();
}

debugCourses().catch(console.error);

