"use client";

import { motion } from "motion/react";
import { Settings, User, Bell, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="min-h-screen px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10 bg-[#F5F3FF] dark:bg-[#0D0A17]">
      <div className="mx-auto max-w-[1000px]">
        {/* Page heading */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-purple-600 dark:text-cyan-400">
            <Settings className="h-3.5 w-3.5" />
            Preferences
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage your account settings, notifications, and billing.
          </p>
        </motion.header>

        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <nav className="space-y-1">
            {[
              { id: "profile", label: "Profile", icon: User, active: true },
              { id: "notifications", label: "Notifications", icon: Bell, active: false },
              { id: "security", label: "Security", icon: Shield, active: false },
              { id: "billing", label: "Billing", icon: CreditCard, active: false },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  tab.active
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.05]"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Profile Information</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input 
                  type="text" 
                  defaultValue="Learner User"
                  className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input 
                  type="email" 
                  defaultValue="learner@example.com"
                  className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bio
                </label>
                <textarea 
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-700 dark:text-white"
                />
              </div>
              
              <div className="pt-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

