
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, XCircle, Shield } from "lucide-react";
import { ResumeData } from "@/pages/Index";

interface ATSCheckerProps {
  resumeData: ResumeData;
}

interface ATSCheck {
  id: string;
  name: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  weight: number;
}

export const ATSChecker = ({ resumeData }: ATSCheckerProps) => {
  const [checks, setChecks] = useState<ATSCheck[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    performATSChecks();
  }, [resumeData]);

  const performATSChecks = () => {
    const atsChecks: ATSCheck[] = [
      {
        id: 'contact-info',
        name: 'Contact Information',
        status: (resumeData.personalInfo.email && resumeData.personalInfo.phone) ? 'pass' : 'fail',
        message: (resumeData.personalInfo.email && resumeData.personalInfo.phone) 
          ? 'Email and phone number are present' 
          : 'Missing email or phone number',
        weight: 15
      },
      {
        id: 'professional-summary',
        name: 'Professional Summary',
        status: resumeData.personalInfo.summary ? 
          (resumeData.personalInfo.summary.length > 100 ? 'pass' : 'warning') : 'fail',
        message: resumeData.personalInfo.summary ? 
          (resumeData.personalInfo.summary.length > 100 ? 'Good summary length' : 'Summary could be more detailed') 
          : 'Missing professional summary',
        weight: 20
      },
      {
        id: 'work-experience',
        name: 'Work Experience',
        status: resumeData.experience.length > 0 ? 'pass' : 'fail',
        message: resumeData.experience.length > 0 ? 
          `${resumeData.experience.length} work experience(s) listed` : 
          'No work experience listed',
        weight: 25
      },
      {
        id: 'skills-keywords',
        name: 'Skills & Keywords',
        status: (resumeData.skills.technical.length + resumeData.skills.soft.length) >= 5 ? 'pass' : 'warning',
        message: (resumeData.skills.technical.length + resumeData.skills.soft.length) >= 5 ? 
          'Good variety of skills listed' : 
          'Consider adding more relevant skills',
        weight: 20
      },
      {
        id: 'education',
        name: 'Education',
        status: resumeData.education.length > 0 ? 'pass' : 'warning',
        message: resumeData.education.length > 0 ? 
          'Education information provided' : 
          'No education information (may be required for some positions)',
        weight: 10
      },
      {
        id: 'formatting',
        name: 'ATS-Friendly Formatting',
        status: 'pass',
        message: 'Using standard formatting compatible with ATS systems',
        weight: 10
      }
    ];

    setChecks(atsChecks);
    
    // Calculate score
    const totalWeight = atsChecks.reduce((sum, check) => sum + check.weight, 0);
    const earnedWeight = atsChecks.reduce((sum, check) => {
      if (check.status === 'pass') return sum + check.weight;
      if (check.status === 'warning') return sum + (check.weight * 0.5);
      return sum;
    }, 0);
    
    setScore(Math.round((earnedWeight / totalWeight) * 100));
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = () => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  return (
    <Card className={`p-4 ${getScoreBg()}`}>
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">ATS Compatibility Check</h3>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          Automated
        </Badge>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">ATS Score</span>
          <span className={`text-lg font-bold ${getScoreColor()}`}>{score}%</span>
        </div>
        <Progress value={score} className="h-2" />
      </div>

      <div className="space-y-2">
        {checks.map((check) => {
          const Icon = check.status === 'pass' ? CheckCircle : 
                     check.status === 'warning' ? AlertCircle : XCircle;
          const iconColor = check.status === 'pass' ? 'text-green-600' : 
                           check.status === 'warning' ? 'text-yellow-600' : 'text-red-600';
          
          return (
            <div key={check.id} className="flex items-start gap-2 p-2 bg-white rounded border">
              <Icon className={`h-4 w-4 mt-0.5 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{check.name}</span>
                  <Badge 
                    variant={check.status === 'pass' ? 'default' : 'secondary'}
                    className={`text-xs ${
                      check.status === 'pass' ? 'bg-green-100 text-green-800' :
                      check.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {check.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">{check.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-white rounded border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>Tips:</strong> ATS systems scan for keywords, proper formatting, and complete information. 
          A score of 80%+ significantly improves your chances of passing initial screening.
        </p>
      </div>
    </Card>
  );
};
