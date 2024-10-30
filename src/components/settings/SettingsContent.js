"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, LogOut, User, Globe, Type } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Capacitor } from "@capacitor/core";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

const STORAGE_KEYS = {
  LANGUAGE: "preferred_language",
  SHOW_ROMAJI: "show_romaji",
};

export function SettingsContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [showRomaji, setShowRomaji] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isNative, setIsNative] = useState(false);

  // Check if native platform (run only on the client)
  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  // Load saved preferences on the client side
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
        if (savedLanguage) {
          const language = LANGUAGES.find(lang => lang.code === savedLanguage);
          if (language) setSelectedLanguage(language);
        }

        const savedRomaji = localStorage.getItem(STORAGE_KEYS.SHOW_ROMAJI);
        if (savedRomaji !== null) {
          setShowRomaji(savedRomaji === "true");
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };

    loadPreferences();
  }, []);

  const savePreferences = async (key, value) => {
    setIsSaving(true);
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
    savePreferences(STORAGE_KEYS.LANGUAGE, language.code);
  };

  const handleRomajiToggle = () => {
    const newValue = !showRomaji;
    setShowRomaji(newValue);
    savePreferences(STORAGE_KEYS.SHOW_ROMAJI, String(newValue));
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20">
      <div className="w-32 h-32 mx-auto mb-8">
        <Image
          src="/images/kanji-study-logo.png"
          alt="Kanji Study Logo"
          width={128}
          height={128}
          className="object-contain"
          priority
        />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {user?.photoURL && (
                  <Image
                    src={user.photoURL}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{user?.displayName || "User"}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Globe size={16} />
                Interface Language
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="w-full px-4 py-2 text-left bg-white border rounded-lg flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2">
                    <span>{selectedLanguage.flag}</span>
                    <span>{selectedLanguage.name}</span>
                  </span>
                  <ChevronDown size={16} />
                </button>

                {showLanguageDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                    {LANGUAGES.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageSelect(language)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Type size={16} />
                Display Settings
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRomajiToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    showRomaji ? "bg-blue-500" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showRomaji ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">Show Romaji</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white rounded-lg py-2 px-4 hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Log out
        </button>
      </div>

      <footer className="mt-8 text-center text-sm text-gray-500 space-y-2">
        <div className="flex justify-center space-x-4">
          <Link
            href="/terms"
            className="hover:text-gray-700"
            {...(isNative ? { target: "_blank" } : {})}
          >
            Terms & Conditions
          </Link>
          <span>•</span>
          <a
            href="https://duranirving.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700"
          >
            Created by Irving Duran
          </a>
        </div>
        <p>© 2024 Kanji Study. All rights reserved.</p>
      </footer>
    </div>
  );
}
