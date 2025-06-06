import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "@/components/resume/PersonalInfoForm";
import { EducationForm } from "@/components/resume/EducationForm";
import { ExperienceForm } from "@/components/resume/ExperienceForm";
import { SkillsForm } from "@/components/resume/SkillsForm";
import { ReferencesForm } from "@/components/resume/ReferencesForm";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { TemplateSelector } from "@/components/resume/TemplateSelector";
import { ExportOptions } from "@/components/resume/ExportOptions";
import { SmartSuggestions } from "@/components/resume/SmartSuggestions";
import { ATSChecker } from "@/components/resume/ATSChecker";
import { FeedbackSystem } from "@/components/resume/FeedbackSystem";
import { FileText, Download, User, GraduationCap, Briefcase, Star, Users, Palette } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useResumeData } from "@/hooks/useResumeData";
import { useFeedbackSystem } from "@/hooks/useFeedbackSystem";

export type ResumeTemplate = "classic" | "modern" | "minimal" | "creative";

export interface ResumeData {
  template: ResumeTemplate;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedIn: string;
    portfolio: string;
    summary: string;
  };
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa: string;
    honors: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
    certifications: string[];
  };
  references: Array<{
    id: string;
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    relationship: string;
  }>;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const { resumeData, updateResumeData, saveResumeData, isLoading } = useResumeData();
  const { submitFeedback, generateImprovedSuggestions } = useFeedbackSystem();

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const handleSaveResume = async () => {
    await saveResumeData(resumeData);
  };

  const handleApplySuggestion = (suggestion: any) => {
    switch (suggestion.type) {
      case 'skill':
        if (suggestion.category && resumeData.skills[suggestion.category as keyof typeof resumeData.skills]) {
          const currentSkills = resumeData.skills[suggestion.category as keyof typeof resumeData.skills] as string[];
          updateResumeData('skills', {
            ...resumeData.skills,
            [suggestion.category]: [...currentSkills, suggestion.value]
          });
        }
        break;
      case 'summary':
        updateResumeData('personalInfo', {
          ...resumeData.personalInfo,
          summary: suggestion.value
        });
        break;
      case 'achievement':
        // Add to the latest experience entry
        if (resumeData.experience.length > 0) {
          const updatedExperience = [...resumeData.experience];
          const latestExp = updatedExperience[0];
          const newAchievements = suggestion.value.split('\n').filter((a: string) => a.trim());
          latestExp.achievements = [...latestExp.achievements, ...newAchievements];
          updateResumeData('experience', updatedExperience);
        }
        break;
    }
    
    toast({
      title: "Suggestion Applied",
      description: `Added: ${suggestion.title}`,
    });
  };

  const tabItems = [
    { id: "template", label: "Template", icon: Palette },
    { id: "personal", label: "Personal Info", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Star },
    { id: "references", label: "References", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-10 w-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">Resume Builder Pro</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create professional, ATS-friendly resumes with AI-powered industry insights. 
            Build your resume step by step with intelligent suggestions tailored to your field.
          </p>
        </div>

        {/* AI Assistance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SmartSuggestions 
            resumeData={resumeData} 
            onApplySuggestion={handleApplySuggestion}
          />
          <ATSChecker resumeData={resumeData} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Build Your Resume</h2>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveResume}
                  disabled={isLoading}
                  variant="outline"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Resume"}
                </Button>
                <Button 
                  onClick={handleExport} 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  disabled={!resumeData.personalInfo.fullName}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Resume
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-6">
                {tabItems.map((item) => (
                  <TabsTrigger 
                    key={item.id} 
                    value={item.id}
                    className="flex flex-col gap-1 p-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-xs">{item.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="template" className="space-y-4">
                <TemplateSelector
                  selectedTemplate={resumeData.template}
                  onTemplateChange={(template) => updateResumeData("template", template)}
                />
              </TabsContent>

              <TabsContent value="personal" className="space-y-4">
                <PersonalInfoForm
                  data={resumeData.personalInfo}
                  onChange={(data) => updateResumeData("personalInfo", data)}
                />
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <EducationForm
                  data={resumeData.education}
                  onChange={(data) => updateResumeData("education", data)}
                />
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                <ExperienceForm
                  data={resumeData.experience}
                  onChange={(data) => updateResumeData("experience", data)}
                />
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <SkillsForm
                  data={resumeData.skills}
                  onChange={(data) => updateResumeData("skills", data)}
                />
              </TabsContent>

              <TabsContent value="references" className="space-y-4">
                <ReferencesForm
                  data={resumeData.references}
                  onChange={(data) => updateResumeData("references", data)}
                />
              </TabsContent>
            </Tabs>

            {/* Feedback System */}
            <div className="mt-6">
              <FeedbackSystem onFeedbackSubmit={submitFeedback} />
            </div>
          </Card>

          {/* Preview Section */}
          <Card className="p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Live Preview</h2>
              <p className="text-gray-600">See how your professional resume looks in real-time</p>
            </div>
            <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
              <ResumePreview data={resumeData} />
            </div>
          </Card>
        </div>

        {/* Export Dialog */}
        <ExportOptions
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          resumeData={resumeData}
          onSave={saveResumeData}
        />
      </div>
    </div>
  );
};

export default Index;
