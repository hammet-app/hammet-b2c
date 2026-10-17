import { OpenFeature, InMemoryProvider } from "@openfeature/web-sdk";
import { GrowthbookClientProvider } from "@openfeature/growthbook-client-provider";

const clientKey = process.env.FEATURE_CLIENT_KEY;

const gbContext = {
  apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST || "https://cdn.growthbook.io",
  clientKey: clientKey || "",
};

let initPromise: Promise<void> | null = null;

function ensureInitialized() {
  if (!initPromise) {
    console.log("About to initialize OpenFeature")
    if (!clientKey) {
      // In environments without a GrowthBook client key configured (e.g. local dev / testing),
      // register an InMemoryProvider so OpenFeature is initialized and evaluates default values cleanly without error logs.
      OpenFeature.setProvider(new InMemoryProvider());
      initPromise = Promise.resolve();
      return initPromise;
    }

    initPromise = OpenFeature.setProviderAndWait(
      new GrowthbookClientProvider(gbContext, { timeout: 2000 })
    ).catch((error) => {
      console.warn("Failed to initialize feature flags provider:", error);
      OpenFeature.setProvider(new InMemoryProvider());
    });
  }
  console.log("Initialized OpenFeature")
  console.log("Initialized OpenFeature")
  return initPromise;
}

const client = OpenFeature.getClient("hammet-api");

export async function is_enabled(key: string, layout?: boolean) {
  try {
    await ensureInitialized();
    console.log("Is initialized")
  } catch {
    // fallback gracefully
  }

  if (layout) {
    const details = client.getStringDetails(key, "A");
    console.log(details)

    return details.variant || details.value || "A";
    return details.variant || details.value || "A";
  }

  const details = client.getBooleanDetails(key, true);

  return details.value;
}