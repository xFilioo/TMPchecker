"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getEvents } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import type { Event, EventsResponse } from "@/lib/types"
import { Calendar, MapPin, Clock, Users, Filter } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function EventsList() {
  const { t } = useLanguage()
  const [events, setEvents] = useState<EventsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [languages, setLanguages] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [filteredEvents, setFilteredEvents] = useState<EventsResponse | null>(null)

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents()
        setEvents(data)
        setFilteredEvents(data)

        // Zbierz wszystkie unikalne języki z eventów
        const allLanguages = new Set<string>()

        // Dodaj języki z każdej kategorii eventów
        if (data) {
          Object.entries(data).forEach(([category, eventsList]) => {
            if (Array.isArray(eventsList)) {
              eventsList.forEach((event) => {
                if (event.language) {
                  allLanguages.add(event.language)
                }
              })
            }
          })
        }

        setLanguages(Array.from(allLanguages).sort())
      } catch (err) {
        setError(t("error"))
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [t])

  // Filtruj eventy po wybranym języku
  useEffect(() => {
    if (!events) return

    if (!selectedLanguage) {
      setFilteredEvents(events)
      return
    }

    const filtered: EventsResponse = {
      featured: Array.isArray(events.featured)
        ? events.featured.filter((event) => event.language === selectedLanguage)
        : [],
      today: Array.isArray(events.today) ? events.today.filter((event) => event.language === selectedLanguage) : [],
      now: Array.isArray(events.now) ? events.now.filter((event) => event.language === selectedLanguage) : [],
      upcoming: Array.isArray(events.upcoming)
        ? events.upcoming.filter((event) => event.language === selectedLanguage)
        : [],
    }

    setFilteredEvents(filtered)
  }, [selectedLanguage, events])

  // Resetuj filtr języka
  const resetLanguageFilter = () => {
    setSelectedLanguage("")
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
        <p className="mt-2">{t("loading")}</p>
      </div>
    )
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>
  }

  if (!filteredEvents) {
    return (
      <div className="p-4 bg-amber-50 text-amber-700 rounded-md border border-amber-200">{t("noEventsInCategory")}</div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filtr języka */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>{t("filterByLanguage")}:</span>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedLanguage && (
            <Button variant="outline" size="sm" onClick={resetLanguageFilter}>
              {t("resetFilter")}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="featured" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="featured">{t("featured")}</TabsTrigger>
          <TabsTrigger value="now">{t("now")}</TabsTrigger>
          <TabsTrigger value="today">{t("today")}</TabsTrigger>
          <TabsTrigger value="upcoming">{t("upcoming")}</TabsTrigger>
        </TabsList>
        <TabsContent value="featured">
          <EventsGrid events={filteredEvents?.featured || []} />
        </TabsContent>
        <TabsContent value="now">
          <EventsGrid events={filteredEvents?.now || []} />
        </TabsContent>
        <TabsContent value="today">
          <EventsGrid events={filteredEvents?.today || []} />
        </TabsContent>
        <TabsContent value="upcoming">
          <EventsGrid events={filteredEvents?.upcoming || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EventsGrid({ events }: { events: Event[] }) {
  const { t } = useLanguage()

  if (!events || events.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">{t("noEventsInCategory")}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden flex flex-col h-full">
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
          <CardContent className="p-4 flex-1 flex flex-col">
            <h3 className="text-lg font-bold mb-2">{event.name}</h3>
            <div className="grid grid-cols-1 gap-2 mb-4">
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
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge>{event.game}</Badge>
              <Badge variant="outline">{event.server.name}</Badge>
              <Badge variant="secondary">{event.language}</Badge>
              {event.vtc && event.vtc.name && <Badge variant="outline">VTC: {event.vtc.name}</Badge>}
            </div>
            {event.description && (
              <div className="mb-4 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
              </div>
            )}
            <div className="mt-auto">
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
  )
}
