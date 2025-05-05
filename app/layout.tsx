import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import ClientRootLayout from "./ClientRootLayout"

export const metadata: Metadata = {
  title: "TruckersMP Checker",
  description: "Check TruckersMP users by their TMP ID",
    generator: 'v0.dev'
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientRootLayout children={children} />
      </body>
    </html>
  )
}
