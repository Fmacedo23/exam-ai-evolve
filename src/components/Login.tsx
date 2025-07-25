import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Eye, EyeOff, Mail, Lock } from "lucide-react";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-primary rounded-2xl shadow-strong">
              <Heart className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Minha Saúde</h1>
            <p className="text-lg text-muted-foreground mt-2">
              {isLogin ? "Entre na sua conta" : "Crie sua conta"}
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-strong p-8">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-foreground">
              {isLogin ? "Fazer Login" : "Criar Conta"}
            </CardTitle>
            <p className="text-center text-muted-foreground text-lg">
              {isLogin 
                ? "Acesse seu painel de saúde" 
                : "Comece a acompanhar sua saúde"
              }
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-lg font-medium text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="pl-12 h-14 text-lg border-2 focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-lg font-medium text-foreground">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="pl-12 pr-12 h-14 text-lg border-2 focus:border-primary"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:opacity-90 shadow-medium"
              >
                {isLogin ? "Entrar" : "Criar Conta"}
              </Button>

              {/* Toggle Login/Register */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-lg text-primary hover:underline font-medium"
                >
                  {isLogin 
                    ? "Não tem conta? Criar uma conta" 
                    : "Já tem conta? Fazer login"
                  }
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <Card className="border-2 border-dashed border-muted bg-muted/20 p-6">
          <div className="text-center space-y-2">
            <p className="text-base font-medium text-muted-foreground">
              🎯 Modo Demonstração
            </p>
            <p className="text-sm text-muted-foreground">
              Use qualquer email e senha para acessar o sistema
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}