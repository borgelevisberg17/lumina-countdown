import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Save, Undo, Redo, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EditorHeaderProps {
  plan: string;
  credits: number;
}

export function EditorHeader({ plan, credits }: EditorHeaderProps) {
  const planLabel = plan === "vip" ? "VIP" : plan === "pro" ? "PRO" : "Free";
  const planVariant = plan === "vip" ? "default" : plan === "pro" ? "secondary" : "outline";

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="w-8 h-8" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-display font-semibold">Editor</span>
        </div>
      </div>

      {/* Center section - History controls */}
      <div className="flex-1 flex items-center justify-center gap-1">
        <Button variant="ghost" size="icon" className="w-8 h-8" disabled>
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8" disabled>
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <Badge variant={planVariant as any} className="text-xs">
          {planLabel}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {credits} créditos
        </Badge>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
