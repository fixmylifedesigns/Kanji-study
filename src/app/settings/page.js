// src/app/settings/page.js
"use client";
import { SettingsContent } from "@/components/settings/SettingsContent";
import BottomNav from "@/components/BottomNav";

export default function Settings() {
  return (
    <main className="min-h-screen bg-gray-100">
      <SettingsContent />
      <BottomNav currentPage="settings" />
    </main>
  );
}
