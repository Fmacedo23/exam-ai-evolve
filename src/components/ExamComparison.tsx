import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, TrendingUp, TrendingDown, Minus, GitCompare } from "lucide-react";

interface ExamData {
  id: string;
  type: string;
  date: string;
  status: "excellent" | "good" | "warning" | "critical";
  summary: string;
  details?: {
    parameters: Array<{
      name: string;
      value: string;
      reference: string;
      status: "normal" | "high" | "low";
    }>;
  };
}

interface ExamComparisonProps {
  exams: ExamData[];
}

export function ExamComparison({ exams }: ExamComparisonProps) {
  const [selectedExam1, setSelectedExam1] = useState<string>("");
  const [selectedExam2, setSelectedExam2] = useState<string>("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-health-excellent';
      case 'good': return 'text-health-good';
      case 'warning': return 'text-health-warning';
      case 'critical': return 'text-health-critical';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-health-excellent-bg';
      case 'good': return 'bg-health-good-bg';
      case 'warning': return 'bg-health-warning-bg';
      case 'critical': return 'bg-health-critical-bg';
      default: return 'bg-muted';
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

  const getTrendIcon = (param1: any, param2: any) => {
    if (!param1 || !param2) return <Minus className="h-4 w-4 text-muted-foreground" />;
    
    const value1 = parseFloat(param1.value.replace(/[^0-9.,]/g, '').replace(',', '.'));
    const value2 = parseFloat(param2.value.replace(/[^0-9.,]/g, '').replace(',', '.'));
    
    if (isNaN(value1) || isNaN(value2)) return <Minus className="h-4 w-4 text-muted-foreground" />;
    
    if (value2 > value1) {
      return <TrendingUp className="h-4 w-4 text-health-excellent" />;
    } else if (value2 < value1) {
      return <TrendingDown className="h-4 w-4 text-health-critical" />;
    }
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const exam1 = exams.find(e => e.id === selectedExam1);
  const exam2 = exams.find(e => e.id === selectedExam2);

  if (exams.length < 2) {
    return (
      <Card className="border-0 shadow-soft">
        <CardContent className="p-8 text-center">
          <GitCompare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Você precisa de pelo menos 2 exames para fazer comparações</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center">
          <GitCompare className="h-5 w-5 mr-2 text-primary" />
          Comparação entre Exames
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seletores de Exames */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Primeiro Exame</label>
            <Select value={selectedExam1} onValueChange={setSelectedExam1}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um exame" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.type} - {new Date(exam.date).toLocaleDateString('pt-BR')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Segundo Exame</label>
            <Select value={selectedExam2} onValueChange={setSelectedExam2}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um exame" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id} disabled={exam.id === selectedExam1}>
                    {exam.type} - {new Date(exam.date).toLocaleDateString('pt-BR')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Comparação */}
        {exam1 && exam2 && (
          <div className="space-y-6">
            {/* Cabeçalho da Comparação */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border border-border">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{exam1.type}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(exam1.date).toLocaleDateString('pt-BR')}
                    </p>
                    <Badge 
                      variant="secondary"
                      className={`${getStatusBg(exam1.status)} ${getStatusColor(exam1.status)}`}
                    >
                      {getStatusLabel(exam1.status)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{exam2.type}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(exam2.date).toLocaleDateString('pt-BR')}
                    </p>
                    <Badge 
                      variant="secondary"
                      className={`${getStatusBg(exam2.status)} ${getStatusColor(exam2.status)}`}
                    >
                      {getStatusLabel(exam2.status)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comparação de Parâmetros */}
            {exam1.details?.parameters && exam2.details?.parameters && (
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Comparação de Parâmetros</h4>
                <div className="space-y-2">
                  {exam1.details.parameters.map((param1) => {
                    const param2 = exam2.details?.parameters?.find(p => p.name === param1.name);
                    
                    return (
                      <div key={param1.name} className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                        <div className="font-medium text-foreground">{param1.name}</div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-foreground">{param1.value}</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-foreground">{param2?.value || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center justify-end">
                          {getTrendIcon(param1, param2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Resumo da Comparação */}
            <Card className="bg-muted/50 border border-border">
              <CardContent className="p-4">
                <h4 className="font-medium text-foreground mb-2">Resumo da Evolução</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Status geral:</span>
                    <Badge 
                      variant="secondary"
                      className={getStatusBg(exam1.status)}
                    >
                      {getStatusLabel(exam1.status)}
                    </Badge>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <Badge 
                      variant="secondary"
                      className={getStatusBg(exam2.status)}
                    >
                      {getStatusLabel(exam2.status)}
                    </Badge>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-muted-foreground">
                      <strong>Período:</strong> {Math.abs(
                        Math.floor(
                          (new Date(exam2.date).getTime() - new Date(exam1.date).getTime()) / 
                          (1000 * 60 * 60 * 24)
                        )
                      )} dias entre os exames
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Estado Inicial */}
        {(!exam1 || !exam2) && (
          <div className="text-center py-8">
            <GitCompare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              Selecione dois exames para ver a comparação detalhada
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}