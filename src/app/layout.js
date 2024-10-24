// src/app/layout.js
import { AuthProvider } from "@/context/AuthContext";
import "../styles/globals.css";

export const metadata = {
  title: "Kanji Learning App",
  description: "Learn Japanese kanji through interactive study tools",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
