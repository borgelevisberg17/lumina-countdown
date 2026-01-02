import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "Grátis",
    period: "",
    description: "Para experimentar",
    credits: "50 créditos/semana (renova 20)",
    features: [
      "Vídeos até 30 segundos",
      "Máximo 10 fotos por vídeo",
      "Transições básicas",
      "1 template de legenda",
      "Preview em baixa resolução",
    ],
    notIncluded: [
      "Música customizada",
      "Templates avançados",
      "Export em HD/4K",
    ],
    icon: Zap,
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$4.99",
    period: "/semana",
    description: "Para criadores frequentes",
    credits: "200 créditos/semana",
    features: [
      "Vídeos até 60 segundos",
      "Máximo 20 fotos por vídeo",
      "Todas as transições IA",
      "Todos templates de legenda",
      "Música customizada (upload)",
      "Preview em HD",
      "Histórico ilimitado",
      "Prompt customizado",
    ],
    notIncluded: [
      "Export em 4K",
      "Efeitos avançados",
    ],
    icon: Sparkles,
    popular: true,
  },
  {
    id: "vip",
    name: "VIP",
    price: "$9.99",
    period: "/semana",
    description: "Para profissionais",
    credits: "Créditos ilimitados",
    features: [
      "Vídeos até 120 segundos",
      "Fotos ilimitadas",
      "Todas as transições IA",
      "Todos templates de legenda",
      "Música gerada por IA",
      "Export em 4K",
      "Efeitos avançados (particles, slow-mo)",
      "Share social integrado",
      "Suporte prioritário",
    ],
    notIncluded: [],
    icon: Crown,
    popular: false,
  },
];

export default function Pricing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              YearRecap AI
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/auth">Entrar</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Planos flexíveis cobrados semanalmente. Cancele quando quiser.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`relative border-border/50 ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/20 scale-105"
                    : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Mais Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="text-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>

                  <div className="text-center">
                    <Badge variant="secondary">{plan.credits}</Badge>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground line-through">
                        <span className="w-4 h-4 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link to={user ? "/dashboard" : "/auth"}>
                      {plan.id === "free" ? "Começar Grátis" : "Assinar Agora"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Pagamentos processados com segurança via Paddle.</p>
          <p className="mt-2">
            Dúvidas?{" "}
            <Link to="/refund-policy" className="text-primary hover:underline">
              Política de Reembolso
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
