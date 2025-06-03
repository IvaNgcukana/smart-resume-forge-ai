
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Plus as PlusIcon } from "lucide-react";

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export const ExperienceForm = ({ data, onChange }: ExperienceFormProps) => {
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [""],
    };
    onChange([...data, newExperience]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    const updated = data.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onChange(updated);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  const addAchievement = (experienceId: string) => {
    const experience = data.find((exp) => exp.id === experienceId);
    if (experience) {
      updateExperience(experienceId, "achievements", [...experience.achievements, ""]);
    }
  };

  const updateAchievement = (experienceId: string, index: number, value: string) => {
    const experience = data.find((exp) => exp.id === experienceId);
    if (experience) {
      const newAchievements = [...experience.achievements];
      newAchievements[index] = value;
      updateExperience(experienceId, "achievements", newAchievements);
    }
  };

  const removeAchievement = (experienceId: string, index: number) => {
    const experience = data.find((exp) => exp.id === experienceId);
    if (experience && experience.achievements.length > 1) {
      const newAchievements = experience.achievements.filter((_, i) => i !== index);
      updateExperience(experienceId, "achievements", newAchievements);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
        <Button onClick={addExperience} size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {data.length === 0 && (
        <Card className="p-6 text-center text-gray-500">
          <p>No work experience entries yet. Click "Add Experience" to get started.</p>
        </Card>
      )}

      {data.map((experience) => (
        <Card key={experience.id} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Work Experience</h4>
            <Button
              onClick={() => removeExperience(experience.id)}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`company-${experience.id}`}>Company Name *</Label>
              <Input
                id={`company-${experience.id}`}
                value={experience.company}
                onChange={(e) => updateExperience(experience.id, "company", e.target.value)}
                placeholder="Tech Corp Inc."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`position-${experience.id}`}>Job Title *</Label>
              <Input
                id={`position-${experience.id}`}
                value={experience.position}
                onChange={(e) => updateExperience(experience.id, "position", e.target.value)}
                placeholder="Software Engineer"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`startDate-${experience.id}`}>Start Date</Label>
              <Input
                id={`startDate-${experience.id}`}
                type="month"
                value={experience.startDate}
                onChange={(e) => updateExperience(experience.id, "startDate", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`endDate-${experience.id}`}>End Date</Label>
              <Input
                id={`endDate-${experience.id}`}
                type="month"
                value={experience.endDate}
                onChange={(e) => updateExperience(experience.id, "endDate", e.target.value)}
                disabled={experience.current}
                className="mt-1"
              />
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id={`current-${experience.id}`}
                  checked={experience.current}
                  onCheckedChange={(checked) => 
                    updateExperience(experience.id, "current", checked)
                  }
                />
                <Label htmlFor={`current-${experience.id}`} className="text-sm">
                  I currently work here
                </Label>
              </div>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor={`description-${experience.id}`}>Job Description</Label>
              <Textarea
                id={`description-${experience.id}`}
                value={experience.description}
                onChange={(e) => updateExperience(experience.id, "description", e.target.value)}
                placeholder="Brief description of your role and responsibilities..."
                className="mt-1 min-h-[80px]"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Key Achievements & Responsibilities</Label>
              <div className="space-y-2 mt-2">
                {experience.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={achievement}
                      onChange={(e) => updateAchievement(experience.id, index, e.target.value)}
                      placeholder="• Increased efficiency by 30% through process optimization"
                      className="flex-1"
                    />
                    {experience.achievements.length > 1 && (
                      <Button
                        onClick={() => removeAchievement(experience.id, index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  onClick={() => addAchievement(experience.id)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
