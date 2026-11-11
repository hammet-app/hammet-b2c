import type { Metadata } from "next";
import { PublicLegalDocumentPage } from "@/components/legal/PublicLegalDocumentPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Hammet",
  description: "Read the current Hammet privacy policy.",
};

export default function PrivacyPolicyPageB() {
  return (
    <PublicLegalDocumentPage
      documentType="privacy_policy"
      title="Privacy Policy"
      description="How Hammet collects, uses, and protects personal information."
    />
  );
}
