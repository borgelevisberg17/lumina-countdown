import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
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
        <h1>Política de Privacidade</h1>
        <p><strong>Última atualização:</strong> 01 de Janeiro de 2026</p>
        <p>Esta Política explica como coletamos e usamos dados no YearRecap AI, em conformidade com CCPA, GDPR e leis de AI de 2026.</p>
        <h3>Dados Coletados</h3>
        <ul>
          <li><strong>Conta:</strong> Email, nome, prompts.</li>
          <li><strong>Conteúdo:</strong> Fotos uploadadas (armazenadas temporariamente, deletadas após 30 dias).</li>
          <li><strong>Uso:</strong> Analytics anônimos.</li>
        </ul>
        <h3>Uso de Dados</h3>
        <ul>
          <li>Gerar vídeos; melhorar IA (dados anônimos para training).</li>
          <li>Compartilhamento com provedores de IA e Paddle para pagamentos.</li>
          <li>Não vendemos dados.</li>
        </ul>
        <h3>Direitos do Usuário</h3>
        <p>Acesso/deleção/export: Email support@yearrecapai.com. Uploads requerem consent explícito.</p>
        <p><strong>Segurança:</strong> Criptografia AES-256.</p>
      </main>
    </div>
  );
}
