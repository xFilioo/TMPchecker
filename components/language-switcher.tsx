"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function LanguageSwitcher() {
  const { locale, changeLocale, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-[#FEFEFE]">
          <Globe className="h-4 w-4" />
          <span>{locale === "en" ? "EN" : "PL"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Wyświetlamy nazwy języków w ich natywnych formach, niezależnie od aktualnie wybranego języka */}
        <DropdownMenuItem onClick={() => changeLocale("en")}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLocale("pl")}>Polski</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
