"use client"

import LoginPageB from "@/components/pages/experiments/auth-login/page-b";
import LoginPage from "@/components/pages/experiments/auth-login/page-a";
import { useExperiment } from "@/components/pages/experiments/use-experiment";

export default function Page() {

  const variant = useExperiment("login_page_layout", "B");

  if (variant === "A") {
    return <LoginPage />;
  }
  
  return <LoginPageB />;
}