import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
const CardTemplate = ({ data, accentColor }) => {
  const formatDate = (d) => { if (!d) return ''; const [y, m] = d.split('-'); return new Date(y, m - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }); };
  const pi = data.personal_info || {};
  return (
    <div className="max-w-4xl mx-auto bg-gray-50 text-gray-800 p-6">
      <div className="rounded-xl p-6 text-white mb-5 shadow-md" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}>
        <h1 className="text-3xl font-bold">{pi.full_name || 'Your Name'}</h1>
        {pi.profession && <p className="text-base opacity-85 mt-1">{pi.profession}</p>}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {pi.email && <span className="flex items-center gap-1.5 opacity-90"><Mail className="size-4" />{pi.email}</span>}
          {pi.phone && <span className="flex items-center gap-1.5 opacity-90"><Phone className="size-4" />{pi.phone}</span>}
          {pi.location && <span className="flex items-center gap-1.5 opacity-90"><MapPin className="size-4" />{pi.location}</span>}
          {pi.linkedin && <span className="flex items-center gap-1.5 opacity-90"><Linkedin className="size-4" />{pi.linkedin}</span>}
          {pi.website && <span className="flex items-center gap-1.5 opacity-90"><Globe className="size-4" />{pi.website}</span>}
        </div>
      </div>
      {data.professional_summary && <div className="shadow-sm border rounded-lg p-4 bg-white mb-4"><h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Summary</h2><p className="text-sm text-gray-700 leading-relaxed text-justify">{data.professional_summary}</p></div>}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          {data.experience && data.experience.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Experience</h2><div className="space-y-3">{data.experience.map((exp, i) => <div key={i} className="shadow-sm border rounded-lg p-3 bg-white"><div className="flex justify-between items-start mb-1"><h3 className="font-bold text-sm text-gray-900">{exp.position}</h3><span className="text-xs text-gray-400 shrink-0 ml-1">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span></div><p className="text-xs font-semibold mb-1" style={{ color: accentColor }}>{exp.company}</p>{exp.description && <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line text-justify">{exp.description}</p>}</div>)}</div></div>}
          {data.project && data.project.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Projects</h2><div className="space-y-2">{data.project.map((proj, i) => <div key={i} className="shadow-sm border rounded-lg p-3 bg-white"><div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-sm text-gray-900">{proj.name}</h3>{proj.type && <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: accentColor }}>{proj.type}</span>}</div>{proj.description && <p className="text-xs text-gray-600">{proj.description}</p>}</div>)}</div></div>}
          {data.achievements && data.achievements.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Achievements</h2><div className="space-y-2">{data.achievements.map((a, i) => <div key={i} className="shadow-sm border rounded-lg p-3 bg-white border-l-4" style={{ borderLeftColor: accentColor }}><div className="flex items-center gap-2 mb-0.5"><span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: accentColor }}>{a.category}</span><span className="text-sm font-semibold text-gray-800">{a.title}</span></div>{a.from_value != null && a.from_value !== '' && a.to_value != null && a.to_value !== '' && <p className="text-sm font-bold" style={{ color: accentColor }}>{a.from_value}{a.unit} → {a.to_value}{a.unit}</p>}{a.description && <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>}</div>)}</div></div>}
          {data.additional_info && data.additional_info.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Additional Information</h2>
              <div className="space-y-2">
                {data.additional_info.map((item, i) => (
                  <div key={i} className="shadow-sm border rounded-lg p-3 bg-white flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: accentColor }}>{item.category}</span>
                      <span className="text-sm font-semibold text-gray-800">{item.title}</span>
                      {item.date && <span className="text-xs text-gray-400">{item.date}</span>}
                    </div>
                    {item.subtitle && <p className="text-xs text-gray-500">{item.subtitle}</p>}
                    {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {data.education && data.education.length > 0 && <div><h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Education</h2><div className="space-y-2">{data.education.map((edu, i) => <div key={i} className="shadow-sm border rounded-lg p-3 bg-white"><h3 className="font-bold text-sm text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3><p className="text-xs font-semibold" style={{ color: accentColor }}>{edu.institution}</p><div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>{formatDate(edu.graduation_date)}</span>{edu.gpa && <span>GPA: {edu.gpa}</span>}</div></div>)}</div></div>}
          {data.skills && data.skills.length > 0 && <div className="shadow-sm border rounded-lg p-3 bg-white"><h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Skills</h2><div className="space-y-1.5">{data.skills.map((skill, i) => { const s = typeof skill === 'string' ? { name: skill, level: 3 } : skill; return <div key={i} className="flex items-center justify-between gap-2"><span className="text-xs px-2 py-0.5 rounded-full text-white font-medium shrink-0" style={{ backgroundColor: accentColor + 'cc' }}>{s.name}</span><div className="flex gap-0.5 shrink-0">{[1,2,3,4,5].map(d => <span key={d} className="w-3 h-3 rounded-sm border inline-block" style={{ borderColor: accentColor, backgroundColor: d <= (s.level ?? 3) ? accentColor : 'transparent' }} />)}</div></div>; })}</div></div>}
          {data.languages && data.languages.length > 0 && <div className="shadow-sm border rounded-lg p-3 bg-white"><h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Languages</h2><div className="grid grid-cols-4 text-xs font-bold text-gray-400 uppercase mb-1"><span>Lang</span><span className="text-center">R</span><span className="text-center">W</span><span className="text-center">S</span></div>{data.languages.map((lang, i) => <div key={i} className="grid grid-cols-4 items-center py-1 border-b border-gray-100 last:border-0"><span className="text-xs font-medium truncate">{lang.name}</span>{['read','write','speak'].map(f => <div key={f} className="flex justify-center"><span className="w-3 h-3 rounded-sm border inline-block" style={{ borderColor: accentColor, backgroundColor: lang[f] ? accentColor : 'transparent', opacity: lang[f] ? 1 : 0.25 }} /></div>)}</div>)}</div>}
        </div>
      </div>
    </div>
  );
};
export default CardTemplate;
