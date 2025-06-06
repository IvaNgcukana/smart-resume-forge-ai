import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ResumeData } from "@/pages/Index";
import { Mail, Phone, MapPin, Globe, Linkedin, FileText } from "lucide-react";

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

  const getTemplateStyles = () => {
    switch (data.template) {
      case "modern":
        return {
          container: "bg-white text-gray-900 shadow-sm",
          header: "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-8 relative overflow-hidden",
          headerOverlay: "absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-600/90",
          name: "text-3xl font-bold mb-3 relative z-10",
          contact: "text-indigo-100 opacity-95 relative z-10",
          sectionHeader: "text-lg font-bold text-indigo-700 mb-4 border-b-2 border-indigo-200 pb-2 uppercase tracking-wide",
          content: "p-8",
        };
      case "minimal":
        return {
          container: "bg-white text-gray-800 shadow-sm",
          header: "border-b-2 border-gray-200 p-8 bg-gray-50",
          headerOverlay: "",
          name: "text-3xl font-light mb-3 text-gray-900 tracking-wide",
          contact: "text-gray-600",
          sectionHeader: "text-base font-semibold text-gray-900 mb-4 uppercase tracking-widest border-b border-gray-300 pb-2",
          content: "p-8",
        };
      case "creative":
        return {
          container: "bg-white text-gray-900 shadow-sm",
          header: "bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-600 text-white p-8 relative",
          headerOverlay: "absolute inset-0 bg-gradient-to-r from-emerald-600/95 to-teal-600/95",
          name: "text-3xl font-bold mb-3 relative z-10",
          contact: "text-emerald-100 relative z-10",
          sectionHeader: "text-lg font-bold text-emerald-700 mb-4 border-l-4 border-emerald-500 pl-4 uppercase tracking-wide",
          content: "p-8",
        };
      default: // classic
        return {
          container: "bg-white text-gray-900 shadow-sm",
          header: "text-center p-8 border-b-3 border-slate-300 bg-slate-50",
          headerOverlay: "",
          name: "text-3xl font-bold mb-3 text-slate-900 tracking-wide",
          contact: "text-slate-600",
          sectionHeader: "text-lg font-bold text-slate-900 mb-4 border-b-2 border-slate-300 pb-2 uppercase tracking-wide",
          content: "p-8",
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className={`resume-preview max-w-4xl mx-auto text-sm leading-relaxed ${styles.container} min-h-[800px]`}>
      {/* Header */}
      <div className={`${styles.header} relative`}>
        {styles.headerOverlay && <div className={styles.headerOverlay}></div>}
        <h1 className={styles.name}>
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        
        <div className={`flex flex-wrap justify-center gap-6 text-sm ${styles.contact}`}>
          {data.personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{data.personalInfo.address}</span>
            </div>
          )}
          {data.personalInfo.linkedIn && (
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              <span>{data.personalInfo.linkedIn}</span>
            </div>
          )}
          {data.personalInfo.portfolio && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{data.personalInfo.portfolio}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {/* Professional Summary */}
        {data.personalInfo.summary && (
          <div className="mb-8">
            <h2 className={styles.sectionHeader}>
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed text-base font-light">{data.personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-8">
            <h2 className={styles.sectionHeader}>
              Professional Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-gray-200 pl-6 ml-2">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{exp.position}</h3>
                      <p className="text-gray-700 font-semibold">{exp.company}</p>
                    </div>
                    <div className="text-right text-gray-600 text-sm font-medium">
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 mb-3 leading-relaxed">{exp.description}</p>
                  )}
                  {exp.achievements.length > 0 && exp.achievements[0] && (
                    <ul className="list-disc list-inside text-gray-700 space-y-1.5 ml-4">
                      {exp.achievements.filter(achievement => achievement.trim()).map((achievement, index) => (
                        <li key={index} className="leading-relaxed">{achievement}</li>
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
            <h2 className={styles.sectionHeader}>
              Education
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
            <h2 className={styles.sectionHeader}>
              Skills & Qualifications
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
            <h2 className={styles.sectionHeader}>
              References
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
          <div className="text-center py-16 text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-xl mb-2 font-light">Your professional resume preview will appear here</p>
            <p className="text-base">Start filling out the form to see your resume take shape with professional formatting</p>
          </div>
        )}
      </div>
    </div>
  );
};
