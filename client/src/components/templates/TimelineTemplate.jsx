import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const TimelineTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    return (
        <div className="max-w-4xl mx-auto bg-white text-gray-800 font-sans flex min-h-[297mm]">
            {/* ── MAIN CONTENT (left / wider) ── */}
            <div className="flex-1 px-10 py-10 flex flex-col gap-8">
                {/* Name & title */}
                <header className="border-b-4 pb-5" style={{ borderColor: accentColor }}>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-none">
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    {data.personal_info?.profession && (
                        <p className="mt-1 text-base font-medium" style={{ color: accentColor }}>
                            {data.personal_info.profession}
                        </p>
                    )}

                    {/* Contact row */}
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                        {data.personal_info?.email && (
                            <span className="flex items-center gap-1">
                                <Mail className="size-3" /> {data.personal_info.email}
                            </span>
                        )}
                        {data.personal_info?.phone && (
                            <span className="flex items-center gap-1">
                                <Phone className="size-3" /> {data.personal_info.phone}
                            </span>
                        )}
                        {data.personal_info?.location && (
                            <span className="flex items-center gap-1">
                                <MapPin className="size-3" /> {data.personal_info.location}
                            </span>
                        )}
                        {data.personal_info?.linkedin && (
                            <span className="flex items-center gap-1">
                                <Linkedin className="size-3" />
                                <span className="break-all">
                                    {data.personal_info.linkedin
                                        .replace("https://www.", "")
                                        .replace("https://", "")}
                                </span>
                            </span>
                        )}
                        {data.personal_info?.website && (
                            <span className="flex items-center gap-1">
                                <Globe className="size-3" />
                                <span className="break-all">
                                    {data.personal_info.website.replace("https://", "")}
                                </span>
                            </span>
                        )}
                    </div>
                </header>

                {/* Summary */}
                {data.professional_summary && (
                    <section>
                        <SectionHeading label="Profile" color={accentColor} />
                        <p className="text-sm text-gray-600 leading-relaxed mt-3 text-justify">
                            {data.professional_summary}
                        </p>
                    </section>
                )}

                {/* Experience — vertical timeline */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <SectionHeading label="Experience" color={accentColor} />
                        <div className="relative mt-4 pl-6 border-l-2" style={{ borderColor: accentColor + "55" }}>
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative mb-7 last:mb-0">
                                    {/* Timeline dot */}
                                    <span
                                        className="absolute -left-[1.35rem] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ring-2"
                                        style={{ backgroundColor: accentColor, ringColor: accentColor }}
                                    />
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm leading-tight">
                                                {exp.position}
                                            </h3>
                                            <p className="text-xs font-semibold mt-0.5" style={{ color: accentColor }}>
                                                {exp.company}
                                            </p>
                                        </div>
                                        <span className="text-xs text-white px-2 py-0.5 rounded-full ml-4 shrink-0"
                                            style={{ backgroundColor: accentColor }}>
                                            {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
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
                        <SectionHeading label="Projects" color={accentColor} />
                        <div className="mt-3 space-y-4">
                            {data.project.map((proj, i) => (
                                <div key={i} className="pl-4 border-l-2" style={{ borderColor: accentColor }}>
                                    <h3 className="font-bold text-sm text-gray-900">{proj.name}</h3>
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
                        <SectionHeading label="Additional Information" color={accentColor} />
                        <div className="mt-3 space-y-2">
                            {data.additional_info.map((item, i) => (
                                <div key={i} className="pl-4 border-l-2 text-xs flex flex-col gap-0.5" style={{ borderColor: accentColor }}>
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
            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <aside
                className="w-52 shrink-0 px-6 py-10 flex flex-col gap-8"
                style={{ backgroundColor: accentColor + "14" }}
            >
                {/* Profile photo */}
                {data.personal_info?.image ? (
                    <img
                        src={
                            typeof data.personal_info.image === "string"
                                ? data.personal_info.image
                                : URL.createObjectURL(data.personal_info.image)
                        }
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover mx-auto ring-4"
                        style={{ ringColor: accentColor }}
                    />
                ) : (
                    <div
                        className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-black text-white"
                        style={{ backgroundColor: accentColor }}
                    >
                        {(data.personal_info?.full_name || "?")[0].toUpperCase()}
                    </div>
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <div>
                        <p
                            className="text-[10px] font-bold uppercase tracking-widest mb-3 pb-1 border-b"
                            style={{ color: accentColor, borderColor: accentColor + "55" }}
                        >
                            Skills
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {data.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                    style={{ backgroundColor: accentColor + "22", color: accentColor }}
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {data.languages && data.languages.length > 0 && (
                    <div>
                        <p
                            className="text-[10px] font-bold uppercase tracking-widest mb-3 pb-1 border-b"
                            style={{ color: accentColor, borderColor: accentColor + "55" }}
                        >
                            Languages
                        </p>
                        <div className="space-y-1.5">
                            {data.languages.map((lang, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-700">{lang.name}</span>
                                    <div className="flex gap-0.5">
                                        {lang.read && <span className="text-[10px] px-1 rounded text-white font-bold" style={{ backgroundColor: accentColor }}>R</span>}
                                        {lang.write && <span className="text-[10px] px-1 rounded text-white font-bold" style={{ backgroundColor: accentColor }}>W</span>}
                                        {lang.speak && <span className="text-[10px] px-1 rounded text-white font-bold" style={{ backgroundColor: accentColor }}>S</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <div>
                        <p
                            className="text-[10px] font-bold uppercase tracking-widest mb-3 pb-1 border-b"
                            style={{ color: accentColor, borderColor: accentColor + "55" }}
                        >
                            Education
                        </p>
                        <div className="space-y-4">
                            {data.education.map((edu, i) => (
                                <div key={i} className="text-xs">
                                    <p className="font-bold text-gray-800 leading-snug">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </p>
                                    <p className="text-gray-500 mt-0.5">{edu.institution}</p>
                                    <p className="text-gray-400 mt-0.5">
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
    );
};

/* ── Shared section heading ── */
const SectionHeading = ({ label, color }) => (
    <h2
        className="text-[11px] font-extrabold uppercase tracking-[0.18em]"
        style={{ color }}
    >
        {label}
    </h2>
);

export default TimelineTemplate;
