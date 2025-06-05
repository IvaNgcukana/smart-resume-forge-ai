
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";

export const useResumeData = () => {
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

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  const saveResumeData = async (data: ResumeData) => {
    try {
      // Generate a unique user ID for this session since we don't have auth
      const sessionUserId = crypto.randomUUID();
      
      const resumeRecord = {
        user_id: sessionUserId,
        full_name: data.personalInfo.fullName,
        email: data.personalInfo.email,
        phone: data.personalInfo.phone,
        address: data.personalInfo.address,
        linkedin: data.personalInfo.linkedIn,
        portfolio: data.personalInfo.portfolio,
        summary: data.personalInfo.summary,
        template: data.template,
        education: data.education,
        experience: data.experience,
        skills: data.skills,
        resume_references: data.references,
      };

      const { error } = await supabase
        .from('resumes')
        .insert(resumeRecord);

      if (error) {
        console.error('Error saving resume:', error);
        toast({
          title: "Save Failed",
          description: "There was an error saving your resume data.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Resume Saved!",
          description: "Your resume data has been saved successfully.",
        });
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your resume data.",
        variant: "destructive",
      });
    }
  };

  return {
    resumeData,
    updateResumeData,
    saveResumeData,
  };
};
