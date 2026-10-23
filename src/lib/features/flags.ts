import { OpenFeature, InMemoryProvider } from "@openfeature/web-sdk";
import { GrowthbookClientProvider } from "@openfeature/growthbook-client-provider";

const clientKey = process.env.FEATURE_CLIENT_KEY;

const gbContext = {
  apiHost:
    process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST || "https://cdn.growthbook.io",
  clientKey: clientKey || "",
};

// Local overrides used when GrowthBook is unavailable (e.g. local dev without a client key).
// NEXT_PUBLIC_ vars must be referenced literally so Next.js can inline them.
const localFlags: Record<string, boolean> = {
  gloria_school_creation:
    process.env.NEXT_PUBLIC_GLORIA_SCHOOL_CREATION === "true",
  gloria_course_creation:
    process.env.NEXT_PUBLIC_GLORIA_COURSE_CREATION === "true",
  gloria_module_creation:
    process.env.NEXT_PUBLIC_GLORIA_MODULE_CREATION === "true",
};

function localProvider() {
  return new InMemoryProvider(
    Object.fromEntries(
      Object.entries(localFlags).map(([key, on]) => [
        key,
        {
          variants: { on: true, off: false },
          defaultVariant: on ? "on" : "off",
          disabled: false,
        },
      ]),
    ),
  );
}

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
      new GrowthbookClientProvider(gbContext, { timeout: 2000 }),
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
  defaultVariant: string = "B",
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
