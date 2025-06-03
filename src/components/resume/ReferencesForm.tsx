
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";

interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

interface ReferencesData {
  showMessage: boolean;
  references: Reference[];
}

interface ReferencesFormProps {
  data: ReferencesData | Reference[];
  onChange: (data: ReferencesData) => void;
}

export const ReferencesForm = ({ data, onChange }: ReferencesFormProps) => {
  // Handle legacy data format
  const referencesData: ReferencesData = Array.isArray(data) 
    ? { showMessage: false, references: data }
    : data;

  const addReference = () => {
    const newReference: Reference = {
      id: Date.now().toString(),
      name: "",
      title: "",
      company: "",
      email: "",
      phone: "",
      relationship: "",
    };
    onChange({
      ...referencesData,
      references: [...referencesData.references, newReference]
    });
  };

  const updateReference = (id: string, field: keyof Reference, value: string) => {
    const updated = referencesData.references.map((ref) =>
      ref.id === id ? { ...ref, [field]: value } : ref
    );
    onChange({
      ...referencesData,
      references: updated
    });
  };

  const removeReference = (id: string) => {
    onChange({
      ...referencesData,
      references: referencesData.references.filter((ref) => ref.id !== id)
    });
  };

  const handleToggleMessage = (checked: boolean) => {
    onChange({
      ...referencesData,
      showMessage: checked
    });
  };

  const relationshipOptions = [
    "Former Manager",
    "Current Manager",
    "Colleague",
    "Client",
    "Professor",
    "Mentor",
    "Direct Report",
    "Other"
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">References</h3>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium">References available upon request</Label>
            <p className="text-sm text-gray-500">
              Show "References available upon request" instead of listing individual references
            </p>
          </div>
          <Switch
            checked={referencesData.showMessage}
            onCheckedChange={handleToggleMessage}
          />
        </div>
      </Card>

      {!referencesData.showMessage && (
        <>
          <div className="flex items-center justify-between">
            <Button onClick={addReference} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Reference
            </Button>
          </div>

          <Card className="p-4 bg-amber-50 border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Most employers will ask for references separately. 
              You can choose to include "References available upon request" on your resume instead of listing them.
            </p>
          </Card>

          {referencesData.references.length === 0 && (
            <Card className="p-6 text-center text-gray-500">
              <p>No references added yet. Click "Add Reference" to include professional references.</p>
            </Card>
          )}

          {referencesData.references.map((reference) => (
            <Card key={reference.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Professional Reference</h4>
                <Button
                  onClick={() => removeReference(reference.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`name-${reference.id}`}>Full Name *</Label>
                  <Input
                    id={`name-${reference.id}`}
                    value={reference.name}
                    onChange={(e) => updateReference(reference.id, "name", e.target.value)}
                    placeholder="Jane Smith"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`title-${reference.id}`}>Job Title *</Label>
                  <Input
                    id={`title-${reference.id}`}
                    value={reference.title}
                    onChange={(e) => updateReference(reference.id, "title", e.target.value)}
                    placeholder="Senior Manager"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`company-${reference.id}`}>Company *</Label>
                  <Input
                    id={`company-${reference.id}`}
                    value={reference.company}
                    onChange={(e) => updateReference(reference.id, "company", e.target.value)}
                    placeholder="Company Name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`relationship-${reference.id}`}>Relationship *</Label>
                  <Select
                    value={reference.relationship}
                    onValueChange={(value) => updateReference(reference.id, "relationship", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationshipOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`email-${reference.id}`}>Email Address *</Label>
                  <Input
                    id={`email-${reference.id}`}
                    type="email"
                    value={reference.email}
                    onChange={(e) => updateReference(reference.id, "email", e.target.value)}
                    placeholder="jane.smith@company.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`phone-${reference.id}`}>Phone Number</Label>
                  <Input
                    id={`phone-${reference.id}`}
                    value={reference.phone}
                    onChange={(e) => updateReference(reference.id, "phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};
