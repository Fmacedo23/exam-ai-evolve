import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Activity, Calendar, TrendingUp, FileText, Heart, Plus, User, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HealthTimeline } from "./HealthTimeline";
import { ExamUpload } from "./ExamUpload";
import { HealthStatus } from "./HealthStatus";
import { MobileNav } from "./MobileNav";
import { UploadModal } from "./UploadModal";
import { ExamViewer } from "./ExamViewer";
import { Onboarding } from "./Onboarding";
import { NotificationSystem } from "./NotificationSystem";
import { HealthCharts } from "./HealthCharts";
import { ExamComparison } from "./ExamComparison";
import { HealthGoals } from "./HealthGoals";
import { ThemeToggle } from "./ThemeToggle";
import { LoadingOverlay } from "./LoadingStates";
import { Login } from "./Login";

interface ExamData {
  id: string;
  type: string;
  date: string;
  status: "excellent" | "good" | "warning" | "critical";
  summary: string;
  fileName: string;
  details?: {
    parameters: Array<{
      name: string;
      value: string;
      reference: string;
      status: "normal" | "high" | "low";
    }>;
    recommendations: string[];
  };
}

// Mock data - será substituído por dados reais
const mockExams: ExamData[] = [
  {
    id: "1",
    type: "Hemograma Completo",
    date: "2024-12-15",
    status: "good",
    summary: "Todos os valores dentro da normalidade, leve baixa em vitamina D",
    fileName: "hemograma_dez2024.pdf",
    details: {
      parameters: [
        { name: "Hemoglobina", value: "14.2 g/dL", reference: "12.0-15.5", status: "normal" },
        { name: "Hematócrito", value: "42.1%", reference: "36.0-46.0", status: "normal" },
        { name: "Leucócitos", value: "7.200/mm³", reference: "4.000-11.000", status: "normal" },
        { name: "Vitamina D", value: "22 ng/mL", reference: "30-100", status: "low" }
      ],
      recommendations: [
        "Aumentar exposição solar segura (15-30 min/dia)",
        "Incluir alimentos ricos em vitamina D na dieta",
        "Considerar suplementação conforme orientação médica"
      ]
    }
  },
  {
    id: "2", 
    type: "Perfil Lipídico",
    date: "2024-09-10",
    status: "warning",
    summary: "Colesterol LDL levemente elevado (145 mg/dL). Recomenda-se dieta e exercícios",
    fileName: "lipidico_set2024.pdf",
    details: {
      parameters: [
        { name: "Colesterol Total", value: "220 mg/dL", reference: "<200", status: "high" },
        { name: "LDL", value: "145 mg/dL", reference: "<100", status: "high" },
        { name: "HDL", value: "45 mg/dL", reference: ">40", status: "normal" },
        { name: "Triglicerídeos", value: "180 mg/dL", reference: "<150", status: "high" }
      ],
      recommendations: [
        "Reduzir consumo de gorduras saturadas",
        "Aumentar atividade física (150 min/semana)",
        "Incluir fibras solúveis na alimentação",
        "Acompanhamento médico em 3 meses"
      ]
    }
  },
  {
    id: "3",
    type: "Glicose em Jejum",
    date: "2024-06-20",
    status: "excellent",
    summary: "Glicose normal (89 mg/dL). Excelente controle metabólico",
    fileName: "glicose_jun2024.pdf",
    details: {
      parameters: [
        { name: "Glicose", value: "89 mg/dL", reference: "70-99", status: "normal" },
        { name: "Hemoglobina Glicada", value: "5.1%", reference: "<5.7", status: "normal" }
      ],
      recommendations: [
        "Manter alimentação balanceada atual",
        "Continuar atividade física regular",
        "Repetir exame em 12 meses"
      ]
    }
  }
];

interface UserData {
  name: string;
  age: string;
  goals: string[];
  conditions: string[];
}

interface AuthData {
  email: string;
  isLoggedIn: boolean;
}

