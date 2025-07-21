import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamUploadProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
  variant?: "default" | "compact";
}

export function ExamUpload({ onUpload, isUploading = false, variant = "default" }: ExamUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    if (file.type === "application/pdf") {
      setSelectedFile(file);
      onUpload(file);
    } else {
      alert("Por favor, selecione apenas arquivos PDF");
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
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span className="truncate">{selectedFile.name}</span>
            {isUploading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <CheckCircle className="h-3 w-3 text-health-good" />
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
          {isUploading ? (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
              <div>
                <h3 className="text-lg font-medium text-foreground">Processando exame...</h3>
                <p className="text-sm text-muted-foreground">
                  Nossa IA está analisando seu exame. Isso pode levar alguns segundos.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
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

      {selectedFile && !isUploading && (
        <div className="flex items-center space-x-3 p-3 bg-health-good-bg rounded-lg border border-health-good/20">
          <CheckCircle className="h-5 w-5 text-health-good" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Arquivo selecionado</p>
            <p className="text-xs text-muted-foreground">{selectedFile.name}</p>
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