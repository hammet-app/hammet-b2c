import { OpenFeature, InMemoryProvider } from "@openfeature/web-sdk";
import { GrowthbookClientProvider } from "@openfeature/growthbook-client-provider";

const clientKey =
  process.env.NEXT_PUBLIC_FEATURE_CLIENT_KEY ||
  process.env.FEATURE_CLIENT_KEY;

const gbContext = {
  apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST || "https://cdn.growthbook.io",
  clientKey: clientKey || "",
};

let initPromise: Promise<void> | null = null;

function ensureInitialized() {
  if (!initPromise) {
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
  return initPromise;
}

const client = OpenFeature.getClient("hammet-api");

export async function is_enabled(
  key: string,
  layout?: boolean,
  defaultVariant: string = "B"
) {
  try {
    await ensureInitialized();
  } catch {
    // fallback gracefully
  }

  if (layout) {
    const details = client.getStringDetails(key, defaultVariant);
    return details.variant || details.value || defaultVariant;
  }

  const details = client.getBooleanDetails(key, true);

  return details.value;
}