import Aside from '@/components/Layout/Aside'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster";
import Container from '@/components/Layout/Container'
import InnerContent from '@/components/Layout/InnerContent'

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
