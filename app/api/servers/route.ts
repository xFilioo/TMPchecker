import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Bezpośrednie wywołanie API TruckersMP
    const response = await fetch("https://api.truckersmp.com/v2/servers", {
      headers: {
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`)
      return NextResponse.json(
        { error: true, descriptor: `API responded with status: ${response.status}` },
        { status: response.status },
      )
    }

    // Pobieramy dane jako JSON bezpośrednio
    const data = await response.json()

    // Zwracamy dane bez modyfikacji
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching servers:", error)
    return NextResponse.json({ error: true, descriptor: "Wystąpił błąd podczas komunikacji z API" }, { status: 500 })
  }
}
