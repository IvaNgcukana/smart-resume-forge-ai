
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
      const resumeRecord = {
        user_id: null, // No user authentication needed
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

      // Check if we have a resume with this email (simple identification)
      const { data: existingResume } = await supabase
        .from('resumes')
        .select('id')
        .eq('email', data.personalInfo.email)
        .maybeSingle();

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

  // Load data from Supabase based on email when it's provided
  useEffect(() => {
    const loadResumeData = async () => {
      if (!resumeData.personalInfo.email) return;

      try {
        const { data: resume, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('email', resumeData.personalInfo.email)
          .maybeSingle();

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
            education: Array.isArray(resume.education) ? resume.education as any[] : [],
            experience: Array.isArray(resume.experience) ? resume.experience as any[] : [],
            skills: (resume.skills && typeof resume.skills === 'object' && !Array.isArray(resume.skills)) 
              ? resume.skills as any 
              : {
                  technical: [],
                  soft: [],
                  languages: [],
                  certifications: [],
                },
            references: Array.isArray(resume.resume_references) ? resume.resume_references as any[] : [],
          });
        }
      } catch (error) {
        console.error('Error loading resume data:', error);
      }
    };

    // Debounce the load function to avoid too many API calls
    const timeoutId = setTimeout(loadResumeData, 1000);
    return () => clearTimeout(timeoutId);
  }, [resumeData.personalInfo.email]);

  return {
    resumeData,
    updateResumeData,
    saveResumeData,
  };
};
