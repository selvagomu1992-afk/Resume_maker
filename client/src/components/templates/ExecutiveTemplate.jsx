import { Mail, Phone, MapPin, Linkedin, Globe, BriefcaseBusiness } from "lucide-react";

const ExecutiveTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    const sidebarBg = accentColor;

    return (
        <div className="max-w-4xl mx-auto bg-white text-gray-800 flex min-h-[297mm]">
            {/* ── LEFT SIDEBAR ── */}
            <aside className="w-[38%] min-h-full flex flex-col" style={{ backgroundColor: sidebarBg }}>
                {/* Profile photo */}
                <div className="flex flex-col items-center pt-10 pb-6 px-6">
                    {data.personal_info?.image ? (
                        <img
                            src={
                                typeof data.personal_info.image === "string"
                                    ? data.personal_info.image
                                    : URL.createObjectURL(data.personal_info.image)
                            }
                            alt="Profile"
                            className="w-28 h-28 rounded-full object-cover mb-4 ring-4 ring-white/30"
                        />
                    ) : (
                        <div
                            className="w-28 h-28 rounded-full flex items-center justify-center mb-4 ring-4 ring-white/30 text-4xl font-bold text-white/60"
                            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                        >
                            {(data.personal_info?.full_name || "?")[0].toUpperCase()}
                        </div>
                    )}
                    <h1 className="text-xl font-bold text-white text-center leading-tight">
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    {data.personal_info?.profession && (
                        <p className="text-sm text-white/70 mt-1 text-center">
                            {data.personal_info.profession}
                        </p>
                    )}
                </div>

                <div className="flex-1 px-6 pb-8 space-y-6">
                    {/* Contact */}
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3 border-b border-white/20 pb-1">
                            Contact
                        </h2>
                        <ul className="space-y-2 text-sm text-white/90">
                            {data.personal_info?.email && (
                                <li className="flex items-start gap-2">
                                    <Mail className="size-4 mt-0.5 shrink-0 text-white/60" />
                                    <span className="break-all">{data.personal_info.email}</span>
                                </li>
                            )}
                            {data.personal_info?.phone && (
                                <li className="flex items-center gap-2">
                                    <Phone className="size-4 shrink-0 text-white/60" />
                                    <span>{data.personal_info.phone}</span>
                                </li>
                            )}
                            {data.personal_info?.location && (
                                <li className="flex items-center gap-2">
                                    <MapPin className="size-4 shrink-0 text-white/60" />
                                    <span>{data.personal_info.location}</span>
                                </li>
                            )}
                            {data.personal_info?.linkedin && (
                                <li className="flex items-start gap-2">
                                    <Linkedin className="size-4 mt-0.5 shrink-0 text-white/60" />
                                    <span className="break-all text-xs">
                                        {data.personal_info.linkedin.replace("https://www.", "").replace("https://", "")}
                                    </span>
                                </li>
                            )}
                            {data.personal_info?.website && (
                                <li className="flex items-start gap-2">
                                    <Globe className="size-4 mt-0.5 shrink-0 text-white/60" />
                                    <span className="break-all text-xs">
                                        {data.personal_info.website.replace("https://", "")}
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3 border-b border-white/20 pb-1">
                                Skills
                            </h2>
                            <ul className="space-y-2">
                                {data.skills.map((skill, i) => (
                                    <li key={i} className="text-sm text-white/90 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3 border-b border-white/20 pb-1">
                                Education
                            </h2>
                            <div className="space-y-4">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="text-sm text-white/90">
                                        <p className="font-semibold leading-snug">
                                            {edu.degree} {edu.field && `in ${edu.field}`}
                                        </p>
                                        <p className="text-white/70 text-xs">{edu.institution}</p>
                                        <p className="text-white/50 text-xs">{formatDate(edu.graduation_date)}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* ── RIGHT MAIN AREA ── */}
            <main className="flex-1 p-8 flex flex-col gap-7">
                {/* Summary */}
                {data.professional_summary && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
                            Professional Summary
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed mt-2">
                            {data.professional_summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-4 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
                            Experience
                        </h2>
                        <div className="space-y-5">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative pl-4" style={{ borderLeft: `2px solid ${accentColor}33` }}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                            <p className="text-sm font-medium" style={{ color: accentColor }}>{exp.company}</p>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2 mt-0.5">
                                            {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                        </span>
                                    </div>
                                    {exp.description && (
                                        <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {data.project && data.project.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-4 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {data.project.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="font-semibold text-gray-900 text-sm">{proj.name}</h3>
                                    {proj.description && (
                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{proj.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default ExecutiveTemplate;
