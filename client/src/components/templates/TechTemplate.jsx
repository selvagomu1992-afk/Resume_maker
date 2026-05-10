import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const TechTemplate = ({ data, accentColor }) => {
  const formatDate = (d) => { if (!d) return ''; const [y, m] = d.split('-'); return new Date(y, m - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }); };
  const pi = data.personal_info || {};
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 flex">
      <aside className="w-1/3 text-white p-6 flex flex-col gap-5" style={{ backgroundColor: '#1e293b' }}>
        <div className="text-center">
          <h1 className="text-xl font-bold leading-tight">{pi.full_name || 'Your Name'}</h1>
          {pi.profession && <p className="text-sm mt-1 opacity-70">{pi.profession}</p>}
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Contact</h2>
          <div className="space-y-1.5 text-xs">
            {pi.email && <div className="flex items-start gap-2"><Mail className="size-3 mt-0.5 shrink-0 opacity-70" /><span className="break-all">{pi.email}</span></div>}
            {pi.phone && <div className="flex items-center gap-2"><Phone className="size-3 shrink-0 opacity-70" />{pi.phone}</div>}
            {pi.location && <div className="flex items-center gap-2"><MapPin className="size-3 shrink-0 opacity-70" />{pi.location}</div>}
            {pi.linkedin && <div className="flex items-start gap-2"><Linkedin className="size-3 mt-0.5 shrink-0 opacity-70" /><span className="break-all">{pi.linkedin}</span></div>}
            {pi.website && <div className="flex items-start gap-2"><Globe className="size-3 mt-0.5 shrink-0 opacity-70" /><span className="break-all">{pi.website}</span></div>}
          </div>
        </div>
        {data.skills && data.skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Skills</h2>
            <div className="space-y-1.5">
              {data.skills.map((skill, i) => { const s = typeof skill === 'string' ? { name: skill, level: 3 } : skill; return (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-xs truncate">{s.name}</span>
                  <div className="flex gap-0.5 shrink-0">{[1,2,3,4,5].map(d => <span key={d} className="w-3 h-3 rounded-sm border inline-block" style={{ borderColor: accentColor, backgroundColor: d <= (s.level ?? 3) ? accentColor : 'transparent' }} />)}</div>
                </div>
              ); })}
            </div>
          </div>
        )}
        {data.languages && data.languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Languages</h2>
            <div className="grid grid-cols-4 text-xs font-semibold opacity-40 uppercase mb-1"><span>Lang</span><span className="text-center">R</span><span className="text-center">W</span><span className="text-center">S</span></div>
            {data.languages.map((lang, i) => (
              <div key={i} className="grid grid-cols-4 items-center py-1 border-b border-white border-opacity-10 last:border-0">
                <span className="text-xs font-medium truncate">{lang.name}</span>
                {['read','write','speak'].map(f => <div key={f} className="flex justify-center"><span className="w-3 h-3 rounded-sm border" style={{ borderColor: accentColor, backgroundColor: lang[f] ? accentColor : 'transparent', opacity: lang[f] ? 1 : 0.3 }} /></div>)}
              </div>
            ))}
          </div>
        )}
      </aside>
      <main className="w-2/3 p-6 space-y-5">
        {data.professional_summary && <section><h2 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>Summary</h2><p className="text-sm text-gray-700 leading-relaxed text-justify">{data.professional_summary}</p></section>}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>Experience</h2>
            <div className="space-y-3">{data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start"><div><h3 className="text-sm font-semibold text-gray-900">{exp.position}</h3><p className="text-xs font-medium" style={{ color: accentColor }}>{exp.company}</p></div><span className="text-xs text-gray-500 shrink-0 ml-2">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span></div>
                {exp.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed whitespace-pre-line text-justify">{exp.description}</p>}
              </div>
            ))}</div>
          </section>
        )}
        {data.education && data.education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>Education</h2>
            <div className="space-y-2">{data.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start"><div><h3 className="text-sm font-semibold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3><p className="text-xs text-gray-600">{edu.institution}</p>{edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}</div><span className="text-xs text-gray-500 shrink-0 ml-2">{formatDate(edu.graduation_date)}</span></div>
            ))}</div>
          </section>
        )}
        {data.project && data.project.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>Projects</h2>
            <div className="space-y-2">{data.project.map((proj, i) => (
              <div key={i}><div className="flex items-center gap-2"><span className="text-sm font-semibold text-gray-900">{proj.name}</span>{proj.type && <span className="text-xs px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: accentColor }}>{proj.type}</span>}</div>{proj.description && <p className="text-xs text-gray-600 mt-0.5">{proj.description}</p>}</div>
            ))}</div>
          </section>
        )}
        {data.achievements && data.achievements.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>Achievements</h2>
            <div className="space-y-2">{data.achievements.map((a, i) => (
              <div key={i} className="p-2 rounded border-l-4 text-xs" style={{ borderColor: accentColor, backgroundColor: accentColor + '10' }}>
                <div className="flex items-center gap-2 mb-0.5"><span className="font-semibold text-white text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: accentColor }}>{a.category}</span><span className="font-semibold text-gray-800">{a.title}</span></div>
                {a.from_value != null && a.from_value !== '' && a.to_value != null && a.to_value !== '' && <p className="font-bold" style={{ color: accentColor }}>{a.from_value}{a.unit} → {a.to_value}{a.unit}</p>}
                {a.description && <p className="text-gray-500">{a.description}</p>}
              </div>
            ))}</div>
          </section>
        )}
      </main>
    </div>
  );
};
export default TechTemplate;
