
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
import { FileText, Download, User, GraduationCap, Briefcase, Star, Users, Palette } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  const [resumeData, setResumeData] = useState<ResumeData>({
    template: "classic",
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      linkedIn: "",
      portfolio: "",
      summary: "",
    },
    education: [],
    experience: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
      certifications: [],
    },
    references: [],
  });

  const [activeTab, setActiveTab] = useState("personal");

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleExport = () => {
    toast({
      title: "Resume Export",
      description: "Your resume has been prepared for download!",
    });
    // In a real app, this would generate a PDF
    console.log("Exporting resume:", resumeData);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Resume Builder Pro</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create professional, ATS-friendly resumes that get you noticed. 
            Build your resume step by step with our intelligent system.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Build Your Resume</h2>
              <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
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
          </Card>

          {/* Preview Section */}
          <Card className="p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Live Preview</h2>
              <p className="text-gray-600">See how your resume looks in real-time</p>
            </div>
            <div className="border rounded-lg bg-white shadow-sm">
              <ResumePreview data={resumeData} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
