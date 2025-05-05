"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { Event } from "@/lib/types"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface UserEventsProps {
  events: Event[]
}

export default function UserEvents({ events }: UserEventsProps) {
  const { t } = useLanguage()

  if (!events || events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("userEvents")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t("userNoEvents")}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("userEvents")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              {event.banner && (
                <div className="relative h-40 w-full">
                  <Image
                    src={event.banner || "/placeholder.svg?height=160&width=600"}
                    alt={event.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">{event.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(event.start_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {event.departure.city} → {event.arrive.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {t("meetup")}: {formatDate(event.meetup_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {t("participants")}: {event.attendances.confirmed}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{event.game}</Badge>
                  <Badge variant="outline">{event.server.name}</Badge>
                  <Badge variant="secondary">{event.language}</Badge>
                  {event.vtc && event.vtc.name && <Badge variant="outline">VTC: {event.vtc.name}</Badge>}
                </div>
                {event.description && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-1">{t("description")}:</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                  </div>
                )}
                <div className="mt-4">
                  <a
                    href={`https://truckersmp.com/events/${event.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#B92025] hover:underline"
                  >
                    {t("viewDetailsOnTruckersMP")}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
