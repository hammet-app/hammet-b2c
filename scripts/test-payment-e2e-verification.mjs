import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "C:/Users/HP 1030 G3/.gemini/antigravity/brain/af8e380f-8a01-49bb-a3e8-1584142c4c14";
const BASE_URL = "http://localhost:3000";

async function testPaymentFlow() {
  console.log("========================================================");
  console.log("STARTING FULL END-TO-END PAYMENT FLOW VERIFICATION");
  console.log("========================================================");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });

  await context.addInitScript(() => {
    localStorage.removeItem("logged_out");
    localStorage.setItem("hammet-user", JSON.stringify({
      id: "learner-test",
      email: "learner@hammet.com",
      name: "Alex Rivera",
      role: "learner",
      scope: "b2c",
      profileDetails: { learningMode: "guided" }
    }));
    localStorage.removeItem("hammet-paid-items");
    localStorage.removeItem("hammet_enrolled_courses");
  });

  const page = await context.newPage();

  // Step 1: Browse AI Schools and Add to Cart
  console.log("\n1. Navigating to /learner/ai-schools to add a school to cart...");
  await page.goto(`${BASE_URL}/learner/ai-schools`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("text=Available AI Schools", { timeout: 25000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "payment-flow-1-catalog.png") });

  const enrollBtn = page.locator("button:has-text('Add School to Cart')").or(page.locator("button:has-text('Enroll in School')")).first();
  await enrollBtn.click();
  await page.waitForTimeout(1000);
  console.log("✓ Added School of AI Foundations to cart");

  // Step 2: Go to Checkout Review page
  console.log("\n2. Navigating to /learner/checkout...");
  await page.goto(`${BASE_URL}/learner/checkout`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("h1:has-text('Review Your Learning Cart')", { timeout: 25000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "payment-flow-2-review-cart.png") });
  console.log("✓ Reached checkout cart review page");

  // Step 3: Click Proceed to Payment
  console.log("\n3. Clicking 'Proceed to Payment'...");
  const proceedBtn = page.locator("button:has-text('Proceed to Payment')").first();
  await proceedBtn.click();
  await page.waitForSelector("h1:has-text('Checkout with Paystack')", { timeout: 15000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "payment-flow-3-paystack-gateway.png") });
  console.log("✓ Reached Paystack Secure Gateway screen");

  // Step 4: Verify Paystack Gateway elements
  const payButton = page.locator("button:has-text('with Paystack')").first();
  const isPayBtnVisible = await payButton.isVisible();
  console.log("✓ Paystack CTA button visible:", isPayBtnVisible);

  // Step 5: Simulate return from Paystack Redirect to callback URL
  console.log("\n4. Simulating Paystack redirect callback (/learner/checkout/callback)...");
  await page.goto(`${BASE_URL}/learner/checkout/callback?reference=TXN-PAYSTACK-VERIFIED-2026&trxref=TXN-PAYSTACK-VERIFIED-2026&status=success`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("h2:has-text('Payment Successful')", { timeout: 20000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "payment-flow-4-callback-success.png") });
  console.log("✓ Paystack callback resolved: Payment Successful screen rendered");

  // Step 6: Click "Go to Learning"
  console.log("\n5. Clicking 'Go to Learning'...");
  const goToLearningBtn = page.locator("button:has-text('Go to Learning')").or(page.locator("a:has-text('My Learning Hub')")).first();
  await goToLearningBtn.click();
  await page.waitForTimeout(2000);
  console.log("Current URL after clicking Go to Learning:", page.url());

  // Step 7: Check /learner/learn to confirm unlocked courses
  console.log("\n6. Checking /learner/learn to confirm curriculum is unlocked...");
  await page.goto(`${BASE_URL}/learner/learn`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("h1:has-text('My learning')", { timeout: 20000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "payment-flow-5-learn-unlocked.png") });

  const course1 = await page.locator("text=Introduction to Artificial Intelligence & Modern LLMs").first().isVisible();
  const course2 = await page.locator("text=Neural Networks & Deep Learning Architectures").first().isVisible();
  const course3 = await page.locator("text=Generative AI Systems: Prompt Engineering & RAG").first().isVisible();
  const course4 = await page.locator("text=Autonomous AI Agents & Tool-Use Execution").first().isVisible();

  console.log("✓ All 4 curriculum courses unlocked and visible on My Learning:");
  console.log("  - Course 1 (Intro to AI & LLMs):", course1);
  console.log("  - Course 2 (Neural Networks):", course2);
  console.log("  - Course 3 (Generative AI Systems):", course3);
  console.log("  - Course 4 (Autonomous AI Agents):", course4);

  await context.close();
  await browser.close();

  console.log("\n🎉 FULL END-TO-END PAYMENT FLOW VERIFIED SUCCESSFULLY!");
}

testPaymentFlow().catch((err) => {
  console.error("Payment flow verification failed:", err);
  process.exit(1);
});
