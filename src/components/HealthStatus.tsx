import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, Shield, AlertTriangle } from "lucide-react";

interface HealthStatusProps {
  status: "excellent" | "good" | "warning" | "critical";
  title: string;
  description: string;
}

export function HealthStatus({ status, title, description }: HealthStatusProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'excellent':
        return {
          icon: Shield,
          label: 'Excelente',
          color: 'text-health-excellent',
          bgColor: 'bg-health-excellent-bg',
          borderColor: 'border-health-excellent/20',
          gradient: 'from-health-excellent/20 to-health-excellent/5'
        };
      case 'good':
        return {
          icon: Heart,
          label: 'Bom',
          color: 'text-health-good',
          bgColor: 'bg-health-good-bg',
          borderColor: 'border-health-good/20',
          gradient: 'from-health-good/20 to-health-good/5'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          label: 'Atenção',
          color: 'text-health-warning',
          bgColor: 'bg-health-warning-bg',
          borderColor: 'border-health-warning/20',
          gradient: 'from-health-warning/20 to-health-warning/5'
        };
      case 'critical':
        return {
          icon: AlertTriangle,
          label: 'Crítico',
          color: 'text-health-critical',
          bgColor: 'bg-health-critical-bg',
          borderColor: 'border-health-critical/20',
          gradient: 'from-health-critical/20 to-health-critical/5'
        };
      default:
        return {
          icon: Heart,
          label: 'Desconhecido',
          color: 'text-muted-foreground',
          bgColor: 'bg-secondary',
          borderColor: 'border-border',
          gradient: 'from-secondary/20 to-secondary/5'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'excellent': return '🌟';
      case 'good': return '😊';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '❓';
    }
  };

  const getHealthScore = (status: string) => {
    switch (status) {
      case 'excellent': return 95;
      case 'good': return 80;
      case 'warning': return 60;
      case 'critical': return 30;
      default: return 0;
    }
  };

  const healthScore = getHealthScore(status);

  return (
    <Card className={`border-0 shadow-soft bg-gradient-to-br ${config.gradient} relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
        <Icon className="h-20 w-20" />
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
          <Icon className={`h-4 w-4 mr-2 ${config.color}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-3">
          {/* Status and Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getStatusEmoji(status)}</span>
              <div>
                <div className={`text-2xl font-bold ${config.color}`}>
                  {healthScore}%
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${config.bgColor} ${config.color} ${config.borderColor} border`}
                >
                  {config.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Score de Saúde</span>
              <span>{healthScore}%</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${
                  status === 'excellent' ? 'from-health-excellent to-health-excellent/80' :
                  status === 'good' ? 'from-health-good to-health-good/80' :
                  status === 'warning' ? 'from-health-warning to-health-warning/80' :
                  'from-health-critical to-health-critical/80'
                }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{description}</p>

          {/* Status-specific recommendations */}
          <div className="text-xs text-muted-foreground">
            {status === 'excellent' && (
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-health-excellent" />
                <span>Continue assim! Seus indicadores estão ótimos.</span>
              </div>
            )}
            {status === 'good' && (
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3 text-health-good" />
                <span>Boa saúde! Pequenos ajustes podem melhorar ainda mais.</span>
              </div>
            )}
            {status === 'warning' && (
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3 text-health-warning" />
                <span>Alguns indicadores precisam de atenção.</span>
              </div>
            )}
            {status === 'critical' && (
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3 text-health-critical" />
                <span>Recomendamos consultar um médico urgentemente.</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}