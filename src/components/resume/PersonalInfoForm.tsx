
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedIn: string;
  portfolio: string;
  summary: string;
}

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export const PersonalInfoForm = ({ data, onChange }: PersonalInfoFormProps) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={data.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="John Doe"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john.doe@email.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={data.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="City, State, ZIP"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="linkedIn">LinkedIn Profile</Label>
            <Input
              id="linkedIn"
              value={data.linkedIn}
              onChange={(e) => handleChange("linkedIn", e.target.value)}
              placeholder="linkedin.com/in/johndoe"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="portfolio">Portfolio/Website</Label>
            <Input
              id="portfolio"
              value={data.portfolio}
              onChange={(e) => handleChange("portfolio", e.target.value)}
              placeholder="www.johndoe.com"
              className="mt-1"
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            value={data.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            placeholder="Brief overview of your professional background, key skills, and career objectives..."
            className="mt-1 min-h-[100px]"
          />
          <p className="text-sm text-gray-500 mt-1">
            Tip: Write 2-3 sentences highlighting your experience and what you bring to the role.
          </p>
        </div>
      </div>
    </Card>
  );
};
