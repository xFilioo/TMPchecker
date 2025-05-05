import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://api.truckersmp.com/v2/events", {
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: true, descriptor: "Błąd podczas pobierania danych eventów" },
        { status: response.status },
      )
    }

    const data = await response.json()

    if (!data || data.error) {
      return NextResponse.json(
        { error: true, descriptor: data.descriptor || "Nieprawidłowa odpowiedź z API TruckersMP" },
        { status: 500 },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: true, descriptor: "Wystąpił błąd podczas komunikacji z API" }, { status: 500 })
  }
}
