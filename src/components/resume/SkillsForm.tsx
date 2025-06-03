
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
  certifications: string[];
}

interface SkillsFormProps {
  data: Skills;
  onChange: (data: Skills) => void;
}

export const SkillsForm = ({ data, onChange }: SkillsFormProps) => {
  const [inputValues, setInputValues] = useState({
    technical: "",
    soft: "",
    languages: "",
    certifications: "",
  });

  const addSkill = (category: keyof Skills, skill: string) => {
    if (skill.trim() && !data[category].includes(skill.trim())) {
      onChange({
        ...data,
        [category]: [...data[category], skill.trim()],
      });
      setInputValues({
        ...inputValues,
        [category]: "",
      });
    }
  };

  const removeSkill = (category: keyof Skills, skillToRemove: string) => {
    onChange({
      ...data,
      [category]: data[category].filter((skill) => skill !== skillToRemove),
    });
  };

  const handleKeyPress = (category: keyof Skills, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(category, inputValues[category]);
    }
  };

  const SkillSection = ({ 
    title, 
    category, 
    placeholder 
  }: { 
    title: string; 
    category: keyof Skills; 
    placeholder: string;
  }) => (
    <Card className="p-4">
      <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={inputValues[category]}
            onChange={(e) => setInputValues({
              ...inputValues,
              [category]: e.target.value,
            })}
            onKeyPress={(e) => handleKeyPress(category, e)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            onClick={() => addSkill(category, inputValues[category])}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data[category].map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              {skill}
              <button
                onClick={() => removeSkill(category, skill)}
                className="ml-1 text-gray-500 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Skills & Qualifications</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkillSection
          title="Technical Skills"
          category="technical"
          placeholder="JavaScript, Python, React..."
        />
        <SkillSection
          title="Soft Skills"
          category="soft"
          placeholder="Leadership, Communication..."
        />
        <SkillSection
          title="Languages"
          category="languages"
          placeholder="English (Native), Spanish..."
        />
        <SkillSection
          title="Certifications"
          category="certifications"
          placeholder="AWS Certified, PMP..."
        />
      </div>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>ATS Tip:</strong> Include relevant keywords from the job posting in your skills section. 
          Use specific technologies and tools mentioned in the job requirements.
        </p>
      </Card>
    </div>
  );
};
