// src/app/settings/page.js
"use client";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";

export default function Settings() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="w-64 h-64 mx-auto mb-8 relative animate-fade-in">
          <Image
            src="/images/kanji-study-logo.png" // Make sure to add the image to public folder
            alt="Kanji Study Logo"
            width={256}
            height={256}
            className="object-contain"
            priority // Ensures the logo loads first
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Account</h3>
              <p className="text-gray-900">{user?.email}</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white rounded-lg py-2 px-4 
                       hover:bg-red-600 transition-colors"
            >
              Log out
            </button>
          </CardContent>
        </Card>
      </div>
      <BottomNav currentPage={"settings"} />
    </main>
  );
}
