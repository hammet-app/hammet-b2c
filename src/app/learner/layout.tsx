import { LearnerShell } from "@/components/layout/learner/learner-shell";

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LearnerShell>{children}</LearnerShell>;
}