import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPlan } from "@/hooks/useUserPlan";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  Video, 
  Image, 
  CreditCard, 
  Settings, 
  LogOut,
  Plus,
  Clock,
  Zap,
  Crown
} from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { subscription, credits, loading: planLoading } = useUserPlan();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Você saiu da sua conta");
    navigate("/");
  };

  if (authLoading || planLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="w-8 h-8 animate-pulse text-primary" />
      </div>
    );
  }

  const plan = subscription?.plan || "free";
  const creditBalance = credits?.balance || 0;
  const weeklyAllowance = credits?.weekly_allowance || 20;
  const creditPercentage = Math.min((creditBalance / weeklyAllowance) * 100, 100);

  const planLimits = {
    free: { photos: 10, duration: 30, features: ["Transições básicas", "1 template de legenda"] },
    pro: { photos: 20, duration: 60, features: ["Todos templates", "Música custom", "Preview HD"] },
    vip: { photos: "∞", duration: 120, features: ["Tudo do Pro", "Export 4K", "Efeitos avançados"] },
  };

  const currentLimits = planLimits[plan as keyof typeof planLimits];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              YearRecap AI
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Badge variant={plan === "vip" ? "default" : plan === "pro" ? "secondary" : "outline"}>
              {plan === "vip" && <Crown className="w-3 h-3 mr-1" />}
              {plan.toUpperCase()}
            </Badge>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Credits Card */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-yellow-500" />
                Créditos
              </CardTitle>
              <CardDescription>Renovam semanalmente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">{creditBalance}</span>
                  <span className="text-muted-foreground mb-1">/ {weeklyAllowance}</span>
                </div>
                <Progress value={creditPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Próxima renovação em 7 dias
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Plan Card */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-primary" />
                Seu Plano
              </CardTitle>
              <CardDescription>Limites atuais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fotos por vídeo:</span>
                  <span className="font-medium">{currentLimits.photos}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duração máxima:</span>
                  <span className="font-medium">{currentLimits.duration}s</span>
                </div>
                {plan !== "vip" && (
                  <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                    <Link to="/pricing">Fazer Upgrade</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Video className="w-5 h-5 text-accent" />
                Seus Vídeos
              </CardTitle>
              <CardDescription>Histórico de retrospectivas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-muted-foreground text-sm mb-4">
                  Nenhum vídeo criado ainda
                </p>
                <Button asChild>
                  <Link to="/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Vídeo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Create New Video CTA */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 p-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Crie sua Retrospectiva 2025</h2>
              <p className="text-muted-foreground max-w-md">
                Faça upload das suas melhores fotos e deixe a IA criar um vídeo incrível com transições, música e legendas animadas.
              </p>
            </div>
            <Button size="lg" asChild className="shrink-0">
              <Link to="/create">
                <Sparkles className="w-5 h-5 mr-2" />
                Começar Agora
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
          {currentLimits.features.map((feature, index) => (
            <Card key={index} className="border-border/30 bg-card/50">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
