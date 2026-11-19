import { Suspense } from "react";
import ClaimAdminContent from "@/components/pages/ClaimAdminContent";

export default function ClaimAdminPage() {
  return (
    <Suspense fallback={<div />}>
      <ClaimAdminContent />
    </Suspense>
  );
}
