import type { Metadata } from "next";
import { PublicLegalDocumentPage } from "@/components/legal/PublicLegalDocumentPage";

export const metadata: Metadata = {
  title: "Terms and Conditions | Hammet",
  description: "Read the current Hammet terms and conditions.",
};

export default function TermsAndConditionsPageB() {
  return (
    <PublicLegalDocumentPage
      documentType="terms_and_conditions"
      title="Terms and Conditions"
      description="The terms that apply when you use Hammet services."
    />
  );
}
