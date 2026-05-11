import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const GradientTemplate = ({ data, accentColor }) => {
    const formatDate = (d) => {
        if (!d) return '';
        const [y, m] = d.split('-');
        return new Date(y, m - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    const pi = data.personal_info || {};

    // Derive a darker shade for gradient end
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    };
    const darken = (hex, amt = 40) => {
        const { r, g, b } = hexToRgb(hex);
        const d = (v) => Math.max(0, v - amt).toString(16).padStart(2, '0');
        return `#${d(r)}${d(g)}${d(b)}`;
    };

    const accentDark = darken(accentColor, 50);
    const accentLight = accentColor + '18';

    const SectionTitle = ({ children }) => (
        <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-5 rounded-full" style={{ backgroundColor: accentColor }} />
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                {children}
            </h2>
            <div className="flex-1 h-px" style={{ backgroundColor: accentColor + '30' }} />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto bg-white text-gray-800">

            {/* ── GRADIENT HEADER ── */}
            <header
                className="relative px-10 py-10 overflow-hidden text-white"
                style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentDark} 100%)` }}
            >
                {/* Decorative blobs */}
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 bg-white" />
                <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full opacity-10 bg-white" />
                <div className="absolute top-4 right-1/4 w-16 h-16 rounded-full opacity-10 bg-white" />

                <div className="relative flex flex-col items-center text-center gap-3">
                    {/* Profile image */}
                    {pi.image ? (
                        <img
                            src={typeof pi.image === 'string' ? pi.image : URL.createObjectURL(pi.image)}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black border-4 border-white/30 shadow-lg"
                            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                            {(pi.full_name || 'Y')[0].toUpperCase()}
                        </div>
                    )}

                    <div>
                        <h1 className="text-3xl font-black tracking-tight">{pi.full_name || 'Your Name'}</h1>
                        {pi.profession && (
                            <p className="text-base font-light opacity-85 mt-1 tracking-wide">{pi.profession}</p>
                        )}
                    </div>

                    {/* Contact pills */}
                    <div className="flex flex-wrap justify-center gap-2 mt-1">
                        {pi.email && (
                            <span className="flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur px-3 py-1 rounded-full">
                                <Mail className="size-3" /> {pi.email}
                            </span>
                        )}
                        {pi.phone && (
                            <span className="flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur px-3 py-1 rounded-full">
                                <Phone className="size-3" /> {pi.phone}
                            </span>
                        )}
                        {pi.location && (
                            <span className="flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur px-3 py-1 rounded-full">
                                <MapPin className="size-3" /> {pi.location}
                            </span>
                        )}
                        {pi.linkedin && (
                            <span className="flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur px-3 py-1 rounded-full">
                                <Linkedin className="size-3" />
                                <span className="truncate max-w-[120px]">
                                    {pi.linkedin.replace('https://www.', '').replace('https://', '')}
                                </span>
                            </span>
                        )}
                        {pi.website && (
                            <span className="flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur px-3 py-1 rounded-full">
                                <Globe className="size-3" />
                                <span className="truncate max-w-[120px]">
                                    {pi.website.replace('https://', '')}
                                </span>
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* ── BODY ── */}
            <div className="p-8 space-y-7">

                {/* Summary */}
                {data.professional_summary && (
                    <section>
                        <SectionTitle>Professional Summary</SectionTitle>
                        <div className="rounded-xl p-4" style={{ backgroundColor: accentLight }}>
                            <p className="text-sm text-gray-700 leading-relaxed text-justify">
                                {data.professional_summary}
                            </p>
                        </div>
                    </section>
                )}

                {/* Two-column: Experience + right sidebar */}
                <div className="grid grid-cols-3 gap-6">

                    {/* Left — Experience + Projects + Achievements */}
                    <div className="col-span-2 space-y-7">

                        {data.experience && data.experience.length > 0 && (
                            <section>
                                <SectionTitle>Experience</SectionTitle>
                                <div className="space-y-4">
                                    {data.experience.map((exp, i) => (
                                        <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: accentColor + '50' }}>
                                            {/* Dot */}
                                            <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                                                    <p className="text-xs font-semibold mt-0.5" style={{ color: accentColor }}>{exp.company}</p>
                                                </div>
                                                <span className="text-xs text-white px-2 py-0.5 rounded-full shrink-0 ml-2"
                                                    style={{ backgroundColor: accentColor }}>
                                                    {formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}
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

                        {data.project && data.project.length > 0 && (
                            <section>
                                <SectionTitle>Projects</SectionTitle>
                                <div className="grid grid-cols-2 gap-3">
                                    {data.project.map((proj, i) => (
                                        <div key={i} className="rounded-xl p-3 border border-gray-100 shadow-sm"
                                            style={{ borderLeftColor: accentColor, borderLeftWidth: 3 }}>
                                            <h3 className="font-bold text-sm text-gray-900">{proj.name}</h3>
                                            {proj.type && (
                                                <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium inline-block mt-1"
                                                    style={{ backgroundColor: accentColor + 'cc' }}>
                                                    {proj.type}
                                                </span>
                                            )}
                                            {proj.description && (
                                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{proj.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.achievements && data.achievements.length > 0 && (
                            <section>
                                <SectionTitle>Achievements</SectionTitle>
                                <div className="space-y-2">
                                    {data.achievements.map((a, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                                            style={{ backgroundColor: accentLight }}>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                                                        style={{ backgroundColor: accentColor }}>{a.category}</span>
                                                    <span className="text-sm font-semibold text-gray-800">{a.title}</span>
                                                </div>
                                                {a.from_value != null && a.from_value !== '' && a.to_value != null && a.to_value !== '' && (
                                                    <p className="text-sm font-bold mt-0.5" style={{ color: accentColor }}>
                                                        {a.from_value}{a.unit} → {a.to_value}{a.unit}
                                                    </p>
                                                )}
                                                {a.description && <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right sidebar — Education + Skills + Languages + Additional */}
                    <div className="col-span-1 space-y-6">

                        {data.education && data.education.length > 0 && (
                            <section>
                                <SectionTitle>Education</SectionTitle>
                                <div className="space-y-3">
                                    {data.education.map((edu, i) => (
                                        <div key={i} className="rounded-xl p-3" style={{ backgroundColor: accentLight }}>
                                            <h3 className="font-bold text-xs text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                                            <p className="text-xs font-semibold mt-0.5" style={{ color: accentColor }}>{edu.institution}</p>
                                            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                                                <span>{formatDate(edu.graduation_date)}</span>
                                                {edu.gpa && <span>GPA: {edu.gpa}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.skills && data.skills.length > 0 && (
                            <section>
                                <SectionTitle>Skills</SectionTitle>
                                <div className="space-y-2">
                                    {data.skills.map((skill, i) => {
                                        const s = typeof skill === 'string' ? { name: skill, level: 3 } : skill;
                                        const pct = Math.round((s.level / 5) * 100);
                                        return (
                                            <div key={i}>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-700 font-medium">{s.name}</span>
                                                    <div className="flex gap-0.5">
                                                        {[1,2,3,4,5].map(d => (
                                                            <span key={d} className="w-2.5 h-2.5 rounded-sm border inline-block"
                                                                style={{ borderColor: accentColor, backgroundColor: d <= s.level ? accentColor : 'transparent' }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                                                    <div className="h-full rounded-full transition-all"
                                                        style={{ width: `${pct}%`, backgroundColor: accentColor }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {data.languages && data.languages.length > 0 && (
                            <section>
                                <SectionTitle>Languages</SectionTitle>
                                <div className="space-y-2">
                                    {data.languages.map((lang, i) => (
                                        <div key={i} className="flex items-center justify-between rounded-lg px-3 py-1.5"
                                            style={{ backgroundColor: accentLight }}>
                                            <span className="text-xs font-medium text-gray-800">{lang.name}</span>
                                            <div className="flex gap-1">
                                                {lang.read && <span className="text-[10px] px-1.5 py-0.5 rounded font-bold text-white" style={{ backgroundColor: accentColor }}>R</span>}
                                                {lang.write && <span className="text-[10px] px-1.5 py-0.5 rounded font-bold text-white" style={{ backgroundColor: accentColor }}>W</span>}
                                                {lang.speak && <span className="text-[10px] px-1.5 py-0.5 rounded font-bold text-white" style={{ backgroundColor: accentColor }}>S</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.additional_info && data.additional_info.length > 0 && (
                            <section>
                                <SectionTitle>Additional</SectionTitle>
                                <div className="space-y-2">
                                    {data.additional_info.map((item, i) => (
                                        <div key={i} className="rounded-lg p-2.5" style={{ backgroundColor: accentLight }}>
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-xs font-bold" style={{ color: accentColor }}>{item.category}</span>
                                                <span className="text-xs font-medium text-gray-800">{item.title}</span>
                                                {item.date && <span className="text-xs text-gray-400">{item.date}</span>}
                                            </div>
                                            {item.subtitle && <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>}
                                            {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom gradient bar */}
            <div className="h-2" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentDark})` }} />
        </div>
    );
};

export default GradientTemplate;
