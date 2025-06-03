
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ResumeData } from "@/pages/Index";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview = ({ data }: ResumePreviewProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month] = dateString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 text-sm leading-relaxed">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-4 text-gray-600 text-sm">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {data.personalInfo.email}
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {data.personalInfo.phone}
            </div>
          )}
          {data.personalInfo.address && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {data.personalInfo.address}
            </div>
          )}
          {data.personalInfo.linkedIn && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-3 w-3" />
              {data.personalInfo.linkedIn}
            </div>
          )}
          {data.personalInfo.portfolio && (
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {data.personalInfo.portfolio}
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-gray-600 text-sm">
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mb-2">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && exp.achievements[0] && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {exp.achievements.filter(achievement => achievement.trim()).map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            EDUCATION
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-gray-700">{edu.institution}</p>
                    {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                    {edu.honors && <p className="text-gray-600 text-sm">{edu.honors}</p>}
                  </div>
                  {edu.graduationDate && (
                    <div className="text-gray-600 text-sm">
                      {formatDate(edu.graduationDate)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(data.skills.technical.length > 0 || data.skills.soft.length > 0 || 
        data.skills.languages.length > 0 || data.skills.certifications.length > 0) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            SKILLS & QUALIFICATIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.skills.technical.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Technical Skills</h3>
                <p className="text-gray-700">{data.skills.technical.join(", ")}</p>
              </div>
            )}
            {data.skills.soft.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Soft Skills</h3>
                <p className="text-gray-700">{data.skills.soft.join(", ")}</p>
              </div>
            )}
            {data.skills.languages.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
                <p className="text-gray-700">{data.skills.languages.join(", ")}</p>
              </div>
            )}
            {data.skills.certifications.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Certifications</h3>
                <p className="text-gray-700">{data.skills.certifications.join(", ")}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            REFERENCES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.references.map((ref) => (
              <div key={ref.id} className="text-sm">
                <h3 className="font-semibold text-gray-900">{ref.name}</h3>
                <p className="text-gray-700">{ref.title}</p>
                <p className="text-gray-700">{ref.company}</p>
                <p className="text-gray-600">{ref.relationship}</p>
                <div className="text-gray-600 mt-1">
                  {ref.email && <p>{ref.email}</p>}
                  {ref.phone && <p>{ref.phone}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!data.personalInfo.fullName && data.experience.length === 0 && data.education.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">Your resume preview will appear here</p>
          <p>Start filling out the form to see your professional resume take shape</p>
        </div>
      )}
    </div>
  );
};
