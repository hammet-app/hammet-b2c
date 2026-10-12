import { OpenFeature, FlagEvaluationOptions, EvaluationContext } from "@openfeature/web-sdk";
import { GrowthbookClientProvider } from "@openfeature/growthbook-client-provider"
import { AuthUser } from "../utils/roles";

const gbContext = {
  apiHost: "https://cdn.growthbook.io",
  clientKey: process.env.NEXT_PUBLIC_FEATURE_CLIENT_KEY
}

let initPromise: Promise<void> | null = null;

function ensureInitialized() {
  if (!initPromise) {
    initPromise = OpenFeature.setProviderAndWait(
      new GrowthbookClientProvider(gbContext, { timeout: 2000 })
    ).catch((error) => {
      console.warn("Failed to initialize feature flags provider:", error);
    });
  }
  return initPromise;
}

const client = OpenFeature.getClient("hammet-api");

export async function is_enabled(key: string, layout?: boolean) {
  try {
    await ensureInitialized();
  } catch {
    // fallback gracefully
  }

  if (layout) {
    const details = client.getStringDetails(key, "B");

    return details.variant || details.value || "B";
  }

  const details = client.getBooleanDetails(key, true)

  return details.value

}