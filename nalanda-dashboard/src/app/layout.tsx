import type { Metadata } from "next";
import { EB_Garamond } from 'next/font/google';
import "./globals.css";

const garamond = EB_Garamond({ 
  subsets: ['latin'], 
  variable:'--font-garamond'
});


export const metadata: Metadata = {
  title: "Nalanda",
  description: "Your personal internet journal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${garamond.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"/>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
