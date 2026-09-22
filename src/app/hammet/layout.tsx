import { AuthGuard } from "@/components/layout/auth-guard";
import { HammetShell } from "@/components/layout/hammet/HammetSidebar";

export default function HammetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <HammetShell>
        {children}
      </HammetShell>
    </AuthGuard>
  )
}