export function Dashboard() {
  const [exams, setExams] = useState<ExamData[]>(mockExams);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const navigate = useNavigate();

  // Verificar autenticação e dados do usuário
  useEffect(() => {
    const storedAuthData = localStorage.getItem('healthtrack-auth');
    const storedUserData = localStorage.getItem('healthtrack-user');
    
    if (storedAuthData) {
      const authInfo = JSON.parse(storedAuthData);
      setAuthData(authInfo);
      
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      } else {
        // Usuário logado mas não fez onboarding
        setShowOnboarding(true);
      }
    }
    
    // Simular carregamento
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const handleLogin = (email: string, password: string) => {
    const authInfo = { email, isLoggedIn: true };
    localStorage.setItem('healthtrack-auth', JSON.stringify(authInfo));
    setAuthData(authInfo);
    
    // Verificar se já tem dados de usuário
    const storedUserData = localStorage.getItem('healthtrack-user');
    if (!storedUserData) {
      setShowOnboarding(true);
    } else {
      setUserData(JSON.parse(storedUserData));
    }
  };

  const handleOnboardingComplete = (data: UserData) => {
    localStorage.setItem('healthtrack-user', JSON.stringify(data));
    setUserData(data);
    setShowOnboarding(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('healthtrack-auth');
    localStorage.removeItem('healthtrack-user');
    setAuthData(null);
    setUserData(null);
  };

  const handleExamUpload = (file: File) => {
    setIsUploading(true);
    
    // Simular processamento da IA
    setTimeout(() => {
      const newExam: ExamData = {
        id: Date.now().toString(),
        type: "Novo Exame",
        date: new Date().toISOString().split('T')[0],
        status: "good",
        summary: "Processando análise com IA...",
        fileName: file.name
      };
      
      setExams(prev => [newExam, ...prev]);
      setIsUploading(false);
    }, 2000);
  };

  // Calcular status geral de saúde
  const getOverallHealthStatus = () => {
    const statusCount = exams.reduce((acc, exam) => {
      acc[exam.status] = (acc[exam.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (statusCount.critical > 0) return "critical";
    if (statusCount.warning > 0) return "warning"; 
    if (statusCount.good > 0) return "good";
    return "excellent";
  };

  // Se não está logado, mostrar tela de login
  if (!authData?.isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Se está logado mas não completou onboarding, mostrar onboarding
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const recentExam = exams[0];

  return (
    <>
      <div className="min-h-screen bg-gradient-surface">
        {/* Mobile Header */}
        <header className="bg-card shadow-soft border-b border-border lg:hidden">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Heart className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Minha Saúde</h1>
                  <p className="text-xs text-muted-foreground">Dashboard</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <NotificationSystem exams={exams} />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  className="p-2"
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gradient-primary hover:opacity-90 p-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <MobileNav onUploadClick={() => setShowUploadModal(true)} />
              </div>
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block bg-card shadow-soft border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Minha Saúde</h1>
                  <p className="text-sm text-muted-foreground">Dashboard de Análise de Exames</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <NotificationSystem exams={exams} />
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="hover-scale"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sair ({authData?.email})
                </Button>
                <Button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gradient-primary hover:opacity-90 hover-scale"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar Exame
                </Button>
              </div>
            </div>
          </div>
        </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Simplified Navigation */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          {[
            { id: 'overview', label: 'Meus Exames', icon: Activity },
            { id: 'goals', label: 'Minhas Metas', icon: Target }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-lg font-semibold transition-all ${
                activeSection === id
                  ? 'bg-primary text-primary-foreground shadow-medium'
                  : 'bg-card text-foreground hover:bg-muted border border-border'
              }`}
            >
              <Icon className="h-6 w-6" />
              {label}
            </button>
          ))}
        </div>

        <LoadingOverlay loading={isLoading} message="Carregando dashboard...">
          {/* Simplified Content */}
          {activeSection === 'overview' && (
            <div className="space-y-12 animate-fade-in">
              {/* Status Summary Card - Single Large Card */}
              <Card className="border-0 shadow-medium p-8">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center">
                    <HealthStatus 
                      status={getOverallHealthStatus()}
                      title="Como está minha saúde?"
                      description="Resumo baseado nos últimos exames"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold text-foreground">{exams.length}</div>
                      <p className="text-lg text-muted-foreground">Exames analisados</p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-xl font-semibold text-foreground">
                        {recentExam ? new Date(recentExam.date).toLocaleDateString('pt-BR') : 'Nenhum exame'}
                      </div>
                      <p className="text-lg text-muted-foreground">Último exame</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Action Button */}
              <div className="text-center">
                <Button
                  onClick={() => setShowUploadModal(true)}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-xl px-12 py-6 rounded-2xl shadow-strong"
                >
                  <Upload className="h-6 w-6 mr-3" />
                  Enviar Novo Exame
                </Button>
              </div>

              {/* Recent Exam Card */}
              {recentExam && (
                <Card className="border-0 shadow-medium p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-foreground">Último Resultado</h2>
                      <Badge 
                        className={`text-lg px-4 py-2 ${
                          recentExam.status === 'excellent' ? 'bg-health-excellent-bg text-health-excellent' : ''
                        }${recentExam.status === 'good' ? 'bg-health-good-bg text-health-good' : ''}${
                          recentExam.status === 'warning' ? 'bg-health-warning-bg text-health-warning' : ''
                        }${recentExam.status === 'critical' ? 'bg-health-critical-bg text-health-critical' : ''}`}
                      >
                        {recentExam.status === 'excellent' && 'Excelente'}
                        {recentExam.status === 'good' && 'Bom'}
                        {recentExam.status === 'warning' && 'Atenção'}
                        {recentExam.status === 'critical' && 'Crítico'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{recentExam.type}</h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">{recentExam.summary}</p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => setSelectedExam(recentExam)}
                        className="text-lg px-8 py-4"
                      >
                        Ver Detalhes Completos
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Simple Timeline */}
              {exams.length > 1 && (
                <Card className="border-0 shadow-medium p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Histórico de Exames</h2>
                  <div className="space-y-4">
                    {exams.slice(0, 3).map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{exam.type}</h3>
                          <p className="text-base text-muted-foreground">
                            {new Date(exam.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Badge 
                          className={`text-base px-3 py-1 ${
                            exam.status === 'excellent' ? 'bg-health-excellent-bg text-health-excellent' : ''
                          }${exam.status === 'good' ? 'bg-health-good-bg text-health-good' : ''}${
                            exam.status === 'warning' ? 'bg-health-warning-bg text-health-warning' : ''
                          }${exam.status === 'critical' ? 'bg-health-critical-bg text-health-critical' : ''}`}
                        >
                          {exam.status === 'excellent' && 'Excelente'}
                          {exam.status === 'good' && 'Bom'}
                          {exam.status === 'warning' && 'Atenção'}
                          {exam.status === 'critical' && 'Crítico'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Goals Section */}
          {activeSection === 'goals' && (
            <div className="animate-fade-in">
              <HealthGoals />
            </div>
          )}

          {/* Charts Section */}
          {activeSection === 'charts' && (
            <div className="space-y-8 animate-fade-in">
              <HealthCharts exams={exams} />
              <ExamComparison exams={exams} />
            </div>
          )}

          {/* Timeline Section */}
          {activeSection === 'timeline' && (
            <div className="animate-fade-in">
              <Card className="border-0 shadow-medium hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Histórico Completo de Exames
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HealthTimeline exams={exams} onExamClick={setSelectedExam} />
                </CardContent>
              </Card>
            </div>
          )}
        </LoadingOverlay>
      </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        onUpload={handleExamUpload}
        isUploading={isUploading}
      />

      {/* Exam Viewer */}
      {selectedExam && (
        <ExamViewer
          exam={selectedExam}
          onClose={() => setSelectedExam(null)}
        />
      )}

      {/* Onboarding */}
      {showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
    </>
  );
}