import { OpenFeature, FlagEvaluationOptions, EvaluationContext } from "@openfeature/web-sdk";
import { GrowthbookClientProvider } from "@openfeature/growthbook-client-provider"
import { AuthUser } from "../utils/roles";

const gbContext = {
  apiHost: "https://cdn.growthbook.io",
  clientKey: process.env.FEATURE_CLIENT_KEY
}

try {
  await OpenFeature.setProviderAndWait(
    new GrowthbookClientProvider(gbContext, { timeout: 2000 })
  )
} catch(error) {
  console.log("Failed to initialize provider:", error)
}

const client = OpenFeature.getClient("hammet-web")

export async function is_enabled(key: string, user: AuthUser) {
  return client.getBooleanValue(key, false)
}