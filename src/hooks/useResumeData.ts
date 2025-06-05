
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
      // For now, we'll store data locally since there's no authentication
      // This will preserve the data during the session
      localStorage.setItem('resumeData', JSON.stringify(data));
      
      toast({
        title: "Resume Saved!",
        description: "Your resume data has been saved locally.",
      });

      console.log('Resume data saved locally:', data);
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your resume data.",
        variant: "destructive",
      });
    }
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('resumeData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setResumeData(parsedData);
      }
    } catch (error) {
      console.error('Error loading saved resume data:', error);
    }
  }, []);

  return {
    resumeData,
    updateResumeData,
    saveResumeData,
  };
};
