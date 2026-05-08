
const MinimalTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light">
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-4xl font-thin mb-1 tracking-wide">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                {data.personal_info?.profession && (
                    <p className="text-base text-gray-500 mb-3">{data.personal_info.profession}</p>
                )}

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    {data.personal_info?.email && <span>{data.personal_info.email}</span>}
                    {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                    {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                    {data.personal_info?.linkedin && (
                        <span className="break-all">{data.personal_info.linkedin}</span>
                    )}
                    {data.personal_info?.website && (
                        <span className="break-all">{data.personal_info.website}</span>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-10">
                    <p className=" text-gray-700">
                        {data.professional_summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Experience
                    </h2>

                    <div className="space-y-6">
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-medium">{exp.position}</h3>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">{exp.company}</p>
                                {exp.description && (
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
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
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Projects
                    </h2>

                    <div className="space-y-4">
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex flex-col gap-2 justify-between items-baseline">
                                <h3 className="text-lg font-medium ">{proj.name}</h3>
                                <p className="text-gray-600">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Education
                    </h2>

                    <div className="space-y-4">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-medium">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-600">{edu.institution}</p>
                                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {formatDate(edu.graduation_date)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Skills
                    </h2>
                    <div className="flex flex-col gap-2.5">
                        {data.skills.map((skill, index) => {
                            const s = typeof skill === 'string' ? { name: skill, level: 3 } : skill
                            return (
                                <div key={index} className="flex items-center justify-between gap-3">
                                    <span className="text-gray-700 text-sm w-32 shrink-0">{s.name}</span>
                                    <div className="flex gap-1 shrink-0">
                                        {[1,2,3,4,5].map(d => (
                                            <span key={d} className="w-4 h-4 rounded-sm border-2"
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

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-4 font-medium" style={{ color: accentColor }}>
                        Languages
                    </h2>
                    <div className="grid grid-cols-4 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        <span>Language</span>
                        <span className="text-center">Read</span>
                        <span className="text-center">Write</span>
                        <span className="text-center">Speak</span>
                    </div>
                    {data.languages.map((lang, i) => (
                        <div key={i} className="grid grid-cols-4 items-center py-1.5 border-b border-gray-100 last:border-0">
                            <span className="text-sm text-gray-800">{lang.name}</span>
                            {['read', 'write', 'speak'].map(f => (
                                <div key={f} className="flex justify-center">
                                    <span className={`w-4 h-4 rounded-sm border-2 ${lang[f] ? '' : 'opacity-20'}`}
                                        style={{ borderColor: accentColor, backgroundColor: lang[f] ? accentColor : 'transparent' }}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}

export default MinimalTemplate;