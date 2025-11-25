import ContactForm from "@/components/contact-form"

export const metadata = {
  title: "Contato - Bonito On",
  description: "Entre em contato e receba seu roteiro personalizado para Bonito MS",
}

export default function ContatoPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <video
        className="absolute left-1/2 top-1/2 -z-10 min-h-full w-auto min-w-full max-w-none -translate-x-1/2 -translate-y-1/2"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/file.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/60" />
      <div className="z-10 py-20">
        <ContactForm />
      </div>
    </div>
  )
}