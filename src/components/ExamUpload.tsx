import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamUploadProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
  variant?: "default" | "compact";
  onUploadComplete?: () => void;
}

export function ExamUpload({ onUpload, isUploading = false, variant = "default" }: ExamUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');

  const handleFileSelect = (file: File) => {
    if (file.type === "application/pdf") {
      setSelectedFile(file);
      setUploadStatus('uploading');
      setUploadProgress(0);
      
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setUploadStatus('processing');
            return 100;
          }
          return prev + Math.random() * 30;
        });
      }, 200);
      
      onUpload(file);
    } else {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (variant === "compact") {
    return (
      <div className="space-y-3">
        <Button 
          onClick={openFileDialog} 
          disabled={isUploading}
          className="w-full bg-gradient-primary hover:opacity-90"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Enviar Exame
            </>
          )}
        </Button>
        
        {selectedFile && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span className="truncate">{selectedFile.name}</span>
              {uploadStatus === 'success' && (
                <CheckCircle className="h-3 w-3 text-health-good animate-scale-in" />
              )}
            </div>
            
            {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
              <div className="space-y-1">
                <Progress value={uploadProgress} className="h-1" />
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {uploadStatus === 'uploading' ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Enviando... {Math.round(uploadProgress)}%</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 animate-pulse text-primary" />
                      <span>IA analisando...</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-200 cursor-pointer",
          dragActive ? "border-primary bg-accent" : "border-border hover:border-primary/50",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!isUploading ? openFileDialog : undefined}
      >
        <CardContent className="p-8 text-center">
          {(uploadStatus === 'uploading' || uploadStatus === 'processing' || isUploading) ? (
            <div className="space-y-4 animate-fade-in">
              {uploadStatus === 'uploading' ? (
                <>
                  <Upload className="h-12 w-12 text-primary mx-auto animate-bounce" />
                  <div>
                    <h3 className="text-lg font-medium text-foreground">Enviando arquivo...</h3>
                    <p className="text-sm text-muted-foreground">
                      Seu exame está sendo carregado com segurança
                    </p>
                    <Progress value={uploadProgress} className="mt-3 h-2" />
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {Math.round(uploadProgress)}% concluído
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <Sparkles className="h-12 w-12 text-primary mx-auto animate-pulse" />
                    <div className="absolute inset-0 animate-ping">
                      <Sparkles className="h-12 w-12 text-primary/30 mx-auto" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">IA Analisando...</h3>
                    <p className="text-sm text-muted-foreground">
                      Nossa inteligência artificial está examinando seus resultados
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : uploadStatus === 'error' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 bg-destructive/10 rounded-full w-fit mx-auto">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-destructive">Erro no arquivo</h3>
                <p className="text-sm text-muted-foreground">
                  Por favor, selecione apenas arquivos PDF válidos
                </p>
              </div>
            </div>
          ) : uploadStatus === 'success' ? (
            <div className="space-y-4 animate-scale-in">
              <div className="p-3 bg-health-good/10 rounded-full w-fit mx-auto">
                <CheckCircle className="h-8 w-8 text-health-good" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-health-good">Upload concluído!</h3>
                <p className="text-sm text-muted-foreground">
                  Seu exame foi analisado com sucesso
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto hover-scale">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Envie seu exame médico
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Arraste e solte o arquivo PDF aqui ou clique para selecionar
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Apenas arquivos PDF são aceitos</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedFile && uploadStatus === 'success' && (
        <div className="flex items-center space-x-3 p-3 bg-health-good-bg rounded-lg border border-health-good/20 animate-fade-in">
          <CheckCircle className="h-5 w-5 text-health-good animate-scale-in" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Análise concluída</p>
            <p className="text-xs text-muted-foreground">{selectedFile.name}</p>
          </div>
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        </div>
      )}
      
      {uploadStatus === 'error' && (
        <div className="flex items-center space-x-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">Formato inválido</p>
            <p className="text-xs text-muted-foreground">Apenas arquivos PDF são aceitos</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleInputChange}
        className="hidden"
      />
      
      <div className="flex items-start space-x-2 p-3 bg-accent rounded-lg">
        <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Tipos de exames suportados:</p>
          <ul className="space-y-1">
            <li>• Hemograma completo</li>
            <li>• Perfil lipídico</li>
            <li>• Glicose e diabetes</li>
            <li>• Função hepática e renal</li>
            <li>• Hormônios da tireoide</li>
          </ul>
        </div>
      </div>
    </div>
  );
}