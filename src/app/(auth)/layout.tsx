import { GuestGuard } from "@/components/layout/auth-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <div className="relative min-h-screen bg-bg-page flex flex-col">
        <div className="relative z-10 flex flex-col flex-1">
          {children}
        </div>
      </div>
    </GuestGuard>
  );
}