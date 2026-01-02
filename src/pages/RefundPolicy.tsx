import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RefundPolicy() {
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
        <h1>Política de Reembolso</h1>
        <p><strong>Última atualização:</strong> 01 de Janeiro de 2026</p>
        <p>No YearRecap AI, valorizamos a satisfação do usuário. Esta Política de Reembolso aplica-se a assinaturas e créditos comprados.</p>
        <h3>Assinaturas Recorrentes</h3>
        <ul>
          <li>Reembolsos totais disponíveis dentro de 7 dias da compra inicial, se menos de 50% dos créditos forem usados.</li>
          <li>Após 7 dias ou 50%+ créditos usados: Sem reembolso.</li>
          <li>Cancelamentos: Pode cancelar a qualquer momento via dashboard; cobrança para até o fim do ciclo semanal.</li>
        </ul>
        <h3>Créditos Individuais</h3>
        <p>Não reembolsáveis, exceto em erros técnicos comprovados.</p>
        <h3>Como Solicitar</h3>
        <p>Envie email para support@yearrecapai.com com detalhes da transação. Processamos em 5-10 dias úteis.</p>
        <p><em>Nota: Não reembolsamos por misuse de IA (ex: conteúdo proibido). Processado via Paddle.</em></p>
      </main>
    </div>
  );
}
