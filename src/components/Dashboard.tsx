import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Activity, Calendar, TrendingUp, FileText, Heart } from "lucide-react";
import { HealthTimeline } from "./HealthTimeline";
import { ExamUpload } from "./ExamUpload";
import { HealthStatus } from "./HealthStatus";

interface ExamData {
  id: string;
  type: string;
  date: string;
  status: "excellent" | "good" | "warning" | "critical";
  summary: string;
  fileName: string;
}

// Mock data - será substituído por dados reais
const mockExams: ExamData[] = [
  {
    id: "1",
    type: "Hemograma Completo",
    date: "2024-12-15",
    status: "good",
    summary: "Todos os valores dentro da normalidade, leve baixa em vitamina D",
    fileName: "hemograma_dez2024.pdf"
  },
  {
    id: "2", 
    type: "Perfil Lipídico",
    date: "2024-09-10",
    status: "warning",
    summary: "Colesterol LDL levemente elevado (145 mg/dL). Recomenda-se dieta e exercícios",
    fileName: "lipidico_set2024.pdf"
  },
  {
    id: "3",
    type: "Glicose em Jejum",
    date: "2024-06-20",
    status: "excellent",
    summary: "Glicose normal (89 mg/dL). Excelente controle metabólico",
    fileName: "glicose_jun2024.pdf"
  }
];

export function Dashboard() {
  const [exams, setExams] = useState<ExamData[]>(mockExams);
  const [isUploading, setIsUploading] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="bg-card shadow-soft border-b border-border">
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
            
            <ExamUpload onUpload={handleExamUpload} isUploading={isUploading} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Status Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <HealthStatus 
            status={getOverallHealthStatus()}
            title="Status Geral"
            description="Baseado nos últimos exames"
          />
          
          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Total de Exames
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{exams.length}</div>
              <p className="text-sm text-muted-foreground">Analisados por IA</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Último Exame
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-foreground">
                {recentExam ? new Date(recentExam.date).toLocaleDateString('pt-BR') : 'Nenhum'}
              </div>
              <p className="text-sm text-muted-foreground">
                {recentExam ? recentExam.type : 'Envie seu primeiro exame'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Tendência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-health-good">Melhorando</div>
              <p className="text-sm text-muted-foreground">Baseado no histórico</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Timeline - Takes 2 columns on large screens */}
          <div className="xl:col-span-2">
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Activity className="h-5 w-5 mr-2 text-primary" />
                  Timeline de Exames
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HealthTimeline exams={exams} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with Quick Actions */}
          <div className="space-y-6">
            {/* Quick Upload */}
            <Card className="border-0 shadow-soft">
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
              <Card className="border-0 shadow-soft">
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
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Health Tips */}
            <Card className="border-0 shadow-soft bg-gradient-health">
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
    </div>
  );
}