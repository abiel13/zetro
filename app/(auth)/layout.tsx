import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import "../globals.css";

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
        <body className="bg-dark-1">
          <div className="w-full flex justify-center items-center min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
