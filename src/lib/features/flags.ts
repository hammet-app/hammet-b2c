import { OpenFeature, InMemoryProvider } from "@openfeature/web-sdk";
import { GrowthbookClientProvider } from "@openfeature/growthbook-client-provider";

const clientKey = process.env.NEXT_PUBLIC_FEATURE_CLIENT_KEY;

const gbContext = {
  apiHost:
    process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST || "https://cdn.growthbook.io",
  clientKey: clientKey,
};

let initPromise: Promise<void> | null = null;

function ensureInitialized() {
  if (!initPromise) {
    initPromise = OpenFeature.setProviderAndWait(
      new GrowthbookClientProvider(gbContext, { timeout: 2000 }),
    ).catch((error) => {
      console.warn("Failed to initialize feature flags provider:", error);
    });
  }
  return initPromise;
}

const client = OpenFeature.getClient("hammet-api");

export async function isEnabled(
  key: string,
  layout?: boolean,
  defaultVariant: string = "B",
  defaultValue: boolean = false,
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

  const details = client.getBooleanDetails(key, defaultValue);

  return details.value;
}
