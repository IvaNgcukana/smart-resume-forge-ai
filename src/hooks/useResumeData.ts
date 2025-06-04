
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";

export const useResumeData = (userId: string | undefined) => {
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
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load existing resume data
  useEffect(() => {
    if (userId) {
      loadResumeData();
    }
  }, [userId]);

  const loadResumeData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setResumeId(data.id);
        setResumeData({
          template: data.template || "classic",
          personalInfo: {
            fullName: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            linkedIn: data.linkedin || "",
            portfolio: data.portfolio || "",
            summary: data.summary || "",
          },
          education: data.education || [],
          experience: data.experience || [],
          skills: data.skills || {
            technical: [],
            soft: [],
            languages: [],
            certifications: [],
          },
          references: data.resume_references || [],
        });
      }
    } catch (error: any) {
      console.error("Error loading resume data:", error);
      toast({
        title: "Error",
        description: "Failed to load your resume data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveResumeData = async (data: ResumeData) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your resume.",
        variant: "destructive",
      });
      return;
    }

    try {
      const resumePayload = {
        user_id: userId,
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

      if (resumeId) {
        // Update existing resume
        const { error } = await supabase
          .from("resumes")
          .update(resumePayload)
          .eq("id", resumeId);
        if (error) throw error;
      } else {
        // Create new resume
        const { data: newResume, error } = await supabase
          .from("resumes")
          .insert(resumePayload)
          .select()
          .single();
        if (error) throw error;
        setResumeId(newResume.id);
      }

      toast({
        title: "Resume Saved",
        description: "Your resume has been saved successfully!",
      });
    } catch (error: any) {
      console.error("Error saving resume data:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    const updatedData = {
      ...resumeData,
      [section]: data,
    };
    setResumeData(updatedData);
    
    // Auto-save after a short delay
    setTimeout(() => {
      saveResumeData(updatedData);
    }, 1000);
  };

  return {
    resumeData,
    setResumeData,
    updateResumeData,
    saveResumeData,
    loading,
  };
};
