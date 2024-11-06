import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import Topbar from "@/components/common/Topbar";
import LeftSidebar from "@/components/common/LeftSidebar";
import RightSidebar from "@/components/common/RightSidebar";
import Bottombar from "@/components/common/Bottombar";

export const metadata = {
  title: "Zetro",
  description: "Get to know your friends online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-background">
          {/* Topbarb*/}
          <Topbar />
          <main className="flex flex-row">
            <LeftSidebar />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children} </div>
            </section>

            <RightSidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
