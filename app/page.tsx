import type { Metadata } from "next"
import UserSearch from "@/components/user-search"
import { LanguageMetadata } from "@/components/language-metadata"
import "./page-styles.css"

export const metadata: Metadata = {
  title: "TruckersMP User Checker",
  description: "Check TruckersMP users by their TMP ID",
}

export default function Home() {
  return (
    <div className="page-container p-4 md:p-8 bg-gray-50">
      <div className="content-wrapper max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#040608] mb-2">
            <LanguageMetadata textKey="homeTitle" />
          </h1>
          <p className="text-gray-600">
            <LanguageMetadata textKey="homeDescription" />
          </p>
        </div>
        <UserSearch />
      </div>
    </div>
  )
}
