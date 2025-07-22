import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react";

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

interface ExamViewerProps {
  exam: ExamData;
  onClose: () => void;
}

export function ExamViewer({ exam, onClose }: ExamViewerProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle2 className="h-5 w-5 text-health-excellent" />;
      case "good":
        return <CheckCircle2 className="h-5 w-5 text-health-good" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-health-warning" />;
      case "critical":
        return <XCircle className="h-5 w-5 text-health-critical" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "excellent": return "Excelente";
      case "good": return "Bom";
      case "warning": return "Atenção";
      case "critical": return "Crítico";
      default: return "Indefinido";
    }
  };

  const getParameterIcon = (status: string) => {
    switch (status) {
      case "high": return <TrendingUp className="h-4 w-4 text-health-warning" />;
      case "low": return <TrendingDown className="h-4 w-4 text-health-warning" />;
      default: return <Minus className="h-4 w-4 text-health-good" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:p-8">
      <div className="h-full lg:h-auto lg:max-h-[90vh] max-w-4xl mx-auto bg-card lg:rounded-lg lg:shadow-strong overflow-hidden">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between lg:hidden">
          <h2 className="font-semibold text-foreground">Detalhes do Exame</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Detalhes do Exame</h2>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {/* Exam Overview */}
          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{exam.type}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(exam.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(exam.status)}
                  <Badge 
                    variant="secondary"
                    className={`
                      ${exam.status === 'excellent' ? 'bg-health-excellent-bg text-health-excellent' : ''}
                      ${exam.status === 'good' ? 'bg-health-good-bg text-health-good' : ''}
                      ${exam.status === 'warning' ? 'bg-health-warning-bg text-health-warning' : ''}
                      ${exam.status === 'critical' ? 'bg-health-critical-bg text-health-critical' : ''}
                    `}
                  >
                    {getStatusLabel(exam.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{exam.summary}</p>
              
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{exam.fileName}</span>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Parameters */}
          {exam.details?.parameters && (
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Parâmetros Analisados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exam.details.parameters.map((param, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center space-x-3">
                        {getParameterIcon(param.status)}
                        <div>
                          <p className="font-medium text-foreground">{param.name}</p>
                          <p className="text-xs text-muted-foreground">Ref: {param.reference}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          param.status === 'normal' ? 'text-health-good' : 'text-health-warning'
                        }`}>
                          {param.value}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{param.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {exam.details?.recommendations && (
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Recomendações da IA</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {exam.details.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <p className="text-muted-foreground">{rec}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}