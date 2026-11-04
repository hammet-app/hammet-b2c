import { spawn } from "child_process";
import http from "http";

const PORT = 3005;

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${PORT}`, (res) => {
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  console.log(`Checking if 127.0.0.1:${PORT} is already active...`);
  let alreadyRunning = await checkServer();
  let serverProcess = null;

  if (!alreadyRunning) {
    console.log(`Starting Next.js dev server on port ${PORT}...`);
    serverProcess = spawn("npx", ["next", "dev", "--webpack", "-H", "127.0.0.1", "-p", PORT.toString()], {
      stdio: "pipe",
      shell: true,
      detached: false,
    });

    let isReady = false;

    serverProcess.stdout.on("data", (d) => {
      const str = d.toString();
      console.log("[Next.js]", str.trim());
      if (str.includes("Ready in") || str.includes("✓ Ready")) {
        isReady = true;
      }
    });

    serverProcess.stderr.on("data", (d) => {
      console.error("[Next.js stderr]", d.toString().trim());
    });

    console.log(`Waiting for Next.js dev server on http://127.0.0.1:${PORT}...`);
    const start = Date.now();
    while (Date.now() - start < 80000) {
      if (isReady) {
        console.log("Detected Next.js Ready signal from stdout!");
        break;
      }
      const ok = await checkServer();
      if (ok) {
        console.log("Detected HTTP response from 127.0.0.1:" + PORT);
        break;
      }
      await new Promise((r) => setTimeout(r, 1000));
    }

    // Give it 1 second to settle
    await new Promise((r) => setTimeout(r, 1500));
    console.log("Next.js dev server is ready!");
  } else {
    console.log(`Server is already running on port ${PORT}.`);
  }

  // Now run the verification script
  console.log("Running Playwright mobile verification...");
  const testProc = spawn("node", ["scripts/verify-mobile-nav.mjs"], {
    stdio: "inherit",
    shell: true,
  });

  const testExitCode = await new Promise((resolve) => {
    testProc.on("close", resolve);
  });

  if (serverProcess) {
    console.log("Shutting down Next.js dev server...");
    try {
      spawn("taskkill", ["/PID", serverProcess.pid.toString(), "/T", "/F"], { shell: true });
    } catch {
      serverProcess.kill();
    }
  }

  if (testExitCode !== 0) {
    console.error("Verification tests failed with exit code:", testExitCode);
    process.exit(testExitCode);
  } else {
    console.log("\n All verification tests completed successfully!");
  }
}

main().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
