import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Plus, Target, Trophy, TrendingUp, Calendar } from 'lucide-react';

interface HealthGoal {
  id: string;
  title: string;
  description: string;
  category: 'cholesterol' | 'blood_pressure' | 'weight' | 'glucose' | 'exercise' | 'other';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  progress: number;
}

const goalCategories = {
  cholesterol: { label: 'Colesterol', icon: '🩸', color: 'text-red-500' },
  blood_pressure: { label: 'Pressão Arterial', icon: '💓', color: 'text-pink-500' },
  weight: { label: 'Peso', icon: '⚖️', color: 'text-blue-500' },
  glucose: { label: 'Glicose', icon: '🍯', color: 'text-yellow-500' },
  exercise: { label: 'Exercício', icon: '🏃', color: 'text-green-500' },
  other: { label: 'Outro', icon: '🎯', color: 'text-purple-500' }
};

export function HealthGoals() {
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'cholesterol' as keyof typeof goalCategories,
    targetValue: 0,
    currentValue: 0,
    unit: '',
    deadline: ''
  });

  useEffect(() => {
    const savedGoals = localStorage.getItem('healthGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Mock data
      const mockGoals: HealthGoal[] = [
        {
          id: '1',
          title: 'Reduzir Colesterol',
          description: 'Diminuir o colesterol total para menos de 200 mg/dL',
          category: 'cholesterol',
          targetValue: 200,
          currentValue: 240,
          unit: 'mg/dL',
          deadline: '2024-12-31',
          status: 'active',
          createdAt: '2024-01-15',
          progress: 25
        },
        {
          id: '2',
          title: 'Controlar Pressão',
          description: 'Manter pressão arterial abaixo de 130/80',
          category: 'blood_pressure',
          targetValue: 130,
          currentValue: 145,
          unit: 'mmHg',
          deadline: '2024-08-30',
          status: 'active',
          createdAt: '2024-02-01',
          progress: 60
        }
      ];
      setGoals(mockGoals);
      localStorage.setItem('healthGoals', JSON.stringify(mockGoals));
    }
  }, []);

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.targetValue) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const goal: HealthGoal = {
      id: Date.now().toString(),
      ...newGoal,
      status: 'active',
      createdAt: new Date().toISOString(),
      progress: Math.min((newGoal.currentValue / newGoal.targetValue) * 100, 100)
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    localStorage.setItem('healthGoals', JSON.stringify(updatedGoals));

    toast({
      title: "Meta Criada! 🎯",
      description: `Nova meta "${goal.title}" adicionada com sucesso!`
    });

    setNewGoal({
      title: '',
      description: '',
      category: 'cholesterol',
      targetValue: 0,
      currentValue: 0,
      unit: '',
      deadline: ''
    });
    setIsDialogOpen(false);
  };

  const updateGoalProgress = (goalId: string, newValue: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const progress = Math.min((newValue / goal.targetValue) * 100, 100);
        const wasCompleted = goal.status === 'completed';
        const isNowCompleted = progress >= 100;
        
        if (!wasCompleted && isNowCompleted) {
          toast({
            title: "🎉 Parabéns! Meta Conquistada!",
            description: `Você atingiu sua meta: ${goal.title}!`
          });
        }
        
        return {
          ...goal,
          currentValue: newValue,
          progress,
          status: progress >= 100 ? 'completed' as const : goal.status
        };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    localStorage.setItem('healthGoals', JSON.stringify(updatedGoals));
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { label: 'Ativa', variant: 'default' as const },
      completed: { label: 'Concluída', variant: 'secondary' as const },
      paused: { label: 'Pausada', variant: 'outline' as const }
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Target className="w-6 h-6" />
            Metas de Saúde
          </h2>
          <p className="text-muted-foreground">Defina e acompanhe seus objetivos de saúde</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 hover-scale">
              <Plus className="w-4 h-4" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Meta</DialogTitle>
              <DialogDescription>
                Defina um objetivo específico para sua saúde
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Reduzir colesterol"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={newGoal.category} 
                  onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value as keyof typeof goalCategories }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(goalCategories).map(([key, cat]) => (
                      <SelectItem key={key} value={key}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="targetValue">Meta *</Label>
                  <Input
                    id="targetValue"
                    type="number"
                    value={newGoal.targetValue || ''}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unidade</Label>
                  <Input
                    id="unit"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="mg/dL, kg, etc"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="currentValue">Valor Atual</Label>
                <Input
                  id="currentValue"
                  type="number"
                  value={newGoal.currentValue || ''}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, currentValue: Number(e.target.value) }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="deadline">Prazo</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva sua meta em detalhes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateGoal}>Criar Meta</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal) => {
          const category = goalCategories[goal.category];
          const statusBadge = getStatusBadge(goal.status);
          
          return (
            <Card key={goal.id} className="hover-scale transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription className="text-sm">{category.label}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{goal.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span className="font-medium">{goal.progress.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={goal.progress} 
                    className={`h-2 ${getProgressColor(goal.progress)}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Atual:</span>
                    <p className="font-medium">{goal.currentValue} {goal.unit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Meta:</span>
                    <p className="font-medium">{goal.targetValue} {goal.unit}</p>
                  </div>
                </div>

                {goal.deadline && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}

                {goal.status === 'active' && (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Novo valor"
                      className="text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const value = Number((e.target as HTMLInputElement).value);
                          if (value > 0) {
                            updateGoalProgress(goal.id, value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        const value = Number(input.value);
                        if (value > 0) {
                          updateGoalProgress(goal.id, value);
                          input.value = '';
                        }
                      }}
                    >
                      <TrendingUp className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {goal.status === 'completed' && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-lg">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">Meta conquistada! 🎉</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {goals.length === 0 && (
        <Card className="text-center py-8 animate-fade-in">
          <CardContent>
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Nenhuma meta definida</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando sua primeira meta de saúde
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeira Meta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}