import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://api.truckersmp.com/v2/game_time", {
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: true, descriptor: "Błąd podczas pobierania czasu gry" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching game time:", error)
    return NextResponse.json({ error: true, descriptor: "Wystąpił błąd podczas komunikacji z API" }, { status: 500 })
  }
}
