
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useResumeData = () => {
  const { user } = useAuth();
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
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your resume data.",
        variant: "destructive",
      });
      return;
    }

    try {
      const resumeRecord = {
        user_id: user.id,
        template: data.template,
        full_name: data.personalInfo.fullName,
        email: data.personalInfo.email,
        phone: data.personalInfo.phone,
        address: data.personalInfo.address,
        linkedin: data.personalInfo.linkedIn,
        portfolio: data.personalInfo.portfolio,
        summary: data.personalInfo.summary,
        education: data.education,
        experience: data.experience,
        skills: data.skills,
        resume_references: data.references,
      };

      // Try to update existing resume first
      const { data: existingResume } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingResume) {
        // Update existing resume
        const { error } = await supabase
          .from('resumes')
          .update(resumeRecord)
          .eq('id', existingResume.id);

        if (error) throw error;
      } else {
        // Insert new resume
        const { error } = await supabase
          .from('resumes')
          .insert([resumeRecord]);

        if (error) throw error;
      }

      toast({
        title: "Resume Saved!",
        description: "Your resume data has been saved to the database.",
      });

      console.log('Resume data saved to Supabase:', data);
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your resume data.",
        variant: "destructive",
      });
    }
  };

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    const loadResumeData = async () => {
      if (!user) return;

      try {
        const { data: resume, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
          throw error;
        }

        if (resume) {
          setResumeData({
            template: resume.template as any,
            personalInfo: {
              fullName: resume.full_name || "",
              email: resume.email || "",
              phone: resume.phone || "",
              address: resume.address || "",
              linkedIn: resume.linkedin || "",
              portfolio: resume.portfolio || "",
              summary: resume.summary || "",
            },
            education: resume.education || [],
            experience: resume.experience || [],
            skills: resume.skills || {
              technical: [],
              soft: [],
              languages: [],
              certifications: [],
            },
            references: resume.resume_references || [],
          });
        }
      } catch (error) {
        console.error('Error loading resume data:', error);
      }
    };

    loadResumeData();
  }, [user]);

  return {
    resumeData,
    updateResumeData,
    saveResumeData,
  };
};
