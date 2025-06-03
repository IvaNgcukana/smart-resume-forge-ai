
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResumeTemplate } from "@/pages/Index";
import { Check, FileText, Sparkles, Minus, Palette } from "lucide-react";

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
}

const templates = [
  {
    id: "classic" as ResumeTemplate,
    name: "Classic Professional",
    description: "Traditional, conservative layout perfect for corporate roles",
    icon: FileText,
    preview: "Clean lines, traditional sections, professional typography",
    color: "bg-blue-500",
  },
  {
    id: "modern" as ResumeTemplate,
    name: "Modern Executive",
    description: "Contemporary design with subtle colors and clean aesthetics",
    icon: Sparkles,
    preview: "Modern typography, strategic use of color, executive feel",
    color: "bg-purple-500",
  },
  {
    id: "minimal" as ResumeTemplate,
    name: "Minimal Clean",
    description: "Simple, uncluttered design focusing on content clarity",
    icon: Minus,
    preview: "Plenty of whitespace, minimal styling, content-focused",
    color: "bg-gray-500",
  },
  {
    id: "creative" as ResumeTemplate,
    name: "Creative Edge",
    description: "Bold design for creative professionals and designers",
    icon: Palette,
    preview: "Creative layout, strategic colors, visual hierarchy",
    color: "bg-green-500",
  },
];

export const TemplateSelector = ({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Template</h3>
        <p className="text-gray-600 text-sm">
          Select a template that matches your industry and personal style. Your information will be preserved when switching templates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              onClick={() => onTemplateChange(template.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${template.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{template.name}</h4>
                    {isSelected && (
                      <Badge variant="secondary" className="mt-1">
                        <Check className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <strong>Preview:</strong> {template.preview}
              </div>
              
              <Button 
                variant={isSelected ? "default" : "outline"} 
                size="sm" 
                className="w-full mt-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onTemplateChange(template.id);
                }}
              >
                {isSelected ? "Currently Selected" : "Select Template"}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-amber-100 rounded">
            <FileText className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <h4 className="font-medium text-amber-800 mb-1">Template Benefits</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• All templates are ATS (Applicant Tracking System) friendly</li>
              <li>• Your data is automatically preserved when switching templates</li>
              <li>• Each template is optimized for different industries and roles</li>
              <li>• Professional formatting ensures readability across all devices</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
