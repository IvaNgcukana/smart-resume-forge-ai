
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa: string;
  honors: string;
}

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export const EducationForm = ({ data, onChange }: EducationFormProps) => {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      graduationDate: "",
      gpa: "",
      honors: "",
    };
    onChange([...data, newEducation]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const updated = data.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onChange(updated);
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
        <Button onClick={addEducation} size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {data.length === 0 && (
        <Card className="p-6 text-center text-gray-500">
          <p>No education entries yet. Click "Add Education" to get started.</p>
        </Card>
      )}

      {data.map((education) => (
        <Card key={education.id} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Education Entry</h4>
            <Button
              onClick={() => removeEducation(education.id)}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor={`institution-${education.id}`}>Institution Name *</Label>
              <Input
                id={`institution-${education.id}`}
                value={education.institution}
                onChange={(e) => updateEducation(education.id, "institution", e.target.value)}
                placeholder="University of Example"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`degree-${education.id}`}>Degree *</Label>
              <Input
                id={`degree-${education.id}`}
                value={education.degree}
                onChange={(e) => updateEducation(education.id, "degree", e.target.value)}
                placeholder="Bachelor of Science"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`field-${education.id}`}>Field of Study *</Label>
              <Input
                id={`field-${education.id}`}
                value={education.field}
                onChange={(e) => updateEducation(education.id, "field", e.target.value)}
                placeholder="Computer Science"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`graduationDate-${education.id}`}>Graduation Date</Label>
              <Input
                id={`graduationDate-${education.id}`}
                type="month"
                value={education.graduationDate}
                onChange={(e) => updateEducation(education.id, "graduationDate", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`gpa-${education.id}`}>GPA (Optional)</Label>
              <Input
                id={`gpa-${education.id}`}
                value={education.gpa}
                onChange={(e) => updateEducation(education.id, "gpa", e.target.value)}
                placeholder="3.8/4.0"
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor={`honors-${education.id}`}>Honors & Awards</Label>
              <Input
                id={`honors-${education.id}`}
                value={education.honors}
                onChange={(e) => updateEducation(education.id, "honors", e.target.value)}
                placeholder="Magna Cum Laude, Dean's List"
                className="mt-1"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
