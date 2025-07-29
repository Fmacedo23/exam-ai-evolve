import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Activity, Calendar, TrendingUp, FileText, Heart, Plus, User, Target, LogOut } from "lucide-react";
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
import { GuidedTour, useGuidedTour } from "./GuidedTour";

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

export function Dashboard() {
  const [exams, setExams] = useState<ExamData[]>(mockExams);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const { shouldShowTour, closeTour } = useGuidedTour();

  // Verificar autenticação e primeira visita
  useEffect(() => {
    const storedAuth = localStorage.getItem('healthtrack-auth');
    const storedUserData = localStorage.getItem('healthtrack-user');
    
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setIsAuthenticated(true);
      setUserEmail(authData.email);
      
      // Se está autenticado, verificar se precisa do onboarding
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      } else {
        setShowOnboarding(true);
      }
    }
    
    // Simular carregamento
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const handleLogin = (email: string) => {
    const authData = { email, loginTime: new Date().toISOString() };
    localStorage.setItem('healthtrack-auth', JSON.stringify(authData));
    setIsAuthenticated(true);
    setUserEmail(email);
    
    // Verificar se é primeira vez (não tem dados de usuário)
    const storedUserData = localStorage.getItem('healthtrack-user');
    if (!storedUserData) {
      setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('healthtrack-auth');
    localStorage.removeItem('healthtrack-user');
    setIsAuthenticated(false);
    setUserEmail("");
    setUserData(null);
    setShowOnboarding(false);
  };

  const handleOnboardingComplete = (data: UserData) => {
    localStorage.setItem('healthtrack-user', JSON.stringify(data));
    setUserData(data);
    setShowOnboarding(false);
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

  const recentExam = exams[0];

  // Renderizar tela de login se não autenticado
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Renderizar onboarding se usuário logado mas é primeira vez
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-surface">
        {/* Mobile Header */}
        <header data-tour="header" className="bg-card shadow-soft border-b border-border lg:hidden">
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
                <div className="flex items-center space-x-1 px-2 py-1 bg-muted rounded text-xs">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-20">{userEmail.split('@')[0]}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  className="p-2"
                >
                  <LogOut className="h-4 w-4" />
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
        <header data-tour="header" className="hidden lg:block bg-card shadow-soft border-b border-border">
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
                <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{userEmail}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="hover-scale"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
                <Button
                  data-tour="upload-button"
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
        {/* Navigation Tabs */}
        <div data-tour="navigation-tabs" className="flex space-x-1 bg-card rounded-lg p-1 shadow-soft">
          {[
            { id: 'overview', label: 'Visão Geral', icon: Activity },
            { id: 'goals', label: 'Metas', icon: Target },
            { id: 'charts', label: 'Análises', icon: TrendingUp },
            { id: 'timeline', label: 'Histórico', icon: Calendar }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              data-tour={id === 'goals' ? 'goals-tab' : undefined}
              onClick={() => setActiveSection(id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all hover-scale ${
                activeSection === id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <LoadingOverlay loading={isLoading} message="Carregando dashboard...">
          {/* Content based on active section */}
          {activeSection === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* Status Cards Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                <HealthStatus 
                  status={getOverallHealthStatus()}
                  title="Status Geral"
                  description="Baseado nos últimos exames"
                />
                
                <Card className="border-0 shadow-soft hover-lift">
                  <CardHeader className="pb-2 lg:pb-3">
                    <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground flex items-center">
                      <FileText className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                      <span className="hidden lg:inline">Total de Exames</span>
                      <span className="lg:hidden">Exames</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xl lg:text-3xl font-bold text-foreground">{exams.length}</div>
                    <p className="text-xs lg:text-sm text-muted-foreground">Por IA</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-soft hover-lift">
                  <CardHeader className="pb-2 lg:pb-3">
                    <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                      <span className="hidden lg:inline">Último Exame</span>
                      <span className="lg:hidden">Último</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-sm lg:text-lg font-semibold text-foreground">
                      {recentExam ? new Date(recentExam.date).toLocaleDateString('pt-BR') : 'Nenhum'}
                    </div>
                    <p className="text-xs lg:text-sm text-muted-foreground truncate">
                      {recentExam ? recentExam.type : 'Envie seu primeiro'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-soft hover-lift">
                  <CardHeader className="pb-2 lg:pb-3">
                    <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground flex items-center">
                      <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                      Tendência
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-sm lg:text-lg font-semibold text-health-good">Melhorando</div>
                    <p className="text-xs lg:text-sm text-muted-foreground">Histórico</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Timeline - Takes 2 columns on large screens */}
                <div className="xl:col-span-2">
                  <Card data-tour="timeline-card" className="border-0 shadow-medium hover-lift">
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground">
                        <Activity className="h-5 w-5 mr-2 text-primary" />
                        Timeline de Exames
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <HealthTimeline exams={exams} onExamClick={setSelectedExam} />
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar with Quick Actions */}
                <div className="space-y-6">
                  {/* Quick Upload */}
                  <Card className="border-0 shadow-soft hover-lift">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">Upload Rápido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Envie um novo exame para análise automática da IA
                      </p>
                      <ExamUpload 
                        onUpload={handleExamUpload} 
                        isUploading={isUploading}
                        variant="compact"
                      />
                    </CardContent>
                  </Card>

                  {/* Latest Analysis */}
                  {recentExam && (
                    <Card className="border-0 shadow-soft hover-lift">
                      <CardHeader>
                        <CardTitle className="text-lg text-foreground">Última Análise</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{recentExam.type}</span>
                          <Badge 
                            variant="secondary" 
                            className={`
                              ${recentExam.status === 'excellent' ? 'bg-health-excellent-bg text-health-excellent' : ''}
                              ${recentExam.status === 'good' ? 'bg-health-good-bg text-health-good' : ''}
                              ${recentExam.status === 'warning' ? 'bg-health-warning-bg text-health-warning' : ''}
                              ${recentExam.status === 'critical' ? 'bg-health-critical-bg text-health-critical' : ''}
                            `}
                          >
                            {recentExam.status === 'excellent' && 'Excelente'}
                            {recentExam.status === 'good' && 'Bom'}
                            {recentExam.status === 'warning' && 'Atenção'}
                            {recentExam.status === 'critical' && 'Crítico'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{recentExam.summary}</p>
                        <Button variant="outline" size="sm" className="w-full hover-scale">
                          Ver Detalhes
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Health Tips */}
                  <Card className="border-0 shadow-soft bg-gradient-health hover-lift">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-primary-foreground mb-2">💡 Dica de Saúde</h3>
                      <p className="text-sm text-primary-foreground/90">
                        Mantenha seus exames atualizados! Recomendamos check-ups regulares a cada 6 meses.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
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

      {/* Guided Tour */}
      <GuidedTour isOpen={shouldShowTour} onClose={closeTour} />
    </>
  );
}