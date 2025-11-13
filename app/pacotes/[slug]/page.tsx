import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { packageService, Package } from "@/services/supabase-packages"
import PackageDetailPageClient from "./index"

interface PackagePageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const packages = await packageService.getAllPackages()

  return packages.map((pkg: Package) => ({
    slug: pkg.slug,
  }))
}

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const packageData = await packageService.getPackageBySlug(params.slug)

  if (!packageData) {
    return {
      title: "Pacote não encontrado - Bonito Ecoturismo",
      description: "O pacote solicitado não foi encontrado.",
    }
  }

  return {
    title: `${packageData.title} - Bonito Ecoturismo`,
    description: packageData.description,
    openGraph: {
      title: `${packageData.title} - Bonito Ecoturismo`,
      description: packageData.description,
      images: [
        {
          url: packageData.image,
          width: 1200,
          height: 630,
          alt: packageData.title,
        },
      ],
    },
  }
}

export default async function PackagePage({ params }: PackagePageProps) {
  const packageData = await packageService.getPackageBySlug(params.slug)

  if (!packageData) {
    notFound()
  }

  return <PackageDetailPageClient initialPackageData={packageData} />
}