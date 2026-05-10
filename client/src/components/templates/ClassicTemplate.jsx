import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ClassicTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 leading-relaxed">
            {/* Header */}
            <header className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: accentColor }}>
                <h1 className="text-3xl font-bold mb-1" style={{ color: accentColor }}>
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                {data.personal_info?.profession && (
                    <p className="text-base text-gray-500 mb-2">{data.personal_info.profession}</p>
                )}

                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                    {data.personal_info?.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="size-4" />
                            <span>{data.personal_info.email}</span>
                        </div>
                    )}
                    {data.personal_info?.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="size-4" />
                            <span>{data.personal_info.phone}</span>
                        </div>
                    )}
                    {data.personal_info?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            <span>{data.personal_info.location}</span>
                        </div>
                    )}
                    {data.personal_info?.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin className="size-4" />
                            <span className="break-all">{data.personal_info.linkedin}</span>
                        </div>
                    )}
                    {data.personal_info?.website && (
                        <div className="flex items-center gap-1">
                            <Globe className="size-4" />
                            <span className="break-all">{data.personal_info.website}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3" style={{ color: accentColor }}>
                        PROFESSIONAL SUMMARY
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-justify">{data.professional_summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        PROFESSIONAL EXPERIENCE
                    </h2>

                    <div className="space-y-4">
                        {data.experience.map((exp, index) => (
                            <div key={index} className="border-l-3 pl-4" style={{ borderColor: accentColor }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                        <p className="text-gray-700 font-medium">{exp.company}</p>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        <p>{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                                    </div>
                                </div>
                                {exp.description && (
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.project && data.project.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        PROJECTS
                    </h2>

                    <ul className="space-y-3 ">
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex justify-between items-start border-l-3 border-gray-300 pl-6">
                                <div>
                                    <li className="font-semibold text-gray-800 ">{proj.name}</li>
                                    <p className="text-gray-600">{proj.description}</p>
                                </div>
                            </div>
                        ))}
                    </ul>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        EDUCATION
                    </h2>

                    <div className="space-y-3">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-700">{edu.institution}</p>
                                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>{formatDate(edu.graduation_date)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills + Languages side by side */}
            {(data.skills?.length > 0 || data.languages?.length > 0) && (
                <section className="mb-4">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Skills — 2 column compact grid */}
                        {data.skills && data.skills.length > 0 && (
                            <div>
                                <h2 className="text-base font-semibold mb-2" style={{ color: accentColor }}>CORE SKILLS</h2>
                                <div className="grid grid-cols-1 gap-1">
                                    {data.skills.map((skill, i) => {
                                        const s = typeof skill === 'string' ? { name: skill, level: 3 } : skill
                                        return (
                                            <div key={i} className="flex items-center justify-between gap-2">
                                                <span className="text-xs text-gray-700 truncate">{s.name}</span>
                                                <div className="flex gap-0.5 shrink-0">
                                                    {[1,2,3,4,5].map(d => (
                                                        <span key={d} className="w-3 h-3 rounded-sm border"
                                                            style={{ borderColor: accentColor, backgroundColor: d <= (s.level ?? 3) ? accentColor : 'transparent' }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Languages — compact */}
                        {data.languages && data.languages.length > 0 && (
                            <div>
                                <h2 className="text-base font-semibold mb-2" style={{ color: accentColor }}>LANGUAGES</h2>
                                <div className="grid grid-cols-4 text-xs font-semibold text-gray-400 uppercase mb-1">
                                    <span>Lang</span>
                                    <span className="text-center">R</span>
                                    <span className="text-center">W</span>
                                    <span className="text-center">S</span>
                                </div>
                                {data.languages.map((lang, i) => (
                                    <div key={i} className="grid grid-cols-4 items-center py-0.5 border-b border-gray-100 last:border-0">
                                        <span className="text-xs text-gray-800 font-medium truncate">{lang.name}</span>
                                        {['read','write','speak'].map(f => (
                                            <div key={f} className="flex justify-center">
                                                <span className={`w-3 h-3 rounded-sm border ${lang[f] ? '' : 'opacity-20'}`}
                                                    style={{ borderColor: accentColor, backgroundColor: lang[f] ? accentColor : 'transparent' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Achievements */}
            {data.achievements && data.achievements.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-base font-semibold mb-2" style={{ color: accentColor }}>ACHIEVEMENTS</h2>
                    <div className="space-y-2">
                        {data.achievements.map((a, i) => (
                            <div key={i} className="flex items-start gap-3 p-2 rounded-lg border-l-4" style={{ borderColor: accentColor, backgroundColor: accentColor + '08' }}>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                        <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: accentColor }}>{a.category}</span>
                                        <span className="text-sm font-semibold text-gray-800">{a.title}</span>
                                    </div>
                                    {(a.from_value !== '' && a.from_value != null && a.to_value !== '' && a.to_value != null) && (
                                        <p className="text-sm font-bold" style={{ color: accentColor }}>{a.from_value}{a.unit} → {a.to_value}{a.unit}</p>
                                    )}
                                    {a.description && <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

          

            {/* Additional Information */}
            {data.additional_info && data.additional_info.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        ADDITIONAL INFORMATION
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {data.additional_info.map((item, i) => (
                            <div key={i} className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-semibold" style={{ color: accentColor }}>{item.category}</span>
                                    <span className="text-sm font-medium text-gray-800">{item.title}</span>
                                    {item.date && <span className="text-xs text-gray-400">{item.date}</span>}
                                </div>
                                {item.subtitle && <p className="text-xs text-gray-500">{item.subtitle}</p>}
                                {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default ClassicTemplate;