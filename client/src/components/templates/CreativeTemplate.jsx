import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const CreativeTemplate = ({ data, accentColor }) => {
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
            {/* ── HEADER BANNER ── */}
            <header style={{ backgroundColor: accentColor }} className="relative px-10 py-10 overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10 bg-white" />
                <div className="absolute -bottom-10 right-16 w-24 h-24 rounded-full opacity-10 bg-white" />

                <div className="relative flex items-center gap-6">
                    {/* Profile photo / avatar */}
                    {data.personal_info?.image ? (
                        <img
                            src={
                                typeof data.personal_info.image === "string"
                                    ? data.personal_info.image
                                    : URL.createObjectURL(data.personal_info.image)
                            }
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-white/30 shrink-0"
                        />
                    ) : (
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white/70 ring-4 ring-white/20 shrink-0"
                            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                        >
                            {(data.personal_info?.full_name || "?")[0].toUpperCase()}
                        </div>
                    )}

                    <div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
                            {data.personal_info?.full_name || "Your Name"}
                        </h1>
                        {data.personal_info?.profession && (
                            <p className="mt-1 text-lg text-white/70 font-light">
                                {data.personal_info.profession}
                            </p>
                        )}

                        {/* Contact row */}
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/80">
                            {data.personal_info?.email && (
                                <span className="flex items-center gap-1.5">
                                    <Mail className="size-3.5" /> {data.personal_info.email}
                                </span>
                            )}
                            {data.personal_info?.phone && (
                                <span className="flex items-center gap-1.5">
                                    <Phone className="size-3.5" /> {data.personal_info.phone}
                                </span>
                            )}
                            {data.personal_info?.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="size-3.5" /> {data.personal_info.location}
                                </span>
                            )}
                            {data.personal_info?.linkedin && (
                                <span className="flex items-center gap-1.5">
                                    <Linkedin className="size-3.5" />
                                    <span className="text-xs break-all">
                                        {data.personal_info.linkedin
                                            .replace("https://www.", "")
                                            .replace("https://", "")}
                                    </span>
                                </span>
                            )}
                            {data.personal_info?.website && (
                                <span className="flex items-center gap-1.5">
                                    <Globe className="size-3.5" />
                                    <span className="text-xs break-all">
                                        {data.personal_info.website.replace("https://", "")}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── BODY: two columns ── */}
            <div className="grid grid-cols-3 min-h-[240mm]">
                {/* LEFT SIDEBAR */}
                <aside className="col-span-1 px-6 py-8 bg-gray-50 border-r border-gray-200 space-y-8">
                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-widest mb-4 pb-1 border-b-2"
                                style={{ color: accentColor, borderColor: accentColor }}
                            >
                                Skills
                            </h2>
                            <div className="flex flex-col gap-2">
                                {data.skills.map((skill, i) => (
                                    <div key={i} className="flex items-center justify-between gap-2">
                                        <span className="text-xs text-gray-700 truncate">{skill.name}</span>
                                        <div className="flex gap-0.5 shrink-0">
                                            {[1,2,3,4,5].map(d => (
                                                <span key={d} className="w-3 h-3 rounded-sm border inline-block"
                                                    style={{ borderColor: accentColor, backgroundColor: d <= (skill.level ?? 3) ? accentColor : 'transparent' }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {data.languages && data.languages.length > 0 && (
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-widest mb-4 pb-1 border-b-2"
                                style={{ color: accentColor, borderColor: accentColor }}
                            >
                                Languages
                            </h2>
                            <div className="grid grid-cols-4 text-xs font-bold text-gray-400 uppercase mb-1">
                                <span>Lang</span><span className="text-center">R</span><span className="text-center">W</span><span className="text-center">S</span>
                            </div>
                            {data.languages.map((lang, i) => (
                                <div key={i} className="grid grid-cols-4 items-center py-1 border-b border-gray-200 last:border-0">
                                    <span className="text-xs font-medium truncate">{lang.name}</span>
                                    {['read','write','speak'].map(f => (
                                        <div key={f} className="flex justify-center">
                                            <span className="w-3 h-3 rounded-sm border inline-block"
                                                style={{ borderColor: accentColor, backgroundColor: lang[f] ? accentColor : 'transparent', opacity: lang[f] ? 1 : 0.25 }}
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
                            <h2
                                className="text-xs font-bold uppercase tracking-widest mb-4 pb-1 border-b-2"
                                style={{ color: accentColor, borderColor: accentColor }}
                            >
                                Education
                            </h2>
                            <div className="space-y-4">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="text-sm">
                                        <p className="font-semibold text-gray-800 leading-snug">
                                            {edu.degree} {edu.field && `in ${edu.field}`}
                                        </p>
                                        <p className="text-gray-600 text-xs mt-0.5">{edu.institution}</p>
                                        <p className="text-gray-400 text-xs">
                                            {formatDate(edu.graduation_date)}
                                            {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* RIGHT MAIN */}
                <main className="col-span-2 px-8 py-8 space-y-8">
                    {/* Summary */}
                    {data.professional_summary && (
                        <section>
                            <h2
                                className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b-2"
                                style={{ color: accentColor, borderColor: accentColor }}
                            >
                                About Me
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                {data.professional_summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <h2
                                className="text-xs font-bold uppercase tracking-widest mb-4 pb-1 border-b-2"
                                style={{ color: accentColor, borderColor: accentColor }}
                            >
                                Experience
                            </h2>
                            <div className="space-y-5">
                                {data.experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                                                <p
                                                    className="text-xs font-semibold mt-0.5"
                                                    style={{ color: accentColor }}
                                                >
                                                    {exp.company}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-3 bg-gray-100 px-2 py-0.5 rounded">
                                                {formatDate(exp.start_date)} –{" "}
                                                {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                        {exp.description && (
                                            <p className="text-xs text-gray-600 mt-2 leading-relaxed whitespace-pre-line text-justify">
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
                            <h2
                                className="text-xs font-bold uppercase tracking-widest mb-4 pb-1 border-b-2"
                                style={{ color: accentColor, borderColor: accentColor }}
                            >
                                Projects
                            </h2>
                            <div className="space-y-4">
                                {data.project.map((proj, i) => (
                                    <div key={i}>
                                        <h3
                                            className="font-bold text-sm"
                                            style={{ color: accentColor }}
                                        >
                                            {proj.name}
                                        </h3>
                                        {proj.description && (
                                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                                {proj.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Additional Information */}
                    {data.additional_info && data.additional_info.length > 0 && (
                        <section>
                            <h2
                                className="text-xs font-bold uppercase tracking-widest mb-4 pb-1 border-b-2"
                                style={{ color: accentColor, borderColor: accentColor }}
                            >
                                Additional Information
                            </h2>
                            <div className="space-y-2">
                                {data.additional_info.map((item, i) => (
                                    <div key={i} className="text-xs flex flex-col gap-0.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-bold" style={{ color: accentColor }}>{item.category}</span>
                                            <span className="font-semibold text-gray-800">{item.title}</span>
                                            {item.date && <span className="text-gray-400">{item.date}</span>}
                                        </div>
                                        {item.subtitle && <p className="text-gray-500">{item.subtitle}</p>}
                                        {item.description && <p className="text-gray-500">{item.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CreativeTemplate;
