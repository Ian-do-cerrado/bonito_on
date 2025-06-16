"use client"

import { useState, useEffect } from "react"
import { BlogCard } from "@/components/blog-card"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  publishedAt: string
  readTime: number
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  gallery?: string[]
}

export function BlogSection() {
  const { t } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    // Load blog posts from localStorage
    const savedPosts = localStorage.getItem("blogPosts")
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    } else {
      // Default posts if none exist
      const defaultPosts: BlogPost[] = [
        {
          id: "1",
          title: "Os Melhores Passeios Aquáticos em Bonito",
          excerpt: "Descubra as águas cristalinas de Bonito e os passeios imperdíveis para toda a família.",
          content:
            "Bonito é mundialmente conhecido por suas águas cristalinas e passeios aquáticos únicos. Neste guia completo, vamos explorar os melhores destinos para quem busca aventura e contemplação nas águas mais puras do Brasil.\n\n## Flutuação no Rio da Prata\n\nO Rio da Prata oferece uma das experiências de flutuação mais incríveis do mundo. Com visibilidade de até 50 metros, você poderá observar peixes coloridos, plantas aquáticas e a fauna local em seu habitat natural.\n\n### O que esperar:\n- Águas cristalinas com temperatura constante\n- Diversidade de peixes nativos\n- Trilha ecológica antes da flutuação\n- Equipamentos de segurança inclusos\n\n## Gruta do Lago Azul\n\nUma das atrações mais famosas de Bonito, a Gruta do Lago Azul impressiona visitantes do mundo todo com suas águas azul-turquesa e formações rochosas milenares.\n\n### Dicas importantes:\n- Melhor horário: entre 10h e 14h\n- Levar câmera fotográfica\n- Usar calçados antiderrapantes\n- Respeitar as normas ambientais\n\n## Aquário Natural\n\nO Aquário Natural é perfeito para famílias com crianças, oferecendo uma experiência de flutuação mais tranquila em águas rasas e cristalinas.\n\n### Características:\n- Ideal para iniciantes\n- Águas rasas e calmas\n- Rica fauna aquática\n- Estrutura completa para visitantes\n\nBonito oferece muito mais que estes passeios. Cada experiência aquática é única e proporciona uma conexão especial com a natureza preservada do Mato Grosso do Sul.",
          image: "/placeholder.svg?height=300&width=400",
          author: "Maria Silva",
          publishedAt: "2024-01-15",
          readTime: 8,
          tags: ["passeios", "águas cristalinas", "família", "flutuação", "ecoturismo"],
          seoTitle: "Melhores Passeios Aquáticos Bonito MS - Guia Completo 2024",
          seoDescription:
            "Conheça os melhores passeios aquáticos em Bonito MS. Águas cristalinas, flutuação e muito mais! Guia completo com dicas e informações.",
          seoKeywords: ["bonito ms", "passeios aquáticos", "flutuação", "águas cristalinas", "ecoturismo"],
          gallery: [
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
          ],
        },
        {
          id: "2",
          title: "Gastronomia Pantaneira: Sabores Únicos",
          excerpt: "Explore os sabores autênticos da culinária pantaneira em Bonito.",
          content:
            "A gastronomia pantaneira é uma das grandes riquezas culturais de Bonito e região. Com influências indígenas, portuguesas e paraguaias, a culinária local oferece pratos únicos que contam a história do Pantanal.\n\n## Pratos Típicos Imperdíveis\n\n### Pacu Assado\nO pacu é um dos peixes mais tradicionais da região. Assado na brasa com temperos locais, é uma experiência gastronômica única.\n\n### Piranha Frita\nApesar do nome intimidador, a piranha é um peixe saboroso e muito apreciado na culinária pantaneira.\n\n### Farofa de Banana\nAcompanhamento tradicional feito com banana pacova, farinha de mandioca e temperos especiais.\n\n### Pamonha de Milho Verde\nDoce tradicional feito com milho verde ralado na hora, envolvido em palha de milho.\n\n## Restaurantes Recomendados\n\n### Casa do João\n- Especialidade: Peixes do Pantanal\n- Ambiente: Rústico e acolhedor\n- Destaque: Pacu pintado grelhado\n\n### Pantanal Grill\n- Especialidade: Carnes e peixes\n- Ambiente: Familiar\n- Destaque: Rodízio de peixes\n\n### Sabores do Cerrado\n- Especialidade: Culinária regional\n- Ambiente: Típico pantaneiro\n- Destaque: Pratos com ingredientes do cerrado\n\n## Ingredientes Locais\n\nA culinária pantaneira utiliza ingredientes únicos da região:\n- Pequi: fruto do cerrado com sabor marcante\n- Bocaiuva: palmeira nativa usada em doces\n- Mandioca: base de muitos pratos\n- Peixes de água doce: pacu, pintado, dourado\n\nA gastronomia de Bonito é uma viagem sensorial que complementa perfeitamente a experiência de ecoturismo na região.",
          image: "/Bacuri_Cozinha_Regional.webp",
          author: "Ian Yamaguchi",
          publishedAt: "2024-01-10",
          readTime: 6,
          tags: ["gastronomia", "pantanal", "culinária", "restaurantes", "cultura"],
          seoTitle: "Gastronomia Pantaneira em Bonito - Sabores Autênticos",
          seoDescription:
            "Descubra a rica gastronomia pantaneira em Bonito MS. Pratos típicos, restaurantes e ingredientes locais únicos.",
          seoKeywords: ["gastronomia pantaneira", "bonito ms", "culinária", "restaurantes", "pacu"],
          gallery: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
        },
        {
          id: "3",
          title: "Quando Visitar Bonito: Guia Completo",
          excerpt: "Saiba qual a melhor época para visitar Bonito e aproveitar ao máximo sua viagem.",
          content:
            "Escolher a época certa para visitar Bonito pode fazer toda a diferença na sua experiência. Cada estação oferece características únicas que podem influenciar seus passeios e atividades.\n\n## Estações em Bonito\n\n### Seca (Maio a Setembro)\nA estação seca é considerada a melhor época para visitar Bonito.\n\n**Vantagens:**\n- Águas mais cristalinas\n- Melhor visibilidade para flutuação\n- Clima mais ameno\n- Menor probabilidade de chuva\n\n**Temperaturas:**\n- Máximas: 25°C a 28°C\n- Mínimas: 10°C a 15°C\n\n### Chuvosa (Outubro a Abril)\nA estação chuvosa tem suas particularidades e também oferece experiências únicas.\n\n**Vantagens:**\n- Preços mais baixos\n- Menos turistas\n- Natureza mais exuberante\n- Cachoeiras com maior volume\n\n**Desvantagens:**\n- Águas menos cristalinas\n- Possibilidade de cancelamento de passeios\n- Estradas em piores condições\n\n## Mês a Mês\n\n### Janeiro a Março\n- **Clima:** Quente e chuvoso\n- **Prós:** Preços baixos, natureza exuberante\n- **Contras:** Águas turvas, chuvas frequentes\n\n### Abril a Maio\n- **Clima:** Transição para seca\n- **Prós:** Boa época, preços intermediários\n- **Contras:** Ainda pode chover\n\n### Junho a Agosto\n- **Clima:** Seco e frio\n- **Prós:** Melhor visibilidade, clima agradável\n- **Contras:** Alta temporada, preços elevados\n\n### Setembro a Outubro\n- **Clima:** Seco e quente\n- **Prós:** Ótima visibilidade, clima bom\n- **Contras:** Início da alta temporada\n\n### Novembro a Dezembro\n- **Clima:** Início das chuvas\n- **Prós:** Preços intermediários\n- **Contras:** Chuvas esporádicas\n\n## Dicas de Planejamento\n\n### Reserve com Antecedência\n- Passeios limitados por dia\n- Hospedagem concorrida na alta temporada\n- Melhores preços com antecedência\n\n### Documentos Necessários\n- RG ou CNH com foto\n- Comprovante de vacinação (quando exigido)\n- Seguro viagem (recomendado)\n\n### O que Levar\n- Protetor solar\n- Repelente\n- Roupas leves e confortáveis\n- Calçados para trilha\n- Câmera à prova d'água\n\nA melhor época para visitar Bonito depende do seu perfil de viajante e do que você busca na experiência. Para águas cristalinas e melhor visibilidade, prefira a estação seca. Para economia e menos multidões, considere a estação chuvosa.",
          image: "/cachoeira_rio_do_peixe.webp",
          author: "Ana Costa",
          publishedAt: "2024-01-05",
          readTime: 10,
          tags: ["dicas", "planejamento", "clima", "quando visitar", "guia"],
          seoTitle: "Melhor Época para Visitar Bonito MS - Guia Completo 2024",
          seoDescription:
            "Descubra quando visitar Bonito MS. Clima, preços e dicas para planejar sua viagem perfeita. Guia completo atualizado.",
          seoKeywords: ["quando visitar bonito", "melhor época", "bonito ms", "planejamento viagem", "clima"],
          gallery: [],
        },
      ]
      setPosts(defaultPosts)
      localStorage.setItem("blogPosts", JSON.stringify(defaultPosts))
    }
  }, [])

  return (
    <section id="blog" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("blogTitle")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("blogSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 8).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length > 8 && (
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg rounded-full font-semibold transition-all duration-300 hover:scale-105"
              >
                {t("viewAllPosts") || "Ver Blog"}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
