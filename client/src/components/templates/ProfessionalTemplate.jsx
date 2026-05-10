import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
const ProfessionalTemplate = ({ data, accentColor }) => {
  const formatDate = (d) => { if (!d) return ''; const [y, m] = d.split('-'); return new Date(y, m - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }); };
  const pi = data.personal_info || {};
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800">
      <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />
      <header className="px-8 pt-6 pb-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900">{pi.full_name || 'Your Name'}</h1>
        {pi.profession && <p className="text-lg mt-1" style={{ color: accentColor }}>{pi.profession}</p>}
        <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm text-gray-600">
          {pi.email && <span className="flex items-center gap-1"><Mail className="size-3.5" />{pi.email}</span>}
          {pi.phone && <span className="flex items-center gap-1"><Phone className="size-3.5" />{pi.phone}</span>}
          {pi.location && <span className="flex items-center gap-1"><MapPin className="size-3.5" />{pi.location}</span>}
          {pi.linkedin && <span className="flex items-center gap-1"><Linkedin className="size-3.5" />{pi.linkedin}</span>}
          {pi.website && <span className="flex items-center gap-1"><Globe className="size-3.5" />{pi.website}</span>}
        </div>
      </header>
      <div className="h-px mx-8" style={{ backgroundColor: accentColor + '40' }} />
      {data.professional_summary && <div className="px-8 py-4"><p className="text-sm text-gray-700 leading-relaxed italic text-justify">{data.professional_summary}</p></div>}
      <div className="px-8 pb-8 flex gap-8">
        <div className="flex-[3] space-y-5">
          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 className="text-base font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Experience</h2>
              <div className="space-y-4">{data.experience.map((exp, i) => (
                <div key={i}><div className="flex justify-between items-baseline"><h3 className="font-bold text-gray-900">{exp.position}</h3><span className="text-xs text-gray-500 shrink-0 ml-2">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span></div><p className="text-sm font-semibold" style={{ color: accentColor }}>{exp.company}</p>{exp.description && <p className="text-sm text-gray-600 mt-1 leading-relaxed whitespace-pre-line text-justify">{exp.description}</p>}</div>
              ))}</div>
            </section>
          )}
          {data.project && data.project.length > 0 && (
            <section>
              <h2 className="text-base font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Projects</h2>
              <div className="space-y-3">{data.project.map((proj, i) => (
                <div key={i}><div className="flex items-center gap-2"><h3 className="font-bold text-gray-900">{proj.name}</h3>{proj.type && <span className="text-xs text-gray-500 italic">({proj.type})</span>}</div>{proj.description && <p className="text-sm text-gray-600 mt-0.5">{proj.description}</p>}</div>
              ))}</div>
            </section>
          )}
          {data.achievements && data.achievements.length > 0 && (
            <section>
              <h2 className="text-base font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Achievements</h2>
              <div className="space-y-2">{data.achievements.map((a, i) => (
                <div key={i} className="border-l-4 pl-3 py-1" style={{ borderColor: accentColor }}>
                  <div className="flex items-center gap-2"><span className="text-xs font-bold uppercase" style={{ color: accentColor }}>{a.category}</span><span className="text-sm font-semibold text-gray-800">{a.title}</span></div>
                  {a.from_value != null && a.from_value !== '' && a.to_value != null && a.to_value !== '' && <p className="text-sm font-bold" style={{ color: accentColor }}>{a.from_value}{a.unit} → {a.to_value}{a.unit}</p>}
                  {a.description && <p className="text-xs text-gray-500">{a.description}</p>}
                </div>
              ))}</div>
            </section>
          )}
          {data.additional_info && data.additional_info.length > 0 && (
            <section>
              <h2 className="text-base font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Additional Information</h2>
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
        <div className="flex-[2] space-y-5">
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-base font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Education</h2>
              <div className="space-y-3">{data.education.map((edu, i) => (
                <div key={i}><h3 className="font-bold text-sm text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3><p className="text-sm" style={{ color: accentColor }}>{edu.institution}</p><div className="flex justify-between text-xs text-gray-500"><span>{formatDate(edu.graduation_date)}</span>{edu.gpa && <span>GPA: {edu.gpa}</span>}</div></div>
              ))}</div>
            </section>
          )}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-base font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Skills</h2>
              <div className="space-y-1.5">{data.skills.map((skill, i) => { const s = typeof skill === 'string' ? { name: skill, level: 3 } : skill; return (
                <div key={i} className="flex items-center justify-between gap-2"><span className="text-xs text-gray-700 truncate">{s.name}</span><div className="flex gap-0.5 shrink-0">{[1,2,3,4,5].map(d => <span key={d} className="w-3 h-3 rounded-sm border inline-block" style={{ borderColor: accentColor, backgroundColor: d <= (s.level ?? 3) ? accentColor : 'transparent' }} />)}</div></div>
              ); })}</div>
            </section>
          )}
          {data.languages && data.languages.length > 0 && (
            <section>
              <h2 className="text-base font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Languages</h2>
              <div className="grid grid-cols-4 text-xs font-bold text-gray-400 uppercase mb-1"><span>Lang</span><span className="text-center">R</span><span className="text-center">W</span><span className="text-center">S</span></div>
              {data.languages.map((lang, i) => (
                <div key={i} className="grid grid-cols-4 items-center py-1 border-b border-gray-100 last:border-0">
                  <span className="text-xs font-medium truncate">{lang.name}</span>
                  {['read','write','speak'].map(f => <div key={f} className="flex justify-center"><span className="w-3 h-3 rounded-sm border inline-block" style={{ borderColor: accentColor, backgroundColor: lang[f] ? accentColor : 'transparent', opacity: lang[f] ? 1 : 0.25 }} /></div>)}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfessionalTemplate;
