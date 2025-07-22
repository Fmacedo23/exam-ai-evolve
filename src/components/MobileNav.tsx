import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart, Upload, Activity, Settings, User } from "lucide-react";

interface MobileNavProps {
  onUploadClick: () => void;
}

export function MobileNav({ onUploadClick }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 bg-card">
          <div className="flex flex-col h-full">
            <div className="flex items-center space-x-2 pb-6 border-b border-border">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Minha Saúde</h2>
                <p className="text-xs text-muted-foreground">Menu Principal</p>
              </div>
            </div>
            
            <nav className="flex-1 py-6 space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => setIsOpen(false)}
              >
                <Activity className="h-4 w-4 mr-3" />
                Dashboard
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  onUploadClick();
                  setIsOpen(false);
                }}
              >
                <Upload className="h-4 w-4 mr-3" />
                Enviar Exame
              </Button>
              
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-3" />
                Perfil
              </Button>
              
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-3" />
                Configurações
              </Button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}