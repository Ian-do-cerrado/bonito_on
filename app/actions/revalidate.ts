"use server"

import { revalidatePath } from "next/cache"

export async function clearCache(path: string = "/") {
  try {
    revalidatePath(path, "page")
    revalidatePath(path, "layout")
    return { success: true }
  } catch (error) {
    console.error("Revalidation error:", error)
    return { success: false, error }
  }
}

export async function clearTourCache(slug: string) {
  try {
    revalidatePath("/")
    revalidatePath("/passeios")
    revalidatePath(`/passeios/${slug}`)
    return { success: true }
  } catch (error) {
    console.error("Tour revalidation error:", error)
    return { success: false, error }
  }
}
