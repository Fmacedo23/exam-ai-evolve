import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, Activity, Calendar, Target } from "lucide-react";

interface OnboardingProps {
  onComplete: (userData: UserData) => void;
}

interface UserData {
  name: string;
  age: string;
  goals: string[];
  conditions: string[];
}

const healthGoals = [
  "Perder peso",
  "Ganhar massa muscular", 
  "Melhorar condicionamento",
  "Controlar diabetes",
  "Reduzir colesterol",
  "Melhorar sono",
  "Reduzir estresse",
  "Prevenção de doenças"
];

const healthConditions = [
  "Diabetes",
  "Hipertensão",
  "Colesterol alto",
  "Problemas cardíacos",
  "Obesidade",
  "Ansiedade/Depressão",
  "Artrite",
  "Nenhuma condição especial"
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    age: "",
    goals: [],
    conditions: []
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(userData);
    }
  };

  const toggleSelection = (item: string, type: 'goals' | 'conditions') => {
    setUserData(prev => ({
      ...prev,
      [type]: prev[type].includes(item)
        ? prev[type].filter(i => i !== item)
        : [...prev[type], item]
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return true;
      case 2: return userData.name.trim() && userData.age.trim();
      case 3: return userData.goals.length > 0;
      case 4: return userData.conditions.length > 0;
      default: return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              {step === 1 && <Heart className="h-8 w-8 text-primary" />}
              {step === 2 && <Activity className="h-8 w-8 text-primary" />}
              {step === 3 && <Target className="h-8 w-8 text-primary" />}
              {step === 4 && <Calendar className="h-8 w-8 text-primary" />}
            </div>
          </div>
          
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full transition-colors ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto max-h-[60vh]">
          {step === 1 && (
            <div className="text-center space-y-4">
              <CardTitle className="text-2xl">Bem-vindo ao HealthTracker! 👋</CardTitle>
              <p className="text-muted-foreground text-lg">
                Vamos configurar seu perfil de saúde para personalizar sua experiência
              </p>
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  ✨ Análise inteligente de exames<br/>
                  📊 Dashboard personalizado<br/>
                  🎯 Metas de saúde personalizadas
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <CardTitle>Conte-nos sobre você</CardTitle>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    placeholder="Digite seu nome"
                    value={userData.name}
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Digite sua idade"
                    value={userData.age}
                    onChange={(e) => setUserData(prev => ({ ...prev, age: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <CardTitle>Quais são seus objetivos de saúde?</CardTitle>
              <p className="text-muted-foreground">Selecione um ou mais objetivos</p>
              <div className="grid grid-cols-2 gap-3">
                {healthGoals.map((goal) => (
                  <Badge
                    key={goal}
                    variant={userData.goals.includes(goal) ? "default" : "outline"}
                    className="p-3 cursor-pointer text-center justify-center hover:bg-primary/10"
                    onClick={() => toggleSelection(goal, 'goals')}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <CardTitle>Condições de saúde</CardTitle>
              <p className="text-muted-foreground">Selecione condições que você possui ou monitora</p>
              <div className="grid grid-cols-2 gap-3">
                {healthConditions.map((condition) => (
                  <Badge
                    key={condition}
                    variant={userData.conditions.includes(condition) ? "default" : "outline"}
                    className="p-3 cursor-pointer text-center justify-center hover:bg-primary/10"
                    onClick={() => toggleSelection(condition, 'conditions')}
                  >
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <div className="p-6 border-t">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Voltar
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="min-w-[120px]"
            >
              {step === 4 ? 'Finalizar' : 'Próximo'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};