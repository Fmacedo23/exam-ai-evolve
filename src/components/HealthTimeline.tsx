import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, ChevronRight } from "lucide-react";

interface ExamData {
  id: string;
  type: string;
  date: string;
  status: "excellent" | "good" | "warning" | "critical";
  summary: string;
  fileName: string;
}

interface HealthTimelineProps {
  exams: ExamData[];
  onExamClick?: (exam: ExamData) => void;
}

export function HealthTimeline({ exams, onExamClick }: HealthTimelineProps) {
  // Agrupar exames por mês/ano
  const groupedExams = exams.reduce((acc, exam) => {
    const date = new Date(exam.date);
    const monthYear = `${date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(exam);
    return acc;
  }, {} as Record<string, ExamData[]>);

  const sortedGroups = Object.entries(groupedExams).sort(([a], [b]) => {
    const dateA = new Date(groupedExams[a][0].date);
    const dateB = new Date(groupedExams[b][0].date);
    return dateB.getTime() - dateA.getTime();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-health-excellent-bg text-health-excellent border-health-excellent/20';
      case 'good':
        return 'bg-health-good-bg text-health-good border-health-good/20';
      case 'warning':
        return 'bg-health-warning-bg text-health-warning border-health-warning/20';
      case 'critical':
        return 'bg-health-critical-bg text-health-critical border-health-critical/20';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bom';
      case 'warning': return 'Atenção';
      case 'critical': return 'Crítico';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return '✅';
      case 'good': return '😊';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '📄';
    }
  };

  if (exams.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Nenhum exame encontrado</h3>
        <p className="text-muted-foreground">
          Envie seu primeiro exame para começar a acompanhar sua saúde
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedGroups.map(([monthYear, monthExams]) => (
        <div key={monthYear} className="relative">
          {/* Timeline dot and line */}
          <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-border"></div>
          
          {/* Month Header */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center relative z-10">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground capitalize">{monthYear}</h3>
              <p className="text-sm text-muted-foreground">{monthExams.length} exame(s)</p>
            </div>
          </div>

          {/* Exams for this month */}
          <div className="ml-16 space-y-3">
            {monthExams.map((exam, index) => (
              <Card 
                key={exam.id} 
                className="border-0 shadow-soft hover:shadow-medium transition-shadow cursor-pointer"
                onClick={() => onExamClick?.(exam)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg">{getStatusIcon(exam.status)}</span>
                        <div>
                          <h4 className="font-medium text-foreground">{exam.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(exam.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {exam.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="secondary" 
                          className={getStatusColor(exam.status)}
                        >
                          {getStatusLabel(exam.status)}
                        </Badge>
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <FileText className="h-3 w-3 mr-1" />
                          {exam.fileName}
                        </div>
                      </div>
                    </div>
                    
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}