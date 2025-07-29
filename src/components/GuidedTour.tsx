import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowLeft, ArrowRight, Upload, Activity, Target, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  icon: React.ComponentType<any>;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Minha Saúde!',
    description: 'Este tour rápido te mostrará como usar a plataforma para acompanhar seus exames médicos.',
    target: 'header',
    icon: Activity,
    position: 'bottom'
  },
  {
    id: 'upload',
    title: 'Enviar Exames',
    description: 'Clique aqui para enviar seus exames em PDF. Nossa IA analisará automaticamente os resultados.',
    target: 'upload-button',
    icon: Upload,
    position: 'bottom'
  },
  {
    id: 'tabs',
    title: 'Navegação',
    description: 'Use essas abas para navegar entre diferentes seções: Visão Geral, Metas, Análises e Histórico.',
    target: 'navigation-tabs',
    icon: Calendar,
    position: 'bottom'
  },
  {
    id: 'goals',
    title: 'Metas de Saúde',
    description: 'Configure e acompanhe suas metas de saúde pessoais na aba Metas.',
    target: 'goals-tab',
    icon: Target,
    position: 'bottom'
  },
  {
    id: 'timeline',
    title: 'Timeline de Exames',
    description: 'Acompanhe todos os seus exames e clique em qualquer um para ver detalhes completos.',
    target: 'timeline-card',
    icon: Activity,
    position: 'right'
  }
];

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuidedTour({ isOpen, onClose }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightTarget, setHighlightTarget] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && currentStep < tourSteps.length) {
      setHighlightTarget(tourSteps[currentStep].target);
      
      // Scroll to target element smoothly
      const targetElement = document.querySelector(`[data-tour="${tourSteps[currentStep].target}"]`);
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
      }
    } else {
      setHighlightTarget(null);
    }
  }, [isOpen, currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('healthtrack-tour-completed', 'true');
    setCurrentStep(0);
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('healthtrack-tour-completed', 'true');
    onClose();
  };

  if (!isOpen || currentStep >= tourSteps.length) return null;

  const currentTourStep = tourSteps[currentStep];
  const Icon = currentTourStep.icon;

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in" />
      
      {/* Highlight effect */}
      {highlightTarget && (
        <style>
          {`
            [data-tour="${highlightTarget}"] {
              position: relative;
              z-index: 45;
              box-shadow: 0 0 0 4px hsl(var(--primary) / 0.5), 0 0 30px hsl(var(--primary) / 0.3);
              border-radius: 8px;
              animation: pulse-glow 2s infinite;
            }
            
            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 0 0 4px hsl(var(--primary) / 0.5), 0 0 30px hsl(var(--primary) / 0.3); }
              50% { box-shadow: 0 0 0 6px hsl(var(--primary) / 0.7), 0 0 40px hsl(var(--primary) / 0.5); }
            }
          `}
        </style>
      )}

      {/* Tour card */}
      <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 max-w-[90vw] z-50 shadow-2xl border-2 border-primary/20 animate-scale-in">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{currentTourStep.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Passo {currentStep + 1} de {tourSteps.length}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="p-1 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {currentTourStep.description}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-1 mb-4">
            <div 
              className="bg-gradient-primary h-1 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="hover-scale"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Pular tour
              </Button>
              <Button
                onClick={handleNext}
                size="sm"
                className="bg-gradient-primary hover:opacity-90 hover-scale"
              >
                {currentStep === tourSteps.length - 1 ? (
                  'Finalizar'
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Hook para verificar se deve mostrar o tour
export function useGuidedTour() {
  const [shouldShowTour, setShouldShowTour] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('healthtrack-tour-completed');
    const userOnboarded = localStorage.getItem('healthtrack-user');
    
    // Mostrar tour apenas se o usuário completou onboarding mas nunca viu o tour
    if (userOnboarded && !tourCompleted) {
      // Aguardar um pouco para a interface carregar
      setTimeout(() => setShouldShowTour(true), 1000);
    }
  }, []);

  const closeTour = () => setShouldShowTour(false);

  return { shouldShowTour, closeTour };
}