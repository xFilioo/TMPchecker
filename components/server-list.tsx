"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getServers, getGameTime } from "@/lib/api"
import type { Server, GameTime } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

export default function ServerList() {
  const { t } = useLanguage()
  const [servers, setServers] = useState<Server[]>([])
  const [gameTime, setGameTime] = useState<GameTime | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    setLoading(true)
    setError("")

    try {
      // Pobierz dane serwerów
      const serversData = await getServers()
      setServers(serversData)

      // Pobierz czas gry
      try {
        const timeData = await getGameTime()
        setGameTime(timeData)
      } catch (timeErr) {
        console.error("Error fetching game time:", timeErr)
        // Nie ustawiamy błędu głównego, ponieważ to nie jest krytyczne
      }
    } catch (err) {
      console.error("Error in loadData:", err)
      setError(err instanceof Error ? err.message : "Nie udało się załadować danych serwerów")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
        <p className="mt-2">{t("loading")}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          <p className="font-medium">{t("error")}</p>
          <p>{error}</p>
        </div>
        <Button onClick={loadData} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          {t("tryAgain")}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {gameTime && (
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#B92025]" />
            <span className="font-medium">
              {t("currentGameTime")}: {formatGameTimeAsHourMinute(gameTime.game_time)}
            </span>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("serversTitle")}</CardTitle>
          <Button variant="outline" size="sm" onClick={loadData} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            {t("refresh")}
          </Button>
        </CardHeader>
        <CardContent>
          {servers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">{t("noServersAvailable")}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servers.map((server) => (
                <Card key={server.id} className="overflow-hidden">
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{server.name}</h3>
                      <Badge variant={server.online ? "success" : "destructive"}>
                        {server.online ? t("online") : t("offline")}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">{t("game")}</p>
                        <p className="font-medium">{server.game}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">{t("players")}</p>
                        <p className="font-medium">
                          {server.players} / {server.maxplayers}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">{t("queue")}</p>
                        <p className="font-medium">{server.queue}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">{t("speedLimiter")}</p>
                        <p className="font-medium">{server.speedlimiter ? t("enabled") : t("disabled")}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">{t("collisions")}</p>
                        <p className="font-medium">{server.collisions ? t("enabled") : t("disabled")}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">{t("promods")}</p>
                        <p className="font-medium">{server.promods ? t("yes") : t("no")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Funkcja do formatowania czasu gry jako godzina:minuta
function formatGameTimeAsHourMinute(totalMinutes: number): string {
  // Obliczamy godzinę w cyklu 24-godzinnym
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
  const minutes = Math.floor(totalMinutes % 60)

  // Formatujemy jako HH:MM
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}
