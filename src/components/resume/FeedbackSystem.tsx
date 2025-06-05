
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FeedbackSystemProps {
  onFeedbackSubmit: (feedback: FeedbackData) => void;
}

interface FeedbackData {
  rating: 'positive' | 'negative' | null;
  comment: string;
  suggestions: string[];
  timestamp: Date;
}

export const FeedbackSystem = ({ onFeedbackSubmit }: FeedbackSystemProps) => {
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating && !comment.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please provide a rating or comment before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const feedbackData: FeedbackData = {
      rating,
      comment: comment.trim(),
      suggestions: [], // Could be populated based on analysis
      timestamp: new Date(),
    };

    try {
      onFeedbackSubmit(feedbackData);
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll use it to improve our suggestions.",
      });

      // Reset form
      setRating(null);
      setComment("");
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold text-green-900">Feedback & Improvement</h3>
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          Learning System
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-700 mb-3">
            How are our suggestions helping you? Your feedback improves our AI recommendations.
          </p>
          
          <div className="flex gap-2 mb-4">
            <Button
              variant={rating === 'positive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRating('positive')}
              className={rating === 'positive' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Helpful
            </Button>
            <Button
              variant={rating === 'negative' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRating('negative')}
              className={rating === 'negative' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              Not Helpful
            </Button>
          </div>
        </div>

        <div>
          <Textarea
            placeholder="Tell us what would make our suggestions more helpful for your industry or role..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px] text-sm"
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Your feedback helps improve suggestions for all users
          </p>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (!rating && !comment.trim())}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-3 w-3 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
