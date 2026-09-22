import { Suspense } from "react";
import VerifyEmailContent from "@/components/pages/VerifyEmailContent";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div />}>
      <VerifyEmailContent />
    </Suspense>
  );
}