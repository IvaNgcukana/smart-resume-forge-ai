
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Plus, X } from "lucide-react";
import { ResumeData } from "@/pages/Index";

interface SmartSuggestionsProps {
  resumeData: ResumeData;
  onApplySuggestion: (suggestion: Suggestion) => void;
}

interface Suggestion {
  id: string;
  type: 'skill' | 'achievement' | 'summary' | 'experience';
  title: string;
  description: string;
  value: string;
  category?: string;
}

export const SmartSuggestions = ({ resumeData, onApplySuggestion }: SmartSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    generateSuggestions();
  }, [resumeData]);

  const generateSuggestions = () => {
    const newSuggestions: Suggestion[] = [];

    // Skill suggestions based on existing skills
    if (resumeData.skills.technical.length > 0) {
      const techSkills = resumeData.skills.technical;
      if (techSkills.includes('React') && !techSkills.includes('TypeScript')) {
        newSuggestions.push({
          id: 'ts-suggestion',
          type: 'skill',
          title: 'Add TypeScript',
          description: 'TypeScript pairs well with React development',
          value: 'TypeScript',
          category: 'technical'
        });
      }
      
      if (techSkills.includes('JavaScript') && !techSkills.includes('Node.js')) {
        newSuggestions.push({
          id: 'node-suggestion',
          type: 'skill',
          title: 'Add Node.js',
          description: 'Node.js complements JavaScript development',
          value: 'Node.js',
          category: 'technical'
        });
      }
    }

    // Summary suggestions
    if (!resumeData.personalInfo.summary || resumeData.personalInfo.summary.length < 50) {
      newSuggestions.push({
        id: 'summary-suggestion',
        type: 'summary',
        title: 'Enhance Professional Summary',
        description: 'Add a compelling summary highlighting your key achievements',
        value: 'Results-driven professional with expertise in delivering high-quality solutions and driving business growth through innovative approaches and collaborative leadership.'
      });
    }

    // Achievement suggestions for experience
    resumeData.experience.forEach((exp, index) => {
      if (exp.achievements.length < 2) {
        newSuggestions.push({
          id: `achievement-${index}`,
          type: 'achievement',
          title: `Add achievements for ${exp.position}`,
          description: 'Quantify your impact with specific metrics and results',
          value: '• Improved team productivity by 25% through process optimization\n• Led cross-functional projects resulting in $50K cost savings'
        });
      }
    });

    setSuggestions(newSuggestions.filter(s => !appliedSuggestions.has(s.id)));
  };

  const applySuggestion = (suggestion: Suggestion) => {
    onApplySuggestion(suggestion);
    setAppliedSuggestions(prev => new Set([...prev, suggestion.id]));
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-purple-600" />
        <h3 className="font-semibold text-purple-900">Smart Suggestions</h3>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          AI-Powered
        </Badge>
      </div>
      
      <div className="space-y-3">
        {suggestions.slice(0, 3).map((suggestion) => (
          <div key={suggestion.id} className="bg-white p-3 rounded-lg border border-purple-100">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{suggestion.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applySuggestion(suggestion)}
                  className="h-8 px-2 text-xs bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dismissSuggestion(suggestion.id)}
                  className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {suggestions.length > 3 && (
        <p className="text-xs text-gray-500 mt-2">
          +{suggestions.length - 3} more suggestions available
        </p>
      )}
    </Card>
  );
};
