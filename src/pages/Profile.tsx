import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit2, Save, X, User, Target, Heart, Calendar, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  age: string;
  goals: string[];
  conditions: string[];
  joinDate?: string;
  lastExamDate?: string;
  totalExams?: number;
  healthScore?: number;
}

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('healthtrack-user');
    if (storedUserData) {
      const data = JSON.parse(storedUserData);
      // Adicionar dados calculados do sistema
      const enhancedData = {
        ...data,
        joinDate: data.joinDate || new Date().toISOString().split('T')[0],
        lastExamDate: "2024-12-15", // Mock - seria calculado dos exames
        totalExams: 3, // Mock - seria calculado dos exames
        healthScore: 85 // Mock - seria calculado baseado nos exames
      };
      setUserData(enhancedData);
      setEditData(enhancedData);
    }
  }, []);

  const handleSave = () => {
    if (editData) {
      localStorage.setItem('healthtrack-user', JSON.stringify(editData));
      setUserData(editData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const toggleGoal = (goal: string) => {
    if (!editData) return;
    setEditData(prev => ({
      ...prev!,
      goals: prev!.goals.includes(goal)
        ? prev!.goals.filter(g => g !== goal)
        : [...prev!.goals, goal]
    }));
  };

  const toggleCondition = (condition: string) => {
    if (!editData) return;
    setEditData(prev => ({
      ...prev!,
      conditions: prev!.conditions.includes(condition)
        ? prev!.conditions.filter(c => c !== condition)
        : [...prev!.conditions, condition]
    }));
  };

  const healthGoals = [
    "Perder peso", "Ganhar massa muscular", "Melhorar condicionamento",
    "Controlar diabetes", "Reduzir colesterol", "Melhorar sono",
    "Reduzir estresse", "Prevenção de doenças"
  ];

  const healthConditions = [
    "Diabetes", "Hipertensão", "Colesterol alto", "Problemas cardíacos",
    "Obesidade", "Ansiedade/Depressão", "Artrite", "Nenhuma condição especial"
  ];

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Carregando perfil...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="bg-card shadow-soft border-b border-border">
        <div className="px-4 py-3 lg:max-w-4xl lg:mx-auto lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="p-2">
                <ArrowLeft className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Voltar</span>
              </Button>
              <div className="lg:hidden">
                <h1 className="text-lg font-bold text-foreground">Perfil</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel} className="p-2 lg:px-3">
                    <X className="h-4 w-4 lg:mr-2" />
                    <span className="hidden lg:inline">Cancelar</span>
                  </Button>
                  <Button size="sm" onClick={handleSave} className="p-2 lg:px-3">
                    <Save className="h-4 w-4 lg:mr-2" />
                    <span className="hidden lg:inline">Salvar</span>
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="p-2 lg:px-3">
                  <Edit2 className="h-4 w-4 lg:mr-2" />
                  <span className="hidden lg:inline">Editar</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 lg:max-w-4xl lg:mx-auto lg:py-8 space-y-6 lg:space-y-8">
        {/* Profile Header */}
        <Card className="border-0 shadow-medium">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col items-center space-y-4 lg:flex-row lg:items-start lg:space-y-0 lg:space-x-6">
              <Avatar className="h-16 w-16 lg:h-24 lg:w-24">
                <AvatarFallback className="text-lg lg:text-2xl bg-gradient-primary text-primary-foreground">
                  {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center lg:text-left w-full">
                {isEditing ? (
                  <div className="space-y-3 lg:space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm">Nome</Label>
                      <Input
                        id="name"
                        value={editData?.name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev!, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age" className="text-sm">Idade</Label>
                      <Input
                        id="age"
                        type="number"
                        value={editData?.age || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev!, age: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{userData.name}</h1>
                    <p className="text-base lg:text-lg text-muted-foreground">{userData.age} anos</p>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-2">
                      Membro desde {new Date(userData.joinDate!).toLocaleDateString('pt-BR')}
                    </p>
                  </>
                )}
              </div>

              {/* Health Score */}
              <div className="text-center lg:flex-shrink-0">
                <div className="bg-gradient-primary p-3 lg:p-4 rounded-lg text-primary-foreground">
                  <div className="text-xl lg:text-2xl font-bold">{userData.healthScore}%</div>
                  <div className="text-xs lg:text-sm opacity-90">Score de Saúde</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          <Card className="border-0 shadow-soft">
            <CardContent className="p-4 lg:p-6 text-center">
              <div className="bg-primary/10 p-2 lg:p-3 rounded-full inline-block mb-2 lg:mb-3">
                <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
              </div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">{userData.totalExams}</div>
              <p className="text-xs lg:text-sm text-muted-foreground">Exames Analisados</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-4 lg:p-6 text-center">
              <div className="bg-health-good/10 p-2 lg:p-3 rounded-full inline-block mb-2 lg:mb-3">
                <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-health-good" />
              </div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">Melhorando</div>
              <p className="text-xs lg:text-sm text-muted-foreground">Tendência Geral</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft sm:col-span-1">
            <CardContent className="p-4 lg:p-6 text-center">
              <div className="bg-secondary/10 p-2 lg:p-3 rounded-full inline-block mb-2 lg:mb-3">
                <Heart className="h-5 w-5 lg:h-6 lg:w-6 text-secondary" />
              </div>
              <div className="text-lg lg:text-2xl font-bold text-foreground">
                {new Date(userData.lastExamDate!).toLocaleDateString('pt-BR')}
              </div>
              <p className="text-xs lg:text-sm text-muted-foreground">Último Exame</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Health Goals */}
          <Card className="border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Objetivos de Saúde
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 gap-3">
                  {healthGoals.map((goal) => (
                    <Badge
                      key={goal}
                      variant={editData?.goals.includes(goal) ? "default" : "outline"}
                      className="p-3 cursor-pointer text-center justify-center hover:bg-primary/10"
                      onClick={() => toggleGoal(goal)}
                    >
                      {goal}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userData.goals.map((goal) => (
                    <Badge key={goal} variant="secondary" className="bg-primary/10 text-primary">
                      {goal}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Conditions */}
          <Card className="border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <User className="h-5 w-5 mr-2 text-primary" />
                Condições de Saúde
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 gap-3">
                  {healthConditions.map((condition) => (
                    <Badge
                      key={condition}
                      variant={editData?.conditions.includes(condition) ? "default" : "outline"}
                      className="p-3 cursor-pointer text-center justify-center hover:bg-primary/10"
                      onClick={() => toggleCondition(condition)}
                    >
                      {condition}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userData.conditions.map((condition) => (
                    <Badge key={condition} variant="outline" className="border-muted-foreground/30">
                      {condition}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Personalized Recommendations */}
        <Card className="border-0 shadow-medium bg-gradient-health">
          <CardHeader>
            <CardTitle className="text-primary-foreground">
              🎯 Recomendações Personalizadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userData.goals.includes("Perder peso") && (
              <p className="text-primary-foreground/90 text-sm">
                • Baseado no seu objetivo de perder peso, recomendamos monitorar regularmente os exames de perfil lipídico
              </p>
            )}
            {userData.conditions.includes("Diabetes") && (
              <p className="text-primary-foreground/90 text-sm">
                • Como você monitora diabetes, sugerimos exames de glicose a cada 3 meses
              </p>
            )}
            {userData.goals.includes("Melhorar condicionamento") && (
              <p className="text-primary-foreground/90 text-sm">
                • Para melhorar condicionamento, considere adicionar exames de função cardíaca ao seu check-up
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}