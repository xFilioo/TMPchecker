"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import type { User, Ban } from "@/lib/types"
import UserEvents from "./user-events"
import { useLanguage } from "@/lib/i18n/language-context"

interface UserProfileProps {
  user: User
}

export default function UserProfile({ user }: UserProfileProps) {
  const { t } = useLanguage()

  // Funkcja do formatowania kwoty patrona
  const formatPatreonAmount = (amount: number) => {
    // Dzielimy kwotę przez 100, aby uzyskać prawidłową wartość
    const formattedAmount = (amount / 100).toFixed(2)
    return `$${formattedAmount}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full">
            <Image
              src={user.avatar || "/placeholder.svg?height=64&width=64"}
              alt={user.name}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <a
                href={`https://truckersmp.com/user/${user.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#B92025] transition-colors"
              >
                {user.name}
              </a>
              {user.banned && <Badge variant="destructive">{t("currentlyBanned")}</Badge>}
              {user.permissions.isStaff && (
                <Badge variant="outline" style={{ backgroundColor: user.groupColor || undefined, color: "#fff" }}>
                  {user.groupName}
                </Badge>
              )}
            </CardTitle>
            {user.vtc && user.vtc.inVTC && (
              <div className="text-sm text-muted-foreground">
                VTC:{" "}
                <a
                  href={`https://truckersmp.com/vtc/${user.vtc.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B92025] transition-colors"
                >
                  {user.vtc.name} [{user.vtc.tag}]
                </a>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">TruckersMP ID</h3>
              <p className="text-lg font-semibold">{user.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Steam ID</h3>
              <p className="text-lg font-semibold">{user.steamID64}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">{t("joinedOn")}</h3>
              <p className="text-lg font-semibold">{formatDate(user.joinDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">{t("group")}</h3>
              <p className="text-lg font-semibold">{user.groupName || t("regularUser")}</p>
            </div>
          </div>

          {user.banned && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">{t("banInfo")}</h3>
              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <p className="font-medium text-red-700">{t("currentlyBanned")}</p>
                <p className="text-red-600 text-sm mt-1">
                  {t("userCurrentlyBanned")}
                  {user.bannedUntil && ` ${t("until")} ${formatDate(user.bannedUntil)}`}.
                </p>
              </div>
            </div>
          )}

          {user.patreon && user.patreon.isPatron && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">{t("patron")}</h3>
              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <p className="font-medium text-amber-700">
                  {t("patron")} TruckersMP {user.patreon.active ? `(${t("active")})` : `(${t("inactive")})`}
                </p>
                {!user.patreon.hidden && (
                  <p className="text-amber-600 text-sm mt-1">
                    {t("level")}: {user.patreon.tierId}, {t("contributions")}:{" "}
                    {formatPatreonAmount(user.patreon.lifetimePledge)}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {user.bans && user.bans.length > 0 && <BanHistory bans={user.bans} />}

      {user.events && user.events.length > 0 && <UserEvents events={user.events} />}
    </div>
  )
}

function BanHistory({ bans }: { bans: Ban[] }) {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("banHistory")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bans.map((ban, index) => (
            <div key={index} className="p-4 border rounded-md bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t("reason")}</h4>
                  <p className="font-medium">{ban.reason}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t("admin")}</h4>
                  <p>{ban.adminName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t("date")}</h4>
                  <p>{formatDate(ban.timeAdded)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t("expires")}</h4>
                  <p>{ban.expiration ? formatDate(ban.expiration) : t("permanent")}</p>
                </div>
                {ban.active && (
                  <div className="col-span-2">
                    <Badge variant="destructive">{t("activeBan")}</Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
