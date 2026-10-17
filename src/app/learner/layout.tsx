import { LearnerShell } from "@/components/layout/learner/learner-shell";
import { AuthGuard } from "@/components/layout/auth-guard";

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <LearnerShell>{children}</LearnerShell>
    </AuthGuard>
  );
}