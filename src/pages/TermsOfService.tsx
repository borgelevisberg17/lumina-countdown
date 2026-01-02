import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">YearRecap AI</span>
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 max-w-3xl prose prose-invert">
        <h1>Termos de Serviço</h1>
        <p><strong>Última atualização:</strong> 01 de Janeiro de 2026</p>
        <p>Ao usar YearRecap AI, você concorda com estes Termos.</p>
        <h3>Uso do Serviço</h3>
        <ul>
          <li><strong>Idade mínima:</strong> 13 anos.</li>
          <li><strong>Conteúdo Proibido:</strong> Não gere deepfakes sem consent, violência, nudez, hate speech ou violações de copyright.</li>
          <li><strong>Propriedade:</strong> Você detém direitos sobre vídeos gerados; conceda licença para processamento.</li>
        </ul>
        <h3>Assinaturas</h3>
        <p>Via Paddle: Recorrentes semanais; gerencie no dashboard.</p>
        <h3>Limitação de Responsabilidade</h3>
        <p>Serviço "as is"; não garantimos perfeição em outputs IA. Não responsáveis por misuse de conteúdo gerado.</p>
        <p><strong>Lei Aplicável:</strong> Leis de Angola e CA (para AI transparency).</p>
        <p>Contato: support@yearrecapai.com</p>
      </main>
    </div>
  );
}
