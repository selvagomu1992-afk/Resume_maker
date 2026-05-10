import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

// Normalise skill → { name, level }
const ns = (s) => (typeof s === "string" ? { name: s, level: 3 } : s);

const InfographicTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    // Derive a very dark version of the accent for the sidebar bg
    const sidebar = "#1e2533";

    return (
        <div className="max-w-4xl mx-auto bg-white text-gray-800 font-sans flex min-h-[297mm]">

            {/* ── DARK LEFT SIDEBAR ── */}
            <aside className="w-[38%] flex flex-col" style={{ backgroundColor: sidebar }}>

                {/* Profile */}
                <div className="flex flex-col items-center pt-10 pb-6 px-6">
                    {data.personal_info?.image ? (
                        <img
                            src={
                                typeof data.personal_info.image === "string"
                                    ? data.personal_info.image
                                    : URL.createObjectURL(data.personal_info.image)
                            }
                            alt="Profile"
                            className="w-28 h-28 rounded-full object-cover mb-4"
                            style={{ boxShadow: `0 0 0 4px ${accentColor}55` }}
                        />
                    ) : (
                        <div
                            className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-black text-white mb-4"
                            style={{ backgroundColor: accentColor + "33", boxShadow: `0 0 0 4px ${accentColor}55` }}
                        >
                            {(data.personal_info?.full_name || "?")[0].toUpperCase()}
                        </div>
                    )}
                    <h1 className="text-xl font-extrabold text-white text-center leading-tight">
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    {data.personal_info?.profession && (
                        <p className="text-xs mt-1 text-center font-semibold uppercase tracking-widest" style={{ color: accentColor }}>
                            {data.personal_info.profession}
                        </p>
                    )}
                </div>

                <div className="flex-1 px-6 pb-8 space-y-7 overflow-hidden">

                    {/* Contact */}
                    <div>
                        <SideLabel label="Contact" color={accentColor} />
                        <ul className="space-y-2 mt-3">
                            {data.personal_info?.email && (
                                <ContactItem icon={<Mail className="size-3.5" />} text={data.personal_info.email} />
                            )}
                            {data.personal_info?.phone && (
                                <ContactItem icon={<Phone className="size-3.5" />} text={data.personal_info.phone} />
                            )}
                            {data.personal_info?.location && (
                                <ContactItem icon={<MapPin className="size-3.5" />} text={data.personal_info.location} />
                            )}
                            {data.personal_info?.linkedin && (
                                <ContactItem
                                    icon={<Linkedin className="size-3.5" />}
                                    text={data.personal_info.linkedin.replace("https://www.", "").replace("https://", "")}
                                />
                            )}
                            {data.personal_info?.website && (
                                <ContactItem
                                    icon={<Globe className="size-3.5" />}
                                    text={data.personal_info.website.replace("https://", "")}
                                />
                            )}
                        </ul>
                    </div>

                    {/* Skills with progress bars */}
                    {data.skills && data.skills.length > 0 && (
                        <div>
                            <SideLabel label="Skills" color={accentColor} />
                            <div className="mt-3 space-y-3">
                                {data.skills.map((raw, i) => {
                                    const skill = ns(raw);
                                    const pct = Math.round((skill.level / 5) * 100);
                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs text-white/80 mb-1">
                                                <span>{skill.name}</span>
                                                <span className="text-white/40">{pct}%</span>
                                            </div>
                                            {/* Track */}
                                            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{ width: `${pct}%`, backgroundColor: accentColor }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <div>
                            <SideLabel label="Education" color={accentColor} />
                            <div className="mt-3 space-y-4">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="text-xs text-white/80">
                                        <p className="font-semibold text-white">
                                            {edu.degree} {edu.field && `in ${edu.field}`}
                                        </p>
                                        <p className="text-white/60 mt-0.5">{edu.institution}</p>
                                        <p className="text-white/40 mt-0.5">
                                            {formatDate(edu.graduation_date)}
                                            {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* ── RIGHT MAIN AREA ── */}
            <main className="flex-1 px-8 py-10 flex flex-col gap-8">

                {/* Accent top strip */}
                <div className="h-1.5 rounded-full -mt-2 mb-2" style={{ backgroundColor: accentColor }} />

                {/* Summary */}
                {data.professional_summary && (
                    <section>
                        <MainLabel label="About Me" color={accentColor} />
                        <p className="text-sm text-gray-600 leading-relaxed mt-3 text-center">
                            {data.professional_summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <MainLabel label="Experience" color={accentColor} />
                        <div className="mt-3 space-y-5">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="pl-4" style={{ borderLeft: `3px solid ${accentColor}` }}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                                            <p className="text-xs font-semibold mt-0.5" style={{ color: accentColor }}>{exp.company}</p>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
                                            {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                        </span>
                                    </div>
                                    {exp.description && (
                                        <p className="text-xs text-gray-600 mt-2 leading-relaxed whitespace-pre-line text-center">
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
                        <MainLabel label="Projects" color={accentColor} />
                        <div className="mt-3 space-y-4">
                            {data.project.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-sm text-gray-900">{proj.name}</h3>
                                    {proj.description && (
                                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{proj.description}</p>
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

/* ── Helpers ── */
const SideLabel = ({ label, color }) => (
    <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
            {label}
        </span>
        <div className="h-px flex-1 bg-white/10" />
    </div>
);

const ContactItem = ({ icon, text }) => (
    <li className="flex items-start gap-2 text-xs text-white/70">
        <span className="mt-0.5 text-white/40 shrink-0">{icon}</span>
        <span className="break-all">{text}</span>
    </li>
);

const MainLabel = ({ label, color }) => (
    <div className="flex items-center gap-3">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color }}>
            {label}
        </h2>
        <div className="flex-1 h-px" style={{ backgroundColor: color + "40" }} />
    </div>
);

export default InfographicTemplate;
