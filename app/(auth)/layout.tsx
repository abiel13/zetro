import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import '../globals.css'

export const metadata = {
  title: "Sign up To Zetro",
  description: "A Social Media",
};

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html>
        <body className="bg-dark-1">{children}</body>
      </html>
    </ClerkProvider>
  );
}
