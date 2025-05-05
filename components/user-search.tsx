"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UserProfile from "@/components/user-profile"
import { getUserById } from "@/lib/api"
import type { User } from "@/lib/types"
import { useLanguage } from "@/lib/i18n/language-context"

export default function UserSearch() {
  const { t } = useLanguage()
  const [userId, setUserId] = useState("")
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId || isNaN(Number(userId))) {
      setError(t("enterValidId"))
      return
    }

    setLoading(true)
    setError("")

    try {
      const data = await getUserById(userId)
      setUserData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("userNotFound"))
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder={t("enterTruckersmpId")}
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading} className="bg-[#B92025] hover:bg-[#A01B20]">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {t("searching")}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {t("search")}
            </span>
          )}
        </Button>
      </form>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>}

      {userData && <UserProfile user={userData} />}
    </div>
  )
}
