"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { LanguageProvider } from "@/lib/i18n/language-context"
import LanguageSwitcher from "@/components/language-switcher"
import { useLanguage } from "@/lib/i18n/language-context"

// Dodaj import dla nowych styli
import "../app/logo-styles.css"

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen">
        <header className="bg-[#040608] text-[#FEFEFE]">
          <div className="container mx-auto flex items-center justify-between">
            {/* Zaktualizuj sekcję logo w headerze */}
            <Link href="/" className="flex items-center">
              <div className="py-[15px] px-[96px]">
                {" "}
                {/* 15px góra/dół, 96px (50% z 192px) prawo/lewo */}
                <div className="relative h-[48px] w-[192px]">
                  <Image
                    src="/images/truckersmp-logo.png"
                    alt="TruckersMP Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </Link>
            <nav className="flex items-center gap-4 pr-4">
              <ul className="flex gap-6">
                <li>
                  <Link href="/" className="hover:text-gray-300 transition-colors">
                    <LanguageText textKey="homeTitle" />
                  </Link>
                </li>
                <li>
                  <Link href="/servers" className="hover:text-gray-300 transition-colors">
                    <LanguageText textKey="serversTitle" />
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-gray-300 transition-colors">
                    <LanguageText textKey="eventsTitle" />
                  </Link>
                </li>
              </ul>
              <LanguageSwitcher />
            </nav>
          </div>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="bg-[#040608] text-gray-400 py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p>
              <LanguageText textKey="footerText" />{" "}
              <a
                href="https://truckersmp.com/developers/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B92025] hover:text-red-400 transition-colors"
              >
                <LanguageText textKey="truckersmpApi" />
              </a>
              .
            </p>
          </div>
        </footer>
      </div>
    </LanguageProvider>
  )
}

function LanguageText({ textKey }: { textKey: keyof typeof import("@/lib/i18n/translations").translations.en }) {
  return <ClientLanguageText textKey={textKey} />
}

function ClientLanguageText({ textKey }: { textKey: keyof typeof import("@/lib/i18n/translations").translations.en }) {
  const { t } = useLanguage()
  return <>{t(textKey)}</>
}
