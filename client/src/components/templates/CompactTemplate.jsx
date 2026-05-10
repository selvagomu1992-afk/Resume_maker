import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
const CompactTemplate = ({ data, accentColor }) => {
  const formatDate = (d) => { if (!d) return ''; const [y, m] = d.split('-'); return new Date(y, m - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }); };
  const pi = data.personal_info || {};
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 p-5 text-xs leading-snug">
      <header className="mb-3 pb-2 border-b-2 text-center" style={{ borderColor: accentColor }}>
        <h1 className="text-xl font-bold text-gray-900">{pi.full_name || 'Your Name'}</h1>
        {pi.profession && <p className="text-sm font-medium" style={{ color: accentColor }}>{pi.profession}</p>}
        <div className="flex flex-wrap justify-center gap-3 mt-1 text-xs text-gray-500">
          {pi.email && <div className="flex items-center gap-1"><Mail className="size-3" />{pi.email}</div>}
          {pi.phone && <div className="flex items-center gap-1"><Phone className="size-3" />{pi.phone}</div>}
          {pi.location && <div className="flex items-center gap-1"><MapPin className="size-3" />{pi.location}</div>}
          {pi.linkedin && <div className="flex items-center gap-1"><Linkedin className="size-3" /><span className="truncate max-w-[140px]">{pi.linkedin}</span></div>}
          {pi.website && <div className="flex items-center gap-1"><Globe className="size-3" /><span className="truncate max-w-[140px]">{pi.website}</span></div>}
        </div>
      </header>
      {data.professional_summary && <section className="mb-3"><h2 className="text-sm font-bold uppercase tracking-wide mb-1" style={{ color: accentColor }}>Summary</h2><p className="text-xs text-gray-600 leading-relaxed text-justify">{data.professional_summary}</p></section>}
      <div className="flex gap-4">
        <div className="flex-[3] space-y-3">
          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide mb-1.5 pb-0.5 border-b" style={{ color: accentColor, borderColor: accentColor }}>Experience</h2>
              <div className="space-y-2">{data.experience.map((exp, i) => (
                <div key={i}><div className="flex justify-between items-baseline"><span className="font-bold text-gray-900">{exp.position}</span><span className="text-gray-400 shrink-0 ml-1">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span></div><p className="font-semibold" style={{ color: accentColor }}>{exp.company}</p>{exp.description && <p className="text-gray-600 mt-0.5 leading-relaxed whitespace-pre-line text-justify">{exp.description}</p>}</div>
              ))}</div>
            </section>
          )}
          {data.project && data.project.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide mb-1.5 pb-0.5 border-b" style={{ color: accentColor, borderColor: accentColor }}>Projects</h2>
              <div className="space-y-1.5">{data.project.map((proj, i) => <div key={i}><span className="font-bold text-gray-900">{proj.name}</span>{proj.type && <span className="ml-1 text-gray-400">({proj.type})</span>}{proj.description && <p className="text-gray-600">{proj.description}</p>}</div>)}</div>
            </section>
          )}
          {data.achievements && data.achievements.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide mb-1.5 pb-0.5 border-b" style={{ color: accentColor, borderColor: accentColor }}>Achievements</h2>
              <div className="space-y-1.5">{data.achievements.map((a, i) => <div key={i} className="flex items-start gap-1.5"><span className="font-bold shrink-0" style={{ color: accentColor }}>[{a.category}]</span><div><span className="font-semibold text-gray-800">{a.title}</span>{a.from_value != null && a.from_value !== '' && a.to_value != null && a.to_value !== '' && <span className="ml-1 font-bold" style={{ color: accentColor }}>{a.from_value}{a.unit}→{a.to_value}{a.unit}</span>}{a.description && <p className="text-gray-500">{a.description}</p>}</div></div>)}</div>
            </section>
          )}
          {data.additional_info && data.additional_info.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide mb-1.5 pb-0.5 border-b" style={{ color: accentColor, borderColor: accentColor }}>Additional Information</h2>
              <div className="grid grid-cols-2 gap-2">
                {data.additional_info.map((item, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold shrink-0" style={{ color: accentColor }}>[{item.category}]</span>
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
        <div className="flex-[2] space-y-3">
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide mb-1.5 pb-0.5 border-b" style={{ color: accentColor, borderColor: accentColor }}>Education</h2>
              <div className="space-y-2">{data.education.map((edu, i) => <div key={i}><p className="font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p><p style={{ color: accentColor }}>{edu.institution}</p><div className="flex justify-between text-gray-400"><span>{formatDate(edu.graduation_date)}</span>{edu.gpa && <span>GPA: {edu.gpa}</span>}</div></div>)}</div>
            </section>
          )}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide mb-1.5 pb-0.5 border-b" style={{ color: accentColor, borderColor: accentColor }}>Skills</h2>
              <div className="grid grid-cols-1 gap-1">{data.skills.map((skill, i) => { const s = typeof skill === 'string' ? { name: skill, level: 3 } : skill; return <div key={i} className="flex items-center justify-between gap-1"><span className="truncate text-gray-700">{s.name}</span><div className="flex gap-0.5 shrink-0">{[1,2,3,4,5].map(d => <span key={d} className="w-2.5 h-2.5 rounded-sm border inline-block" style={{ borderColor: accentColor, backgroundColor: d <= (s.level ?? 3) ? accentColor : 'transparent' }} />)}</div></div>; })}</div>
            </section>
          )}
          {data.languages && data.languages.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide mb-1.5 pb-0.5 border-b" style={{ color: accentColor, borderColor: accentColor }}>Languages</h2>
              <div className="space-y-1">{data.languages.map((lang, i) => <div key={i} className="flex items-center justify-between"><span className="font-medium text-gray-800">{lang.name}</span><div className="flex gap-1">{lang.read && <span className="px-1 rounded text-white font-bold" style={{ backgroundColor: accentColor }}>R</span>}{lang.write && <span className="px-1 rounded text-white font-bold" style={{ backgroundColor: accentColor }}>W</span>}{lang.speak && <span className="px-1 rounded text-white font-bold" style={{ backgroundColor: accentColor }}>S</span>}</div></div>)}</div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
export default CompactTemplate;
