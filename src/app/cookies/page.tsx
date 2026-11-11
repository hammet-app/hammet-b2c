import type { Metadata } from "next";
import { PublicLegalDocumentPage } from "@/components/legal/PublicLegalDocumentPage";

export const metadata: Metadata = {
  title: "Cookie Policy | Hammet",
  description: "Read the current Hammet cookie policy.",
};

export default function CookiePolicyPage() {
  return (
    <PublicLegalDocumentPage
      documentType="cookie_policy"
      title="Cookie Policy"
      description="Learn how Hammet uses necessary and analytics cookies."
    />
  );
}
