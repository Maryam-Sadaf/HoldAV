import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/providers/ToastProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import SessionProvider from "../providers/SessionProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Hold av",
  description: "Hold av Møterom",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="no" suppressHydrationWarning>
      <head>
        {/* Performance: Optimized font loading and resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Performance: Resource hints for critical assets */}
        <link rel="preload" href="/headerimage.png" as="image" type="image/png" />
        <link rel="preload" href="/booking-illustrasjon.png" as="image" type="image/png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </noscript>
      </head>
      <body className="font-inter" suppressHydrationWarning={true}>
        <ToastProvider />
        <SessionProvider session={session}>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
