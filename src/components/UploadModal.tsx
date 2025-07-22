import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExamUpload } from "./ExamUpload";
import { X } from "lucide-react";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export function UploadModal({ open, onOpenChange, onUpload, isUploading }: UploadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between sm:hidden">
          <DialogTitle className="text-lg font-semibold">Enviar Exame</DialogTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onOpenChange(false)}
            className="p-1"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Desktop Header */}
        <DialogHeader className="hidden sm:block p-6 pb-0">
          <DialogTitle className="text-xl">Enviar Novo Exame</DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-6 sm:pt-4">
          <ExamUpload 
            onUpload={(file) => {
              onUpload(file);
              if (!isUploading) {
                onOpenChange(false);
              }
            }} 
            isUploading={isUploading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}