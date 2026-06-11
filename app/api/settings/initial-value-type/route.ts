import { NextResponse } from "next/server"
import { getInitialValueType } from "@/app/actions/settings"

export async function GET() {
  try {
    const type = await getInitialValueType()
    return NextResponse.json({ type })
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}
