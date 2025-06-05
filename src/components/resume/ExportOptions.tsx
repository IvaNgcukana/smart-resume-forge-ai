
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResumeData } from "@/pages/Index";
import { FileText, Download, Globe, FileImage } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportOptionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeData: ResumeData;
  onSave: (data: ResumeData) => Promise<void>;
}

const exportFormats = [
  {
    id: "pdf",
    name: "PDF Document",
    description: "Most compatible format for job applications",
    icon: FileText,
    color: "bg-red-500",
    recommended: true,
  },
  {
    id: "html",
    name: "HTML Web Page",
    description: "Interactive format perfect for online portfolios",
    icon: Globe,
    color: "bg-blue-500",
  },
  {
    id: "png",
    name: "PNG Image",
    description: "High-quality image format for social media",
    icon: FileImage,
    color: "bg-green-500",
  },
];

export const ExportOptions = ({ open, onOpenChange, resumeData, onSave }: ExportOptionsProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("pdf");

  const generateFileName = (extension: string) => {
    const name = resumeData.personalInfo.fullName || 'Resume';
    return `${name.replace(/\s+/g, '_')}_Resume.${extension}`;
  };

  const exportAsPDF = async () => {
    const resumeElement = document.querySelector('.resume-preview') as HTMLElement;
    if (!resumeElement) throw new Error('Resume preview not found');

    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(generateFileName('pdf'));
  };

  const exportAsHTML = () => {
    const resumeElement = document.querySelector('.resume-preview') as HTMLElement;
    if (!resumeElement) throw new Error('Resume preview not found');

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resumeData.personalInfo.fullName || 'Resume'}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .resume-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        ${resumeElement.style.cssText}
    </style>
</head>
<body>
    <div class="resume-container">
        ${resumeElement.innerHTML}
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generateFileName('html');
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPNG = async () => {
    const resumeElement = document.querySelector('.resume-preview') as HTMLElement;
    if (!resumeElement) throw new Error('Resume preview not found');

    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = generateFileName('png');
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Save to database first
      await onSave(resumeData);
      
      toast({
        title: "Generating Export",
        description: `Please wait while we prepare your ${selectedFormat.toUpperCase()} file...`,
      });

      // Close dialog
      onOpenChange(false);

      // Wait for dialog to close
      setTimeout(async () => {
        try {
          switch (selectedFormat) {
            case 'pdf':
              await exportAsPDF();
              break;
            case 'html':
              exportAsHTML();
              break;
            case 'png':
              await exportAsPNG();
              break;
          }

          toast({
            title: "Export Successful!",
            description: `Your resume has been saved as ${generateFileName(selectedFormat)}`,
          });
        } catch (error) {
          console.error('Export error:', error);
          toast({
            title: "Export Failed",
            description: "There was an error exporting your resume. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsExporting(false);
        }
      }, 500);
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive",
      });
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Your Resume
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Choose Export Format</h3>
            <p className="text-gray-600 text-sm mb-4">
              Select the format that best suits your needs. Your resume will be saved to the database and exported.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exportFormats.map((format) => {
              const Icon = format.icon;
              const isSelected = selectedFormat === format.id;
              
              return (
                <Card 
                  key={format.id} 
                  className={`p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${format.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{format.name}</h4>
                      {format.recommended && (
                        <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                          Recommended
                        </Badge>
                      )}
                      {isSelected && (
                        <Badge variant="secondary" className="mt-1">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{format.description}</p>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export {selectedFormat.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
