
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Plus, X, Briefcase } from "lucide-react";
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
  industry?: string;
}

const industrySkills = {
  "Software Development": {
    technical: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "Git", "REST APIs"],
    soft: ["Problem Solving", "Code Review", "Agile Methodology", "Technical Documentation"],
    achievements: [
      "• Reduced application load time by 40% through code optimization",
      "• Led development of microservices architecture serving 100K+ users",
      "• Implemented CI/CD pipeline reducing deployment time by 60%"
    ]
  },
  "Marketing": {
    technical: ["Google Analytics", "SEO", "Social Media Management", "Content Management Systems", "Adobe Creative Suite"],
    soft: ["Creative Thinking", "Campaign Management", "Brand Strategy", "Customer Analysis"],
    achievements: [
      "• Increased website traffic by 150% through SEO optimization",
      "• Generated $500K in revenue through targeted marketing campaigns",
      "• Improved conversion rate by 35% through A/B testing"
    ]
  },
  "Finance": {
    technical: ["Excel", "Financial Modeling", "SQL", "Bloomberg Terminal", "Risk Analysis", "Portfolio Management"],
    soft: ["Analytical Thinking", "Attention to Detail", "Risk Assessment", "Client Relations"],
    achievements: [
      "• Managed investment portfolio worth $50M with 15% annual returns",
      "• Reduced operational costs by 20% through process optimization",
      "• Improved financial reporting accuracy by 99.5%"
    ]
  },
  "Healthcare": {
    technical: ["Electronic Health Records", "HIPAA Compliance", "Medical Terminology", "Patient Care Systems"],
    soft: ["Empathy", "Communication", "Critical Thinking", "Stress Management"],
    achievements: [
      "• Improved patient satisfaction scores by 25%",
      "• Reduced medication errors by 40% through process improvements",
      "• Led team of 15 healthcare professionals"
    ]
  },
  "Sales": {
    technical: ["CRM Software", "Sales Analytics", "Lead Generation", "Pipeline Management", "Salesforce"],
    soft: ["Negotiation", "Relationship Building", "Persuasion", "Customer Service"],
    achievements: [
      "• Exceeded sales targets by 130% for three consecutive quarters",
      "• Built client base of 200+ accounts generating $2M annual revenue",
      "• Reduced sales cycle time by 25% through process optimization"
    ]
  }
};

export const SmartSuggestions = ({ resumeData, onApplySuggestion }: SmartSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  const detectIndustry = (): string => {
    const experienceText = resumeData.experience.map(exp => 
      `${exp.position} ${exp.company} ${exp.description} ${exp.achievements.join(' ')}`
    ).join(' ').toLowerCase();

    const skillsText = [
      ...resumeData.skills.technical,
      ...resumeData.skills.soft
    ].join(' ').toLowerCase();

    const summaryText = resumeData.personalInfo.summary.toLowerCase();
    const allText = `${experienceText} ${skillsText} ${summaryText}`;

    // Industry detection keywords
    if (allText.includes('software') || allText.includes('developer') || allText.includes('programming') || 
        allText.includes('react') || allText.includes('javascript') || allText.includes('python')) {
      return "Software Development";
    }
    if (allText.includes('marketing') || allText.includes('seo') || allText.includes('campaign') || 
        allText.includes('brand') || allText.includes('social media')) {
      return "Marketing";
    }
    if (allText.includes('finance') || allText.includes('investment') || allText.includes('banking') || 
        allText.includes('accounting') || allText.includes('financial')) {
      return "Finance";
    }
    if (allText.includes('healthcare') || allText.includes('medical') || allText.includes('patient') || 
        allText.includes('nurse') || allText.includes('doctor')) {
      return "Healthcare";
    }
    if (allText.includes('sales') || allText.includes('revenue') || allText.includes('client') || 
        allText.includes('account manager') || allText.includes('business development')) {
      return "Sales";
    }

    return "Software Development"; // Default fallback
  };

  useEffect(() => {
    generateIndustryBasedSuggestions();
  }, [resumeData]);

  const generateIndustryBasedSuggestions = () => {
    const newSuggestions: Suggestion[] = [];
    const detectedIndustry = detectIndustry();
    const industryData = industrySkills[detectedIndustry as keyof typeof industrySkills];

    if (!industryData) return;

    // Technical skill suggestions
    const missingTechnicalSkills = industryData.technical.filter(
      skill => !resumeData.skills.technical.includes(skill)
    );

    missingTechnicalSkills.slice(0, 2).forEach((skill, index) => {
      newSuggestions.push({
        id: `tech-skill-${index}`,
        type: 'skill',
        title: `Add ${skill}`,
        description: `${skill} is highly valued in ${detectedIndustry}`,
        value: skill,
        category: 'technical',
        industry: detectedIndustry
      });
    });

    // Soft skill suggestions
    const missingSoftSkills = industryData.soft.filter(
      skill => !resumeData.skills.soft.includes(skill)
    );

    missingSoftSkills.slice(0, 1).forEach((skill, index) => {
      newSuggestions.push({
        id: `soft-skill-${index}`,
        type: 'skill',
        title: `Add ${skill}`,
        description: `Essential soft skill for ${detectedIndustry} professionals`,
        value: skill,
        category: 'soft',
        industry: detectedIndustry
      });
    });

    // Industry-specific summary suggestions
    if (!resumeData.personalInfo.summary || resumeData.personalInfo.summary.length < 50) {
      const industrySummaries = {
        "Software Development": "Innovative software developer with expertise in modern web technologies and a passion for creating scalable, user-focused applications that drive business growth.",
        "Marketing": "Results-driven marketing professional with proven track record of developing compelling campaigns that increase brand awareness and drive customer engagement.",
        "Finance": "Detail-oriented finance professional with strong analytical skills and expertise in investment strategies, risk management, and financial planning.",
        "Healthcare": "Compassionate healthcare professional dedicated to providing exceptional patient care while maintaining the highest standards of medical excellence.",
        "Sales": "Dynamic sales professional with consistent track record of exceeding targets and building lasting client relationships that drive revenue growth."
      };

      newSuggestions.push({
        id: 'industry-summary',
        type: 'summary',
        title: `${detectedIndustry} Professional Summary`,
        description: `Tailored summary for ${detectedIndustry} professionals`,
        value: industrySummaries[detectedIndustry as keyof typeof industrySummaries],
        industry: detectedIndustry
      });
    }

    // Industry-specific achievement suggestions
    if (resumeData.experience.length > 0) {
      const latestExp = resumeData.experience[0];
      if (latestExp.achievements.length < 2) {
        newSuggestions.push({
          id: 'industry-achievements',
          type: 'achievement',
          title: `Add ${detectedIndustry} Achievements`,
          description: `Industry-specific accomplishments that showcase your impact`,
          value: industryData.achievements.slice(0, 2).join('\n'),
          industry: detectedIndustry
        });
      }
    }

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

  const detectedIndustry = detectIndustry();

  return (
    <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-indigo-600" />
        <h3 className="font-semibold text-indigo-900">Smart Suggestions</h3>
        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
          <Briefcase className="h-3 w-3 mr-1" />
          {detectedIndustry}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {suggestions.slice(0, 3).map((suggestion) => (
          <div key={suggestion.id} className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{suggestion.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                {suggestion.industry && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {suggestion.industry}
                  </Badge>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applySuggestion(suggestion)}
                  className="h-8 px-2 text-xs bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
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
          +{suggestions.length - 3} more {detectedIndustry.toLowerCase()} suggestions available
        </p>
      )}
    </Card>
  );
};
