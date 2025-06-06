
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResumeTemplate } from "@/pages/Index";
import { Check, FileText, Sparkles, Minus, Palette, Crown, Building, Zap } from "lucide-react";

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
}

const templates = [
  {
    id: "classic" as ResumeTemplate,
    name: "Executive Classic",
    description: "Timeless professional design perfect for senior roles and traditional industries",
    icon: Building,
    preview: "Clean typography, structured layout, conservative styling for maximum professionalism",
    color: "bg-slate-600",
    badge: "Traditional",
  },
  {
    id: "modern" as ResumeTemplate,
    name: "Modern Professional",
    description: "Contemporary design with sophisticated color accents for forward-thinking professionals",
    icon: Sparkles,
    preview: "Strategic color usage, modern typography, balanced white space for executive presence",
    color: "bg-indigo-600",
    badge: "Popular",
  },
  {
    id: "minimal" as ResumeTemplate,
    name: "Minimal Elite",
    description: "Clean, content-focused design that emphasizes substance over style",
    icon: Minus,
    preview: "Maximum white space, minimal styling, content hierarchy for clarity and impact",
    color: "bg-gray-600",
    badge: "Clean",
  },
  {
    id: "creative" as ResumeTemplate,
    name: "Creative Executive",
    description: "Bold yet professional design for creative industries and leadership positions",
    icon: Crown,
    preview: "Creative layout with professional constraints, visual hierarchy for impact",
    color: "bg-emerald-600",
    badge: "Premium",
  },
];

export const TemplateSelector = ({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Professional Template</h3>
        <p className="text-gray-600 text-sm">
          Select a template that reflects your professional level and industry. All templates are ATS-optimized and designed for executive impact.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;
          
          return (
            <Card 
              key={template.id} 
              className={`p-5 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                isSelected 
                  ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => onTemplateChange(template.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${template.color} text-white shadow-sm`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      <Badge 
                        variant={isSelected ? "default" : "secondary"} 
                        className={`text-xs ${isSelected ? 'bg-indigo-600' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {template.badge}
                      </Badge>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-1">
                        <Check className="h-3 w-3 text-indigo-600" />
                        <span className="text-xs text-indigo-600 font-medium">Currently Selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">{template.description}</p>
              
              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md mb-4 border-l-3 border-gray-300">
                <strong className="text-gray-800">Design Features:</strong> {template.preview}
              </div>
              
              <Button 
                variant={isSelected ? "default" : "outline"} 
                size="sm" 
                className={`w-full transition-colors ${
                  isSelected 
                    ? "bg-indigo-600 hover:bg-indigo-700" 
                    : "border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onTemplateChange(template.id);
                }}
              >
                {isSelected ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Selected Template
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Select This Template
                  </>
                )}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Crown className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 mb-2">Professional Template Benefits</h4>
            <ul className="text-sm text-amber-700 space-y-1.5">
              <li>• <strong>ATS-Optimized:</strong> All templates pass Applicant Tracking Systems with 95%+ compatibility</li>
              <li>• <strong>Executive Ready:</strong> Designed for professional and leadership positions</li>
              <li>• <strong>Industry Versatile:</strong> Suitable across all professional sectors and experience levels</li>
              <li>• <strong>Data Preservation:</strong> Switch between templates without losing any information</li>
              <li>• <strong>Print Perfect:</strong> Optimized for both digital viewing and professional printing</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
