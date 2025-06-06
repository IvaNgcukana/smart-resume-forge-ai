
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

  const [isLoading, setIsLoading] = useState(false);

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  const saveResumeData = async (data: ResumeData) => {
    if (!data.personalInfo.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to save your resume.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const resumeRecord = {
        user_id: null,
        template: data.template,
        full_name: data.personalInfo.fullName || null,
        email: data.personalInfo.email,
        phone: data.personalInfo.phone || null,
        address: data.personalInfo.address || null,
        linkedin: data.personalInfo.linkedIn || null,
        portfolio: data.personalInfo.portfolio || null,
        summary: data.personalInfo.summary || null,
        education: data.education,
        experience: data.experience,
        skills: data.skills,
        resume_references: data.references,
      };

      // Check if we have a resume with this email
      const { data: existingResume, error: fetchError } = await supabase
        .from('resumes')
        .select('id')
        .eq('email', data.personalInfo.email)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching existing resume:', fetchError);
        throw fetchError;
      }

      if (existingResume) {
        // Update existing resume
        const { error: updateError } = await supabase
          .from('resumes')
          .update(resumeRecord)
          .eq('id', existingResume.id);

        if (updateError) throw updateError;
        
        toast({
          title: "Resume Updated!",
          description: "Your resume has been successfully updated.",
        });
      } else {
        // Insert new resume
        const { error: insertError } = await supabase
          .from('resumes')
          .insert([resumeRecord]);

        if (insertError) throw insertError;
        
        toast({
          title: "Resume Created!",
          description: "Your resume has been successfully saved.",
        });
      }

      console.log('Resume data saved to Supabase:', data);
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your resume data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data from Supabase based on email when it's provided
  useEffect(() => {
    const loadResumeData = async () => {
      if (!resumeData.personalInfo.email || resumeData.personalInfo.email.length < 5) return;

      try {
        const { data: resume, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('email', resumeData.personalInfo.email)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading resume data:', error);
          return;
        }

        if (resume) {
          setResumeData({
            template: (resume.template as ResumeData['template']) || "classic",
            personalInfo: {
              fullName: resume.full_name || "",
              email: resume.email || "",
              phone: resume.phone || "",
              address: resume.address || "",
              linkedIn: resume.linkedin || "",
              portfolio: resume.portfolio || "",
              summary: resume.summary || "",
            },
            education: Array.isArray(resume.education) ? resume.education as ResumeData['education'] : [],
            experience: Array.isArray(resume.experience) ? resume.experience as ResumeData['experience'] : [],
            skills: (resume.skills && typeof resume.skills === 'object' && !Array.isArray(resume.skills)) 
              ? resume.skills as ResumeData['skills']
              : {
                  technical: [],
                  soft: [],
                  languages: [],
                  certifications: [],
                },
            references: Array.isArray(resume.resume_references) ? resume.resume_references as ResumeData['references'] : [],
          });
          
          toast({
            title: "Resume Loaded",
            description: "Your existing resume data has been loaded.",
          });
        }
      } catch (error) {
        console.error('Error loading resume data:', error);
      }
    };

    const timeoutId = setTimeout(loadResumeData, 1500);
    return () => clearTimeout(timeoutId);
  }, [resumeData.personalInfo.email]);

  return {
    resumeData,
    updateResumeData,
    saveResumeData,
    isLoading,
  };
};
