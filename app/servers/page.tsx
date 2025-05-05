import type { Metadata } from "next"
import ServerList from "@/components/server-list"
import { LanguageMetadata } from "@/components/language-metadata"
import "../page-styles.css"

export const metadata: Metadata = {
  title: "TruckersMP Servers",
  description: "View all TruckersMP servers and their status",
}

export default function ServersPage() {
  return (
    <div className="page-container p-4 md:p-8 bg-gray-50">
      <div className="content-wrapper max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#040608] mb-2">
            <LanguageMetadata textKey="serversTitle" />
          </h1>
          <p className="text-gray-600">
            <LanguageMetadata textKey="serversDescription" />
          </p>
        </div>
        <ServerList />
      </div>
    </div>
  )
}
