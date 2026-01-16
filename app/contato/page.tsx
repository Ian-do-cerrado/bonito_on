import { redirect } from "next/navigation"

export const metadata = {
  title: "Contato - Bonito On",
  description: "Entre em contato e receba seu roteiro personalizado para Bonito MS",
}

export default function ContatoPage() {
  redirect(
    "https://api.whatsapp.com/send/?phone=5567991395384&text=Ol%C3%A1%21+Vim+do+Instagram+e+gostaria+de+mais+informa%C3%A7%C3%B5es.&type=phone_number&app_absent=0"
  )
}
