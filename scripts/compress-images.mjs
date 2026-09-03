import sharp from "sharp"
import { readdir, stat, readFile, writeFile } from "fs/promises"
import path from "path"

const ROOT = process.argv[2] || "public"
const MAX_WIDTH = 2000
const MIN_SIZE_BYTES = 400 * 1024 // só mexe em arquivos > 400KB

const exts = new Set([".jpg", ".jpeg", ".png", ".webp"])

async function walk(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await walk(full, files)
    } else if (exts.has(path.extname(entry.name).toLowerCase())) {
      files.push(full)
    }
  }
  return files
}

async function main() {
  const files = await walk(ROOT)
  let totalBefore = 0
  let totalAfter = 0
  let touched = 0

  for (const file of files) {
    const before = (await stat(file)).size
    if (before < MIN_SIZE_BYTES) continue

    const ext = path.extname(file).toLowerCase()
    const inputBuffer = await readFile(file)
    const img = sharp(inputBuffer)
    const meta = await img.metadata()

    let pipeline = img.rotate() // normaliza EXIF orientation
    if (meta.width && meta.width > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true })
    }

    if (ext === ".webp") {
      pipeline = pipeline.webp({ quality: 75 })
    } else if (ext === ".jpg" || ext === ".jpeg") {
      pipeline = pipeline.jpeg({ quality: 78, mozjpeg: true })
    } else if (ext === ".png") {
      pipeline = pipeline.png({ compressionLevel: 9, quality: 80 })
    }

    const buffer = await pipeline.toBuffer()

    if (buffer.length < before) {
      await writeFile(file, buffer)
      const after = buffer.length
      totalBefore += before
      totalAfter += after
      touched++
      console.log(
        `${file}: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB`
      )
    } else {
      console.log(`${file}: skip (already optimal)`)
    }
  }

  console.log(`\n${touched} arquivos otimizados.`)
  console.log(
    `Total: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB (economia de ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0)}%)`
  )
}

main()
