import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginProps {
  onLogin: (email: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica para demonstração
    if (!email || !password) {
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      return;
    }

    // Simular login/cadastro - aceita qualquer email/senha
    onLogin(email);
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-primary rounded-2xl shadow-soft hover-lift">
              <Heart className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Minha Saúde</h1>
            <p className="text-xl text-muted-foreground">Análise Inteligente de Exames</p>
          </div>
        </div>

        {/* Demo Notice */}
        <Alert className="border-health-warning/20 bg-health-warning-bg animate-slide-up">
          <AlertCircle className="h-5 w-5 text-health-warning" />
          <AlertDescription className="text-health-warning text-lg">
            <strong>Modo Demonstração:</strong> Use qualquer email e senha para acessar
          </AlertDescription>
        </Alert>

        {/* Login Form */}
        <Card className="border-0 shadow-medium hover-lift">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-foreground">
              {isLogin ? "Entrar na Conta" : "Criar Conta"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-lg font-semibold text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="h-16 text-xl rounded-lg border-2 focus:border-primary transition-all"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-lg font-semibold text-foreground">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="h-16 text-xl pr-14 rounded-lg border-2 focus:border-primary transition-all"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 hover:bg-accent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-6 w-6" />
                    ) : (
                      <Eye className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password - Only for registration */}
              {!isLogin && (
                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-lg font-semibold text-foreground">
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme sua senha"
                      className="h-16 text-xl pr-14 rounded-lg border-2 focus:border-primary transition-all"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 hover:bg-accent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-6 w-6" />
                      ) : (
                        <Eye className="h-6 w-6" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-16 text-xl font-bold bg-gradient-primary hover:opacity-90 transition-all hover-scale rounded-lg shadow-soft"
              >
                {isLogin ? "Entrar" : "Criar Conta"}
              </Button>

              {/* Toggle between Login/Register */}
              <div className="text-center pt-4">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-lg text-primary hover:text-primary/80 transition-colors"
                >
                  {isLogin 
                    ? "Não tem conta? Criar uma nova"
                    : "Já tem conta? Fazer login"
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-muted-foreground">
          <p className="text-lg">Sistema de Análise de Exames com IA</p>
        </div>
      </div>
    </div>
  );
}