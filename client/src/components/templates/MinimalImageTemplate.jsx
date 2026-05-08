import { Mail, Phone, MapPin } from "lucide-react";

const MinimalImageTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    return (
        <div className="max-w-5xl mx-auto bg-white text-zinc-800">
            <div className="grid grid-cols-3">

                <div className="col-span-1  py-10">
                    {/* Image */}
                    {data.personal_info?.image && typeof data.personal_info.image === 'string' ? (
                        <div className="mb-6">
                            <img src={data.personal_info.image} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto" style={{ background: accentColor+'70' }} />
                        </div>
                    ) : (
                        data.personal_info?.image && typeof data.personal_info.image === 'object' ? (
                            <div className="mb-6">
                                <img src={URL.createObjectURL(data.personal_info.image)} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto" />
                            </div>
                        ) : null
                    )}
                </div>

                {/* Name + Title */}
                <div className="col-span-2 flex flex-col justify-center py-10 px-8">
                    <h1 className="text-4xl font-bold text-zinc-700 tracking-widest">
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    <p className="uppercase text-zinc-600 font-medium text-sm tracking-widest">
                        {data?.personal_info?.profession || "Profession"}
                    </p>
                </div>

                {/* Left Sidebar */}
                <aside className="col-span-1 border-r border-zinc-400 p-6 pt-0">


                    {/* Contact */}
                    <section className="mb-8">
                        <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                            CONTACT
                        </h2>
                        <div className="space-y-2 text-sm">
                            {data.personal_info?.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.phone}</span>
                                </div>
                            )}
                            {data.personal_info?.email && (
                                <div className="flex items-center gap-2">
                                    <Mail size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.email}</span>
                                </div>
                            )}
                            {data.personal_info?.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.location}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                                EDUCATION
                            </h2>
                            <div className="space-y-4 text-sm">
                                {data.education.map((edu, index) => (
                                    <div key={index}>
                                        <p className="font-semibold uppercase">{edu.degree}</p>
                                        <p className="text-zinc-600">{edu.institution}</p>
                                        <p className="text-xs text-zinc-500">
                                            {formatDate(edu.graduation_date)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills compact */}
                    {data.skills && data.skills.length > 0 && (
                        <section className="mb-4">
                            <h2 className="text-xs font-semibold tracking-widest text-zinc-600 mb-2">SKILLS</h2>
                            <div className="space-y-1">
                                {data.skills.map((skill, index) => {
                                    const s = typeof skill === 'string' ? { name: skill, level: 3 } : skill
                                    return (
                                        <div key={index} className="flex items-center justify-between gap-1">
                                            <span className="text-xs text-zinc-700 truncate">{s.name}</span>
                                            <div className="flex gap-0.5 shrink-0">
                                                {[1,2,3,4,5].map(d => (
                                                    <span key={d} className="w-2.5 h-2.5 rounded-sm border"
                                                        style={{ borderColor: accentColor, backgroundColor: d <= (s.level ?? 3) ? accentColor : 'transparent' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {/* Languages compact */}
                    {data.languages && data.languages.length > 0 && (
                        <section className="mb-4">
                            <h2 className="text-xs font-semibold tracking-widest text-zinc-600 mb-2">LANGUAGES</h2>
                            <div className="space-y-1">
                                {data.languages.map((lang, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-zinc-700">{lang.name}</span>
                                        <div className="flex gap-0.5">
                                            {lang.read && <span className="text-xs px-1 rounded text-white" style={{ backgroundColor: accentColor }}>R</span>}
                                            {lang.write && <span className="text-xs px-1 rounded text-white" style={{ backgroundColor: accentColor }}>W</span>}
                                            {lang.speak && <span className="text-xs px-1 rounded text-white" style={{ backgroundColor: accentColor }}>S</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Achievements */}
                    {data.achievements && data.achievements.length > 0 && (
                        <section>
                            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                                ACHIEVEMENTS
                            </h2>
                            <div className="space-y-3">
                                {data.achievements.map((a, i) => (
                                    <div key={i} className="border-l-2 pl-3" style={{ borderColor: accentColor }}>
                                        <p className="text-xs font-semibold" style={{ color: accentColor }}>{a.category}</p>
                                        <p className="text-sm font-medium text-zinc-800">{a.title}</p>
                                        {(a.from_value !== '' && a.from_value != null && a.to_value !== '' && a.to_value != null) && (
                                            <p className="text-xs font-bold" style={{ color: accentColor }}>{a.from_value}{a.unit} → {a.to_value}{a.unit}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </aside>

                {/* Right Content */}
                <main className="col-span-2 p-8 pt-0">

                    {/* Summary */}
                    {data.professional_summary && (
                        <section className="mb-8">
                            <h2 className="text-sm font-semibold tracking-widest mb-3" style={{ color: accentColor }} >
                                SUMMARY
                            </h2>
                            <p className="text-zinc-700 leading-relaxed">
                                {data.professional_summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <h2 className="text-sm font-semibold tracking-widest mb-4" style={{ color: accentColor }} >
                                EXPERIENCE
                            </h2>
                            <div className="space-y-6 mb-8">
                                {data.experience.map((exp, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-zinc-900">
                                                {exp.position}
                                            </h3>
                                            <span className="text-xs text-zinc-500">
                                                {formatDate(exp.start_date)} -{" "}
                                                {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                        <p className="text-sm mb-2" style={{ color: accentColor }} >
                                            {exp.company}
                                        </p>
                                        {exp.description && (
                                            <ul className="list-disc list-inside text-sm text-zinc-700 leading-relaxed space-y-1">
                                                {exp.description.split("\n").map((line, i) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {data.project && data.project.length > 0 && (
                        <section>
                            <h2 className="text-sm uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
                                PROJECTS
                            </h2>
                            <div className="space-y-4">
                                {data.project.map((project, index) => (
                                    <div key={index}>
                                        <h3 className="text-md font-medium text-zinc-800 mt-3">{project.name}</h3>
                                        <p className="text-sm mb-1" style={{ color: accentColor }} >
                                            {project.type}
                                        </p>
                                        {project.description && (
                                            <ul className="list-disc list-inside text-sm text-zinc-700  space-y-1">
                                                {project.description.split("\n").map((line, i) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}


export default MinimalImageTemplate;