
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface FeedbackData {
  rating: 'positive' | 'negative' | null;
  comment: string;
  suggestions: string[];
  timestamp: Date;
}

interface Suggestion {
  id: string;
  type: 'skill' | 'achievement' | 'summary' | 'experience';
  title: string;
  description: string;
  value: string;
  category?: string;
}

export const useFeedbackSystem = () => {
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackData[]>([]);
  
  const submitFeedback = (feedback: FeedbackData) => {
    setFeedbackHistory(prev => [...prev, feedback]);
    
    // Store in localStorage for persistence
    const stored = localStorage.getItem('resume-feedback');
    const existing = stored ? JSON.parse(stored) : [];
    const updated = [...existing, feedback];
    localStorage.setItem('resume-feedback', JSON.stringify(updated));
    
    console.log('Feedback submitted:', feedback);
  };

  const generateImprovedSuggestions = (resumeData: any): Suggestion[] => {
    // Analyze feedback to improve suggestions
    const positiveFeedback = feedbackHistory.filter(f => f.rating === 'positive');
    const negativeFeedback = feedbackHistory.filter(f => f.rating === 'negative');
    
    const suggestions: Suggestion[] = [];
    
    // Use feedback patterns to generate better suggestions
    if (positiveFeedback.length > negativeFeedback.length) {
      // User likes current approach, continue similar suggestions
      suggestions.push({
        id: 'improved-skill',
        type: 'skill',
        title: 'Enhanced Skill Recommendation',
        description: 'Based on positive feedback, adding complementary skills',
        value: 'Advanced Skills Based on Your Preferences'
      });
    }
    
    return suggestions;
  };

  return {
    submitFeedback,
    generateImprovedSuggestions,
    feedbackHistory
  };
};
