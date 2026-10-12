"use client";

import { useExperiment } from "@/components/pages/experiments/use-experiment";
import LoginPageA from "@/components/pages/experiments/auth-login/page-a";
import LoginPageB from "@/components/pages/experiments/auth-login/page-b";

export default function Page() {
  const variant = useExperiment("login_page_layout", "B");

  if (variant === "A") {
    return <LoginPageA />;
  }

  return <LoginPageB />;
}