import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const response = await fetch(`https://api.truckersmp.com/v2/player/${id}`)

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: true, message: "Nie znaleziono gracza o podanym ID" }, { status: 404 })
      }
      return NextResponse.json({ error: true, message: "Błąd podczas pobierania danych" }, { status: response.status })
    }

    const data = await response.json()

    // Jeśli użytkownik ma włączone wyświetlanie banów, pobierz również historię banów
    if (data.response.displayBans && data.response.bansCount > 0) {
      const bansResponse = await fetch(`https://api.truckersmp.com/v2/bans/${id}`)
      if (bansResponse.ok) {
        const bansData = await bansResponse.json()
        data.response.bans = bansData.response
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching player data:", error)
    return NextResponse.json({ error: true, message: "Wystąpił błąd podczas komunikacji z API" }, { status: 500 })
  }
}
