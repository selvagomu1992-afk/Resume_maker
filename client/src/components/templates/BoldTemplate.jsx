import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
const BoldTemplate = ({ data, accentColor }) => {
  const formatDate = (d) => { if (!d) return ''; const [y, m] = d.split('-'); return new Date(y, m - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }); };
  const pi = data.personal_info || {};
  const SH = ({ children }) => <h2 className="text-sm font-black uppercase tracking-widest mb-3 pl-3 border-l-4 py-1" style={{ color: accentColor, borderColor: accentColor }}>{children}</h2>;
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800">
      <header className="text-white px-8 py-8 text-center" style={{ backgroundColor: accentColor }}>
        <h1 className="text-4xl font-black tracking-tight">{pi.full_name || 'Your Name'}</h1>
        {pi.profession && <p className="text-lg font-light mt-1 opacity-85">{pi.profession}</p>}
      </header>
      <div className="px-8 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600">
          {pi.email && <span className="flex items-center gap-1.5"><Mail className="size-3.5 shrink-0" style={{ color: accentColor }} />{pi.email}</span>}
          {pi.phone && <span className="flex items-center gap-1.5"><Phone className="size-3.5 shrink-0" style={{ color: accentColor }} />{pi.phone}</span>}
          {pi.location && <span className="flex items-center gap-1.5"><MapPin className="size-3.5 shrink-0" style={{ color: accentColor }} />{pi.location}</span>}
          {pi.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="size-3.5 shrink-0" style={{ color: accentColor }} /><span className="truncate">{pi.linkedin}</span></span>}
          {pi.website && <span className="flex items-center gap-1.5"><Globe className="size-3.5 shrink-0" style={{ color: accentColor }} /><span className="truncate">{pi.website}</span></span>}
        </div>
      </div>
      <div className="px-8 py-6 space-y-5">
        {data.professional_summary && <section><SH>Professional Summary</SH><p className="text-sm text-gray-700 leading-relaxed text-justify">{data.professional_summary}</p></section>}
        {data.experience && data.experience.length > 0 && (
          <section><SH>Experience</SH>
            <div className="space-y-4">{data.experience.map((exp, i) => (
              <div key={i}><div className="flex justify-between items-baseline"><h3 className="font-bold text-gray-900">{exp.position}</h3><span className="text-xs text-gray-500 shrink-0 ml-2">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span></div><p className="text-sm font-semibold" style={{ color: accentColor }}>{exp.company}</p>{exp.description && <p className="text-sm text-gray-600 mt-1 leading-relaxed whitespace-pre-line text-justify">{exp.description}</p>}</div>
            ))}</div>
          </section>
        )}
        {data.education && data.education.length > 0 && (
          <section><SH>Education</SH>
            <div className="space-y-3">{data.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start"><div><h3 className="font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3><p className="text-sm" style={{ color: accentColor }}>{edu.institution}</p>{edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}</div><span className="text-xs text-gray-500 shrink-0 ml-2">{formatDate(edu.graduation_date)}</span></div>
            ))}</div>
          </section>
        )}
        {data.project && data.project.length > 0 && (
          <section><SH>Projects</SH>
            <div className="space-y-3">{data.project.map((proj, i) => (
              <div key={i}><div className="flex items-center gap-2"><h3 className="font-bold text-gray-900">{proj.name}</h3>{proj.type && <span className="text-xs px-2 py-0.5 rounded-full text-white font-semibold" style={{ backgroundColor: accentColor }}>{proj.type}</span>}</div>{proj.description && <p className="text-sm text-gray-600 mt-0.5">{proj.description}</p>}</div>
            ))}</div>
          </section>
        )}
        {(data.skills?.length > 0 || data.languages?.length > 0) && (
          <div className="grid grid-cols-2 gap-6">
            {data.skills && data.skills.length > 0 && <section><SH>Skills</SH><div className="space-y-1.5">{data.skills.map((skill, i) => { const s = typeof skill === 'string' ? { name: skill, level: 3 } : skill; return <div key={i} className="flex items-center justify-between gap-2"><span className="text-xs text-gray-700 truncate">{s.name}</span><div className="flex gap-0.5 shrink-0">{[1,2,3,4,5].map(d => <span key={d} className="w-3 h-3 rounded-sm border inline-block" style={{ borderColor: accentColor, backgroundColor: d <= (s.level ?? 3) ? accentColor : 'transparent' }} />)}</div></div>; })}</div></section>}
            {data.languages && data.languages.length > 0 && <section><SH>Languages</SH><div className="grid grid-cols-4 text-xs font-bold text-gray-400 uppercase mb-1"><span>Lang</span><span className="text-center">R</span><span className="text-center">W</span><span className="text-center">S</span></div>{data.languages.map((lang, i) => <div key={i} className="grid grid-cols-4 items-center py-1 border-b border-gray-100 last:border-0"><span className="text-xs font-medium truncate">{lang.name}</span>{['read','write','speak'].map(f => <div key={f} className="flex justify-center"><span className="w-3 h-3 rounded-sm border inline-block" style={{ borderColor: accentColor, backgroundColor: lang[f] ? accentColor : 'transparent', opacity: lang[f] ? 1 : 0.25 }} /></div>)}</div>)}</section>}
          </div>
        )}
        {data.achievements && data.achievements.length > 0 && (
          <section><SH>Achievements</SH>
            <div className="space-y-2">{data.achievements.map((a, i) => (
              <div key={i} className="p-3 rounded border-l-4" style={{ borderColor: accentColor, backgroundColor: accentColor + '0d' }}>
                <div className="flex items-center gap-2 mb-0.5"><span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accentColor }}>{a.category}</span><span className="text-sm font-bold text-gray-800">{a.title}</span></div>
                {a.from_value != null && a.from_value !== '' && a.to_value != null && a.to_value !== '' && <p className="text-sm font-black" style={{ color: accentColor }}>{a.from_value}{a.unit} → {a.to_value}{a.unit}</p>}
                {a.description && <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>}
              </div>
            ))}</div>
          </section>
        )}
        {data.additional_info && data.additional_info.length > 0 && (
          <section><SH>Additional Information</SH>
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
    </div>
  );
};
export default BoldTemplate;
