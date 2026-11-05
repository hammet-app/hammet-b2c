import { GuestGuard } from "@/components/layout/auth-guard";
import { AuthPageViewTracker } from "@/components/analytics/AuthPageViewTracker";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <div className="relative min-h-screen bg-bg-page flex flex-col">
        <AuthPageViewTracker />
        <div className="relative z-10 flex flex-col flex-1">
          {children}
        </div>
      </div>
    </GuestGuard>
  );
}
