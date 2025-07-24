import React, { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Calendar, CheckCircle, X } from "lucide-react";

interface ExamData {
  id: string;
  type: string;
  date: string;
  status: "excellent" | "good" | "warning" | "critical";
  summary: string;
}

interface Notification {
  id: string;
  type: "critical" | "reminder" | "success" | "info";
  title: string;
  message: string;
  date: string;
  read: boolean;
  examId?: string;
}

interface NotificationSystemProps {
  exams: ExamData[];
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationSystem({ exams, onNotificationClick }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Gerar notificações baseadas nos exames
  useEffect(() => {
    const newNotifications: Notification[] = [];

    // Alertas para exames críticos
    const criticalExams = exams.filter(exam => exam.status === "critical");
    criticalExams.forEach(exam => {
      newNotifications.push({
        id: `critical-${exam.id}`,
        type: "critical",
        title: "⚠️ Exame Crítico",
        message: `${exam.type}: ${exam.summary}`,
        date: exam.date,
        read: false,
        examId: exam.id
      });
    });

    // Alertas para exames com atenção
    const warningExams = exams.filter(exam => exam.status === "warning");
    warningExams.forEach(exam => {
      newNotifications.push({
        id: `warning-${exam.id}`,
        type: "info",
        title: "⚡ Atenção Necessária",
        message: `${exam.type}: ${exam.summary}`,
        date: exam.date,
        read: false,
        examId: exam.id
      });
    });

    // Lembretes para próximos check-ups
    const lastExamDate = exams.length > 0 ? new Date(exams[0].date) : null;
    if (lastExamDate) {
      const daysSinceLastExam = Math.floor((Date.now() - lastExamDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastExam > 150) { // 5 meses
        newNotifications.push({
          id: "reminder-checkup",
          type: "reminder",
          title: "📅 Lembrete de Check-up",
          message: `Já se passaram ${daysSinceLastExam} dias desde seu último exame. Que tal agendar um check-up?`,
          date: new Date().toISOString().split('T')[0],
          read: false
        });
      }
    }

    // Notificação de sucesso para exames excelentes recentes
    const recentExcellentExams = exams.filter(exam => {
      const examDate = new Date(exam.date);
      const daysDiff = Math.floor((Date.now() - examDate.getTime()) / (1000 * 60 * 60 * 24));
      return exam.status === "excellent" && daysDiff <= 7;
    });

    recentExcellentExams.forEach(exam => {
      newNotifications.push({
        id: `success-${exam.id}`,
        type: "success",
        title: "🎉 Excelentes Resultados!",
        message: `${exam.type}: Todos os parâmetros estão ótimos!`,
        date: exam.date,
        read: false,
        examId: exam.id
      });
    });

    setNotifications(newNotifications);

    // Mostrar toast para notificações críticas
    criticalExams.forEach(exam => {
      toast({
        title: "⚠️ Exame Crítico Detectado",
        description: `${exam.type} requer atenção médica imediata`,
        variant: "destructive",
      });
    });

  }, [exams]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-health-critical" />;
      case "reminder":
        return <Calendar className="h-4 w-4 text-health-warning" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-health-excellent" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const getNotificationBg = (type: Notification["type"]) => {
    switch (type) {
      case "critical":
        return "bg-health-critical-bg border-health-critical/20";
      case "reminder":
        return "bg-health-warning-bg border-health-warning/20";
      case "success":
        return "bg-health-excellent-bg border-health-excellent/20";
      default:
        return "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800";
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-health-critical text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Panel */}
      {showNotifications && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-hidden shadow-lg z-50 border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notificações
              </CardTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Marcar todas como lidas
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-l-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      !notification.read ? getNotificationBg(notification.type) : "opacity-60"
                    }`}
                    onClick={() => {
                      markAsRead(notification.id);
                      onNotificationClick?.(notification);
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground truncate">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Critical Alerts Banner */}
      {notifications.some(n => n.type === "critical" && !n.read) && (
        <div className="fixed top-4 right-4 z-50 w-80">
          <Alert className="border-health-critical bg-health-critical-bg">
            <AlertTriangle className="h-4 w-4 text-health-critical" />
            <AlertTitle className="text-health-critical">Atenção Médica Necessária</AlertTitle>
            <AlertDescription className="text-health-critical">
              Você tem exames com resultados críticos que requerem acompanhamento médico imediato.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}