"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MessageCircle, Waves, Mountain, Eye, TreePine, Star, MapPin, Phone, Mail, Car, Users, CalendarDays } from "lucide-react"
import Image from "next/image"
import { ContactModal } from "@/components/contact-modal"

export default function BonitoONLanding() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 object-cover w-full h-full opacity-100"
        >
          <source src="/file.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 drop-shadow-lg">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance drop-shadow-lg">
            Descubra as Maravilhas de <span className="text-primary">Bonito</span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 text-pretty drop-shadow-lg">
            Viva experiências únicas em um dos destinos mais preservados do Brasil
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
            onClick={() =>
              window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de montar um roteiro para Bonito.", "_blank")
            }
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Montar Roteiro no WhatsApp
          </Button>
        </div>
      </section>

      {/* Como Quer Aproveitar Section */}
      <section id="experiencias" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Como Quer Aproveitar?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha sua aventura e mergulhe nas belezas naturais de Bonito
            </p>
          </div>

          {/* CTA for Tarifário Descritivo */}
          <div className="text-center mb-12">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
              onClick={() => setIsContactModalOpen(true)}
            >
              <CalendarDays className="mr-2 h-5 w-5" />
              Receber Tarifário Descritivo com Todos os Passeios
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/10">
                <Image
                  src="/cachoeira-cristalina-em-bonito-ms-com--guas-azuis-.png"
                  alt="Cachoeiras em Bonito"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Waves className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Cachoeiras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <CardDescription className="text-justify flex-1">
                  Banhe-se em águas cristalinas e contemple quedas d'água espetaculares em meio à natureza preservada.
                </CardDescription>
                <Button
                  className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white"
                  variant="default"
                  onClick={() =>
                    window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de falar com um especialista sobre cachoeiras.", "_blank")
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Falar com Especialista
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-accent/20 to-primary/10">
                <Image
                  src="/flutua--o-em-rio-cristalino-com-peixes-coloridos-e.png"
                  alt="Flutuação em Bonito"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
                  <Eye className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Flutuação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <CardDescription className="text-justify flex-1">
                  Flutue sobre rios de águas transparentes e observe a vida aquática em seu habitat natural.
                </CardDescription>
                <Button
                  className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white"
                  variant="default"
                  onClick={() =>
                    window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de falar com um especialista sobre flutuação.", "_blank")
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Falar com Especialista
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/10">
                <Image
                  src="/gruta-subterr-nea-com-lago-azul-cristalino-em-boni.png"
                  alt="Grutas em Bonito"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Mountain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Grutas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <CardDescription className="text-justify flex-1">
                  Explore cavernas subterrâneas com formações rochosas únicas e lagos de águas azuis.
                </CardDescription>
                <Button
                  className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white"
                  variant="default"
                  onClick={() =>
                    window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de falar com um especialista sobre grutas.", "_blank")
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Falar com Especialista
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-accent/20 to-primary/10">
                <Image
                  src="/pantanal-com-jacar-s-e-aves-coloridas-em-paisagem-.png"
                  alt="Pantanal"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
                  <TreePine className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Pantanal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <CardDescription className="text-justify flex-1">
                  Descubra a maior planície alagável do mundo e sua incrível biodiversidade.
                </CardDescription>
                <Button
                  className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white"
                  variant="default"
                  onClick={() =>
                    window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de falar com um especialista sobre o Pantanal.", "_blank")
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Falar com Especialista
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Passeios Destaque */}
      <section id="passeios" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Passeios em Destaque</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experiências imperdíveis selecionadas especialmente para você
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/10">
                <div className="absolute inset-0 bg-[url('/rio_da_prata_debaixo_da_agua.webp')] bg-cover bg-center"></div>
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  4.9
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Rio da Prata
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <CardDescription>
                  Flutuação em águas cristalinas com visibilidade de até 50 metros. Observe peixes coloridos e a
                  vegetação aquática.
                </CardDescription>
                <div className="mt-4 flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-primary">R$ 388,00</span>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => window.open("https://bonitoon.com.br/passeios/rio-da-prata", "_blank")}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-accent/20 to-primary/10">
                <div className="absolute inset-0 bg-[url('/gruta_do_lago_azul_principal.webp')] bg-cover bg-center"></div>
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  4.8
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Gruta do Lago Azul
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <CardDescription>
                  Explore uma das grutas mais famosas do Brasil com um lago subterrâneo de águas azul-turquesa.
                </CardDescription>
                <div className="mt-4 flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-primary">R$ 120,00</span>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => window.open("https://bonitoon.com.br/passeios/gruta-do-lago-azul", "_blank")}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/10">
                <div className="absolute inset-0 bg-[url('/pantanal-experiencia.webp')] bg-cover bg-center"></div>
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  4.9
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Pantanal Experiência
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <CardDescription>
                  Descubra a maior planície alagável do mundo e sua incrível biodiversidade em uma experiência única.
                </CardDescription>
                <div className="mt-4 flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-primary">R$ 615,00</span>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => window.open("https://bonitoon.com.br/passeios/pantanal-experiencia", "_blank")}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-accent/20 to-primary/10">
                <div className="absolute inset-0 bg-[url('/Boca_da_onca_buraco_do_macaco.webp')] bg-cover bg-center"></div>
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  4.7
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Cachoeira da Boca da Onça
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <CardDescription>
                  A maior cachoeira de Mato Grosso do Sul com 156 metros de altura. Trilha ecológica e banho
                  refrescante.
                </CardDescription>
                <div className="mt-4 flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-primary">R$ 500,00</span>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => window.open("https://bonitoon.com.br/passeios/boca-da-onca-trilha-adventure-1", "_blank")}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Perguntas Frequentes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tire suas dúvidas sobre os passeios em Bonito
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-6">
                <AccordionTrigger className="text-left">Qual a melhor época para visitar Bonito?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Bonito pode ser visitado o ano todo, mas a época seca (maio a setembro) oferece melhor visibilidade
                  nas águas e menos chuvas. A época chuvosa (outubro a abril) tem mais vida selvagem ativa.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  É necessário saber nadar para fazer flutuação?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Não é necessário saber nadar. Todos os passeios de flutuação fornecem equipamentos de segurança
                  (colete salva-vidas, máscara e snorkel) e acompanhamento de guias especializados.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card rounded-lg px-6">
                <AccordionTrigger className="text-left">Os passeios têm limite de idade?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  A maioria dos passeios aceita crianças a partir de 5 anos, sempre acompanhadas dos responsáveis.
                  Alguns passeios mais aventureiros podem ter restrições específicas de idade e condicionamento físico.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card rounded-lg px-6">
                <AccordionTrigger className="text-left">Como funciona o agendamento dos passeios?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Todos os passeios em Bonito precisam ser agendados com antecedência devido ao controle de visitação.
                  Recomendamos reservar com pelo menos 15 dias de antecedência, especialmente em alta temporada.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-card rounded-lg px-6">
                <AccordionTrigger className="text-left">O que está incluído nos passeios?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Geralmente incluem transporte, guia especializado, equipamentos necessários e taxa de entrada.
                  Alimentação pode estar inclusa dependendo do passeio. Sempre verificamos os detalhes específicos de
                  cada atividade.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
              onClick={() =>
                window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de tirar mais dúvidas com um especialista.", "_blank")
              }
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Tire Mais Dúvidas com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">O Que Nossos Clientes Dizem</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experiências reais de quem já viveu a magia de Bonito
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent fill-current" />
                  ))}
                </div>
                <CardTitle className="text-lg">Maria Silva</CardTitle>
                <CardDescription>São Paulo, SP</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "Experiência incrível! A flutuação no Rio da Prata foi mágica. Águas cristalinas e peixes coloridos. A
                  Bonito ON organizou tudo perfeitamente."
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent fill-current" />
                  ))}
                </div>
                <CardTitle className="text-lg">João Santos</CardTitle>
                <CardDescription>Rio de Janeiro, RJ</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "O safari no Pantanal superou todas as expectativas. Vimos onças, jacarés e uma diversidade incrível
                  de aves. Guias muito preparados!"
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent fill-current" />
                  ))}
                </div>
                <CardTitle className="text-lg">Ana Costa</CardTitle>
                <CardDescription>Belo Horizonte, MG</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "A Gruta do Lago Azul é simplesmente espetacular! O atendimento da equipe foi excepcional do início ao
                  fim da viagem."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Quero Atendimento Section */}
      <section id="atendimento" className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Quero Atendimento</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Precisa de ajuda para planejar sua viagem? Fale conosco!
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
            onClick={() =>
              window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de atendimento personalizado.", "_blank")
            }
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Falar com um Consultor
          </Button>
        </div>
      </section>

      {/* Hotéis em Bonito Section */}
      <section id="hoteis" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Hotéis em Bonito</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Encontre as melhores opções de hospedagem para sua estadia em Bonito.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/10">
                <Image
                  src="/Hotel-Aguas-de-Bonito.webp"
                  alt="Hotel 1"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Hotel Águas de Bonito</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <CardDescription className="text-justify flex-1">
                  Conforto e lazer em um dos melhores hotéis da cidade, com piscinas e áreas verdes.
                </CardDescription>
                <Button
                  className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white"
                  variant="default"
                  onClick={() =>
                    window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de informações sobre o Hotel Águas de Bonito.", "_blank")
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-accent/20 to-primary/10">
                <Image
                  src="/zagaia-eco-resort.webp"
                  alt="Hotel 2"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Zagaia Eco Resort</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <CardDescription className="text-justify flex-1">
                  Um resort completo com diversas opções de lazer e contato direto com a natureza.
                </CardDescription>
                <Button
                  className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white"
                  variant="default"
                  onClick={() =>
                    window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de informações sobre o Zagaia Eco Resort.", "_blank")
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/10">
                <Image
                  src="/hotel-cabanas.webp"
                  alt="Hotel 3"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Hotel Cabanas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <CardDescription className="text-justify flex-1">
                  Hospedagem aconchegante com acesso direto ao Rio Formoso e atividades de aventura.
                </CardDescription>
                <Button
                  className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white"
                  variant="default"
                  onClick={() =>
                    window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de informações sobre o Hotel Cabanas.", "_blank")
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-accent/20 to-primary/10">
                <Image
                  src="/pousada-boyra.webp"
                  alt="Hotel 4"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Pousada Boyrá</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <CardDescription className="text-justify flex-1">
                  Charme e tranquilidade em uma pousada rústica, ideal para quem busca contato com a natureza.
                </CardDescription>
                <Button
                  className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white"
                  variant="default"
                  onClick={() =>
                    window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de informações sobre a Pousada Boyrá.", "_blank")
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Transportes em Bonito Section */}
      <section id="transportes" className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Transportes em Bonito</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Garanta seu deslocamento com segurança e conforto em Bonito e região.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/10">
                <Image
                  src="/onde-posso-alugar-um-carro.webp"
                  alt="Locação de Carros"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Locação de Carros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <CardDescription className="text-justify flex-1">
                  Alugue um carro para explorar Bonito e região com total liberdade e flexibilidade.
                </CardDescription>
                <Button
                  className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white"
                  variant="default"
                  onClick={() =>
                    window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de informações sobre locação de carros em Bonito.", "_blank")
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Falar com Especialista
                </Button>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-accent/20 to-primary/10">
                <Image
                  src="/grupos-rodoviarios.webp"
                  alt="Grupos Rodoviários"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Grupos Rodoviários</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <CardDescription className="text-justify flex-1">
                  Organize sua viagem em grupo com ônibus e vans confortáveis para Bonito e região.
                </CardDescription>
                <Button
                  className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white"
                  variant="default"
                  onClick={() =>
                    window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de informações sobre grupos rodoviários em Bonito.", "_blank")
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Falar com Especialista
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pacotes em Bonito Section */}
      <section id="pacotes" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Pacotes em Bonito</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Descubra nossos pacotes completos para uma viagem inesquecível.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/10">
                <div className="absolute inset-0 bg-[url('/rio_da_prata_debaixo_da_agua.webp')] bg-cover bg-center"></div>
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  5
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Pacote Aventura
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <CardDescription>
                  Descubra as emoções de Bonito com flutuação, cachoeiras e trilhas.
                </CardDescription>
                <div className="mt-4 flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-primary">R$ 1.993,00</span>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de informações sobre o Pacote Aventura.", "_blank")}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/10">
                <div className="absolute inset-0 bg-[url('/pacote-casal.webp')] bg-cover bg-center"></div>
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  5
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Pacote Casal
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <CardDescription>
                  Conecte-se com a natureza em passeios de ecoturismo e aventura.
                </CardDescription>
                <div className="mt-4 flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-primary">R$ 1.875,00</span>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de informações sobre o Pacote Ecoturismo.", "_blank")}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-accent/20 to-primary/10">
                <div className="absolute inset-0 bg-[url('/balneario-nascente-azul.webp')] bg-cover bg-center"></div>
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  5
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Pacote Baixa Temporada
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <CardDescription>
                  O melhor de Bonito em uma experiência exclusiva com serviços diferenciados.
                </CardDescription>
                <div className="mt-4 flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-primary">R$ 433,00</span>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de informações sobre o Pacote Premium.", "_blank")}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="relative h-48 bg-gradient-to-br from-accent/20 to-primary/10">
                <div className="absolute inset-0 bg-[url('/gruta_do_lago_azul_principal.webp')] bg-cover bg-center"></div>
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  4.8
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Pacote Família
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <CardDescription>
                  Momentos inesquecíveis para toda a família com passeios leves e seguros.
                </CardDescription>
                <div className="mt-4 flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-primary">R$ 2.385,00</span>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de informações sobre o Pacote Família.", "_blank")}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
            onClick={() =>
              window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de informações sobre pacotes para Bonito.", "_blank")
            }
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Falar com Especialista em Pacotes
          </Button>
        </div>
      </section>


      {/* CTA Final */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para Sua Aventura?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Entre em contato conosco e monte seu roteiro personalizado para descobrir as maravilhas de Bonito
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="px-8 py-4 text-lg"
            onClick={() =>
              window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de montar um roteiro para Bonito.", "_blank")
            }
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Falar no WhatsApp Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Image src="/logo.png" alt="Bonito ON" width={120} height={40} className="h-10 w-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Sua agência especializada em ecoturismo em Bonito, MS. Oferecemos experiências únicas e inesquecíveis na
                natureza preservada.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  (67) 99139-5384
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  contato@bonitoon.com.br
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Experiências</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Cachoeiras
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Flutuação
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Grutas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pantanal
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Informações</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Sobre Nós
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Como Chegar
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Dicas de Viagem
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Política de Cancelamento
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>CNPJ: 47.950.064/0001-17 Bonito ON. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          onClick={() =>
            window.open("https://wa.me/5567991395384?text=Olá! Vim do site. Gostaria de montar um roteiro para Bonito.", "_blank")
          }
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      <ContactModal isOpen={isContactModalOpen} setIsOpen={setIsContactModalOpen} />
    </div>
  )
}
