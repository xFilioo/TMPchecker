import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const response = await fetch(`https://api.truckersmp.com/v2/events/user/${id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: true, descriptor: "Nie znaleziono eventów dla tego użytkownika" },
          { status: 404 },
        )
      }
      return NextResponse.json(
        { error: true, descriptor: "Błąd podczas pobierania eventów użytkownika" },
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
    console.error("Error fetching user events:", error)
    return NextResponse.json({ error: true, descriptor: "Wystąpił błąd podczas komunikacji z API" }, { status: 500 })
  }
}
