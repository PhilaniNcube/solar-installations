import Aside from '@/components/Layout/Aside'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster";
import Container from '@/components/Layout/Container'
import InnerContent from '@/components/Layout/InnerContent'
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Solar Installation',
  description: 'This is a tool to help you plan a solar installation at a property',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-FCLC8KKJH9"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FCLC8KKJH9');
        `}
      </Script>
      <body className={inter.className}>
        {children}
        <Toaster />
        {/* <Container>
          <Aside />
          <InnerContent>
          </InnerContent>
        </Container> */}
      </body>
    </html>
  );
}
