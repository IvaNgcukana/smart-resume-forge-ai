
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResumeData, ResumeTemplate } from "@/pages/Index";
import { FileText, Sparkles, Minus, Palette, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeData: ResumeData;
  onSave: (data: ResumeData) => Promise<void>;
}

const templates = [
  {
    id: "classic" as ResumeTemplate,
    name: "Classic Professional",
    description: "Traditional, conservative layout perfect for corporate roles",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    id: "modern" as ResumeTemplate,
    name: "Modern Executive",
    description: "Contemporary design with subtle colors and clean aesthetics",
    icon: Sparkles,
    color: "bg-purple-500",
  },
  {
    id: "minimal" as ResumeTemplate,
    name: "Minimal Clean",
    description: "Simple, uncluttered design focusing on content clarity",
    icon: Minus,
    color: "bg-gray-500",
  },
];

export const ExportDialog = ({ open, onOpenChange, resumeData, onSave }: ExportDialogProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(resumeData.template);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Update resume data with selected template
      const updatedResumeData = {
        ...resumeData,
        template: selectedTemplate,
      };

      // Save to database
      await onSave(updatedResumeData);

      toast({
        title: "Generating PDF",
        description: "Please wait while we prepare your resume for download...",
      });

      // Close dialog first
      onOpenChange(false);

      // Wait a moment for the dialog to close and template to update
      setTimeout(async () => {
        try {
          // Get the resume preview element
          const resumeElement = document.querySelector('.resume-preview') as HTMLElement;
          
          if (!resumeElement) {
            toast({
              title: "Error",
              description: "Could not find resume preview to export.",
              variant: "destructive",
            });
            return;
          }

          // Create canvas from the resume element
          const canvas = await html2canvas(resumeElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          });

          // Create PDF
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
          
          // Generate filename
          const fileName = resumeData.personalInfo.fullName 
            ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
            : 'My_Resume.pdf';
          
          // Download the PDF
          pdf.save(fileName);

          toast({
            title: "Resume Downloaded!",
            description: `Your resume has been saved as ${fileName}`,
          });
        } catch (error) {
          console.error('Error generating PDF:', error);
          toast({
            title: "Export Failed",
            description: "There was an error generating your PDF. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsExporting(false);
        }
      }, 500);
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Export Failed",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive",
      });
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Your Resume
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Choose Your Final Template</h3>
            <p className="text-gray-600 text-sm mb-4">
              Select the template you want to use for your exported resume. Your data will be formatted accordingly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => {
              const Icon = template.icon;
              const isSelected = selectedTemplate === template.id;
              
              return (
                <Card 
                  key={template.id} 
                  className={`p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${template.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      {isSelected && (
                        <Badge variant="secondary" className="mt-1">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{template.description}</p>
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
                  Export PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
