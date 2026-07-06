import { Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { WhatsAppIcon } from "./whatsapp-icon";
import { whatsappUrl } from "../config/data";

export function Footer() {
  return (
    <footer className="border-t border-white/10 promo-bg-brand-dark py-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <img src="/pacotes-promo/logo-bonito-on.png" alt="Bonito ON" className="h-8 w-auto sm:h-9" />
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Especialistas em roteiros para Bonito/MS. Pacotes prontos, atendimento humano e as
            melhores atrações do destino.
          </p>
        </div>


        <div>
          <h4 className="text-sm font-semibold">Contato</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                <WhatsAppIcon className="h-4 w-4 text-primary" /> (67) 99139-5384
              </a>
            </li>
            <li>
              <a
                href="mailto:contato@bonitoon.com.br"
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                <Mail className="h-4 w-4 text-primary" /> contato@bonitoon.com.br
              </a>
            </li>
            <li>
              <a
                href="https://share.google/S9y7N8Jmn3QaLboUF"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-primary"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Rua Coronel Pilad Rebuá, 1997
                  <br />
                  Centro, Bonito - MS
                  <br />
                  CEP: 79290-000
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Redes sociais</h4>
          <div className="mt-4 flex gap-3">
            <a
              href="https://www.instagram.com/agenciabonitoon/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-primary hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.facebook.com/people/Ag%C3%AAncia-Bonito-On/61576109826482/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-primary hover:text-primary"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-4 pt-8 text-xs text-white/60 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Bonito ON. Todos os direitos reservados.
      </div>
    </footer>
  );
}
