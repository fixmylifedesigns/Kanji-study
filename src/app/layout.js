// src/app/layout.js
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import "../styles/globals.css";

export const metadata = {
  title: "Kanji Learning App",
  description: "Learn Japanese kanji through interactive study tools",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        <div className="min-h-screen relative">
          <AuthProvider>
            <SettingsProvider>{children}</SettingsProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}