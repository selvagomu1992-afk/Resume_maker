import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

// Normalise skill → { name, level }
const ns = (s) => (typeof s === "string" ? { name: s, level: 3 } : s);

const ElegantTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    return (
        <div className="max-w-4xl mx-auto bg-white text-gray-800 font-sans">

            {/* ── TOP HEADER ── */}
            <header className="relative text-center px-10 pt-10 pb-8">
                {/* Thin coloured top bar */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accentColor }} />

                {/* Optional photo */}
                {data.personal_info?.image && (
                    <img
                        src={
                            typeof data.personal_info.image === "string"
                                ? data.personal_info.image
                                : URL.createObjectURL(data.personal_info.image)
                        }
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-4"
                        style={{ ringColor: accentColor + "55" }}
                    />
                )}

                <h1 className="text-4xl font-thin tracking-[0.12em] text-gray-900 uppercase">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                {data.personal_info?.profession && (
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: accentColor }}>
                        {data.personal_info.profession}
                    </p>
                )}

                {/* Divider */}
                <div className="flex items-center gap-4 mt-5 mb-0">
                    <div className="flex-1 h-px bg-gray-200" />
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Contact row */}
                <div className="mt-4 flex flex-wrap justify-center gap-5 text-xs text-gray-500">
                    {data.personal_info?.email && (
                        <span className="flex items-center gap-1.5">
                            <Mail className="size-3.5" style={{ color: accentColor }} /> {data.personal_info.email}
                        </span>
                    )}
                    {data.personal_info?.phone && (
                        <span className="flex items-center gap-1.5">
                            <Phone className="size-3.5" style={{ color: accentColor }} /> {data.personal_info.phone}
                        </span>
                    )}
                    {data.personal_info?.location && (
                        <span className="flex items-center gap-1.5">
                            <MapPin className="size-3.5" style={{ color: accentColor }} /> {data.personal_info.location}
                        </span>
                    )}
                    {data.personal_info?.linkedin && (
                        <span className="flex items-center gap-1.5">
                            <Linkedin className="size-3.5" style={{ color: accentColor }} />
                            <span className="break-all">
                                {data.personal_info.linkedin.replace("https://www.", "").replace("https://", "")}
                            </span>
                        </span>
                    )}
                    {data.personal_info?.website && (
                        <span className="flex items-center gap-1.5">
                            <Globe className="size-3.5" style={{ color: accentColor }} />
                            <span className="break-all">{data.personal_info.website.replace("https://", "")}</span>
                        </span>
                    )}
                </div>
            </header>

            {/* ── BODY: two columns ── */}
            <div className="grid grid-cols-5 gap-0 px-0">

                {/* LEFT — summary + experience + projects */}
                <main className="col-span-3 px-10 py-8 space-y-8 border-r border-gray-100">

                    {data.professional_summary && (
                        <section>
                            <ElegantLabel label="Profile" color={accentColor} />
                            <p className="text-sm text-gray-600 leading-relaxed mt-3 italic">
                                {data.professional_summary}
                            </p>
                        </section>
                    )}

                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <ElegantLabel label="Experience" color={accentColor} />
                            <div className="mt-4 space-y-6">
                                {data.experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-semibold text-sm text-gray-900">{exp.position}</h3>
                                            <span className="text-[11px] text-gray-400 ml-2 whitespace-nowrap">
                                                {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium mt-0.5" style={{ color: accentColor }}>{exp.company}</p>
                                        {exp.description && (
                                            <p className="text-xs text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.project && data.project.length > 0 && (
                        <section>
                            <ElegantLabel label="Projects" color={accentColor} />
                            <div className="mt-4 space-y-4">
                                {data.project.map((proj, i) => (
                                    <div key={i}>
                                        <h3 className="font-semibold text-sm text-gray-900">{proj.name}</h3>
                                        {proj.description && (
                                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{proj.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* RIGHT — skills + education */}
                <aside className="col-span-2 px-8 py-8 space-y-8 bg-gray-50">

                    {/* Skills — dot-ring rating */}
                    {data.skills && data.skills.length > 0 && (
                        <div>
                            <ElegantLabel label="Skills" color={accentColor} />
                            <div className="mt-4 space-y-3">
                                {data.skills.map((raw, i) => {
                                    const skill = ns(raw);
                                    return (
                                        <div key={i} className="flex items-center justify-between gap-2">
                                            <span className="text-xs text-gray-700 flex-1">{skill.name}</span>
                                            {/* 5 squares */}
                                            <div className="flex gap-1 shrink-0">
                                                {[1, 2, 3, 4, 5].map(d => (
                                                    <span
                                                        key={d}
                                                        className="w-3 h-3 rounded-sm border-2 transition-colors"
                                                        style={{
                                                            borderColor: accentColor,
                                                            backgroundColor: d <= skill.level ? accentColor : "transparent",
                                                        }}
                                                    />
                                                ))}
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
                            <ElegantLabel label="Education" color={accentColor} />
                            <div className="mt-4 space-y-5">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h3 className="font-semibold text-sm text-gray-900 leading-snug">
                                            {edu.degree} {edu.field && `in ${edu.field}`}
                                        </h3>
                                        <p className="text-xs text-gray-600 mt-0.5">{edu.institution}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {formatDate(edu.graduation_date)}
                                            {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {/* Bottom bar */}
            <div className="h-1" style={{ backgroundColor: accentColor }} />
        </div>
    );
};

const ElegantLabel = ({ label, color }) => (
    <div>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color }}>
            {label}
        </h2>
        <div className="mt-1 h-px bg-gray-200" />
    </div>
);

export default ElegantTemplate;
