import type { User, Server, ApiResponse, Event, EventsResponse, GameTime } from "./types"

export async function getUserById(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/player/${id}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Nie znaleziono gracza o podanym ID")
      }
      throw new Error("Błąd podczas pobierania danych")
    }

    const data = (await response.json()) as ApiResponse<User>

    if (!data.error) {
      // Pobierz eventy użytkownika
      try {
        const eventsResponse = await fetch(`/api/events/user/${id}`)
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json()
          if (!eventsData.error) {
            data.response.events = eventsData.response
          }
        }
      } catch (err) {
        console.error("Error fetching user events:", err)
      }

      return data.response
    } else {
      throw new Error(data.descriptor || "Błąd podczas pobierania danych")
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

export async function getServers(): Promise<Server[]> {
  try {
    // Dodajemy timestamp, aby uniknąć cache'owania
    const timestamp = new Date().getTime()
    const response = await fetch(`/api/servers?t=${timestamp}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Błąd podczas pobierania danych serwerów (${response.status})`)
    }

    // Pobieramy dane jako JSON
    const data = await response.json()

    // Sprawdzamy strukturę danych
    if (data.error === true) {
      throw new Error(data.descriptor || "API zwróciło błąd")
    }

    // Sprawdzamy, czy response istnieje i jest tablicą
    if (!data.response || !Array.isArray(data.response)) {
      console.error("Invalid response structure:", data)
      throw new Error("Nieprawidłowa struktura odpowiedzi")
    }

    return data.response
  } catch (error) {
    console.error("Error fetching servers:", error)
    throw error instanceof Error ? error : new Error("Błąd podczas pobierania danych serwerów")
  }
}

export async function getEvents(): Promise<EventsResponse> {
  try {
    const response = await fetch("/api/events", {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Błąd podczas pobierania danych eventów")
    }

    const data = (await response.json()) as ApiResponse<EventsResponse>

    if (!data.error) {
      return data.response
    } else {
      throw new Error(data.descriptor || "Błąd podczas pobierania danych eventów")
    }
  } catch (error) {
    console.error("Error fetching events:", error)
    throw error
  }
}

export async function getUserEvents(id: string): Promise<Event[]> {
  try {
    const response = await fetch(`/api/events/user/${id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return []
      }
      throw new Error("Błąd podczas pobierania eventów użytkownika")
    }

    const data = (await response.json()) as ApiResponse<Event[]>

    if (!data.error) {
      return data.response
    } else {
      return []
    }
  } catch (error) {
    console.error("Error fetching user events:", error)
    return []
  }
}

export async function getGameTime(): Promise<GameTime> {
  try {
    const response = await fetch("/api/game-time", {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Błąd podczas pobierania czasu gry")
    }

    const data = await response.json()

    if (!data.error) {
      return data
    } else {
      throw new Error(data.descriptor || "Błąd podczas pobierania czasu gry")
    }
  } catch (error) {
    console.error("Error fetching game time:", error)
    throw error
  }
}
