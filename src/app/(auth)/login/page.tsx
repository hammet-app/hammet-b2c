"use client";

import LoginPageB from "@/components/pages/experiments/auth-login/page-b";

export default function Page() {
  // Force variant B (new layout with illustration + custom Google button)
  // Growthbook flag "login_page_layout" currently forces "A" - override until dashboard is updated
  return <LoginPageB />;
}