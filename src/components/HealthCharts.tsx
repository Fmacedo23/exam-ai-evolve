import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, TrendingDown, Activity, BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface ExamData {
  id: string;
  type: string;
  date: string;
  status: "excellent" | "good" | "warning" | "critical";
  summary: string;
}

interface HealthChartsProps {
  exams: ExamData[];
}

export function HealthCharts({ exams }: HealthChartsProps) {
  // Preparar dados para o gráfico de tendência temporal
  const getTrendData = () => {
    const statusValues = {
      excellent: 4,
      good: 3,
      warning: 2,
      critical: 1
    };

    return exams
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(exam => ({
        date: new Date(exam.date).toLocaleDateString('pt-BR'),
        score: statusValues[exam.status],
        status: exam.status,
        type: exam.type
      }));
  };

  // Preparar dados para distribuição de status
  const getStatusDistribution = () => {
    const distribution = exams.reduce((acc, exam) => {
      acc[exam.status] = (acc[exam.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Excelente', value: distribution.excellent || 0, color: 'hsl(var(--health-excellent))' },
      { name: 'Bom', value: distribution.good || 0, color: 'hsl(var(--health-good))' },
      { name: 'Atenção', value: distribution.warning || 0, color: 'hsl(var(--health-warning))' },
      { name: 'Crítico', value: distribution.critical || 0, color: 'hsl(var(--health-critical))' }
    ].filter(item => item.value > 0);
  };

  // Preparar dados para exames por mês
  const getExamsByMonth = () => {
    const examsByMonth = exams.reduce((acc, exam) => {
      const month = new Date(exam.date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(examsByMonth).map(([month, count]) => ({
      month,
      exams: count
    }));
  };

  // Calcular tendência geral
  const calculateTrend = () => {
    const trendData = getTrendData();
    if (trendData.length < 2) return { direction: 'stable', change: 0 };
    
    const firstScore = trendData[0].score;
    const lastScore = trendData[trendData.length - 1].score;
    const change = ((lastScore - firstScore) / firstScore) * 100;
    
    return {
      direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
      change: Math.abs(change)
    };
  };

  const trendData = getTrendData();
  const statusDistribution = getStatusDistribution();
  const examsByMonth = getExamsByMonth();
  const trend = calculateTrend();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">{data.type}</p>
          <p className={`text-sm font-medium ${
            data.status === 'excellent' ? 'text-health-excellent' :
            data.status === 'good' ? 'text-health-good' :
            data.status === 'warning' ? 'text-health-warning' :
            'text-health-critical'
          }`}>
            {data.status === 'excellent' && 'Excelente'}
            {data.status === 'good' && 'Bom'}
            {data.status === 'warning' && 'Atenção'}
            {data.status === 'critical' && 'Crítico'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (exams.length === 0) {
    return (
      <Card className="border-0 shadow-soft">
        <CardContent className="p-8 text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Envie seus primeiros exames para ver gráficos e análises</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas de Progresso */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Tendência Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {trend.direction === 'up' && <TrendingUp className="h-5 w-5 text-health-excellent" />}
              {trend.direction === 'down' && <TrendingDown className="h-5 w-5 text-health-critical" />}
              {trend.direction === 'stable' && <Activity className="h-5 w-5 text-health-good" />}
              <span className="text-2xl font-bold">
                {trend.direction === 'up' && '📈'}
                {trend.direction === 'down' && '📉'}
                {trend.direction === 'stable' && '➡️'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {trend.direction === 'up' && 'Melhorando'}
              {trend.direction === 'down' && 'Requer atenção'}
              {trend.direction === 'stable' && 'Estável'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Score Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {(trendData.reduce((acc, curr) => acc + curr.score, 0) / trendData.length).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">De 4.0 possíveis</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Último Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-foreground">
                {trendData[trendData.length - 1]?.score || 0}
              </span>
              <Badge variant={
                trendData[trendData.length - 1]?.status === 'excellent' ? 'default' :
                trendData[trendData.length - 1]?.status === 'good' ? 'secondary' :
                trendData[trendData.length - 1]?.status === 'warning' ? 'outline' :
                'destructive'
              }>
                {trendData[trendData.length - 1]?.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Tendência Temporal */}
        <Card className="border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Tendência de Saúde ao Longo do Tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  domain={[1, 4]}
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Status */}
        <Card className="border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
              Distribuição de Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exames por Período */}
        <Card className="border-0 shadow-medium lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              Frequência de Exames por Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={examsByMonth}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  formatter={(value) => [value, 'Exames']}
                  labelFormatter={(label) => `Período: ${label}`}
                />
                <Bar 
                  dataKey="exams" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}