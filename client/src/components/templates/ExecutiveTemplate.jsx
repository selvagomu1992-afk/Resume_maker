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
                                    <li key={i} className="flex items-center justify-between gap-2">
                                        <span className="text-xs text-white/90 truncate">{skill.name}</span>
                                        <div className="flex gap-0.5 shrink-0">
                                            {[1,2,3,4,5].map(d => (
                                                <span key={d} className="w-2.5 h-2.5 rounded-sm border inline-block"
                                                    style={{ borderColor: 'rgba(255,255,255,0.6)', backgroundColor: d <= (skill.level ?? 3) ? 'white' : 'transparent' }}
                                                />
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Languages */}
                    {data.languages && data.languages.length > 0 && (
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3 border-b border-white/20 pb-1">
                                Languages
                            </h2>
                            <div className="grid grid-cols-4 text-xs font-bold text-white/40 uppercase mb-1">
                                <span>Lang</span><span className="text-center">R</span><span className="text-center">W</span><span className="text-center">S</span>
                            </div>
                            {data.languages.map((lang, i) => (
                                <div key={i} className="grid grid-cols-4 items-center py-1 border-b border-white/10 last:border-0">
                                    <span className="text-xs font-medium text-white/90 truncate">{lang.name}</span>
                                    {['read','write','speak'].map(f => (
                                        <div key={f} className="flex justify-center">
                                            <span className="w-2.5 h-2.5 rounded-sm border inline-block"
                                                style={{ borderColor: 'rgba(255,255,255,0.6)', backgroundColor: lang[f] ? 'white' : 'transparent', opacity: lang[f] ? 1 : 0.3 }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
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
                        <p className="text-gray-600 text-sm leading-relaxed mt-2 text-justify">
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
                                        <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-line text-justify">
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

                {/* Additional Information */}
                {data.additional_info && data.additional_info.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-4 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
                            Additional Information
                        </h2>
                        <div className="space-y-2">
                            {data.additional_info.map((item, i) => (
                                <div key={i} className="text-sm flex flex-col gap-0.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-bold uppercase" style={{ color: accentColor }}>{item.category}</span>
                                        <span className="font-semibold text-gray-800">{item.title}</span>
                                        {item.date && <span className="text-xs text-gray-400">{item.date}</span>}
                                    </div>
                                    {item.subtitle && <p className="text-xs text-gray-500">{item.subtitle}</p>}
                                    {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
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
