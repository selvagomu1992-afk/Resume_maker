import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
const CornerTemplate = ({ data, accentColor }) => {
  const formatDate = (d) => { if (!d) return ''; const [y, m] = d.split('-'); return new Date(y, m - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }); };
  const pi = data.personal_info || {};
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 relative p-8">
      {/* Corner brackets */}
      <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: accentColor }} />
      <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: accentColor }} />
      <header className="text-center mb-6 pt-4">
        <h1 className="text-3xl font-bold text-gray-900">{pi.full_name || 'Your Name'}</h1>
        {pi.profession && <p className="text-base font-medium mt-1" style={{ color: accentColor }}>{pi.profession}</p>}
        <div className="flex items-center justify-center gap-3 mt-3"><div className="h-px w-16" style={{ backgroundColor: accentColor }} /><div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} /><div className="h-px w-16" style={{ backgroundColor: accentColor }} /></div>
      </header>
      {data.professional_summary && <div className="text-center mb-6"><p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">{data.professional_summary}</p></div>}
      <div className="flex gap-6">
        <div className="w-[35%] space-y-5">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>Contact</h2>
            <div className="space-y-1.5 text-xs text-gray-600">
              {pi.email && <div className="flex items-start gap-1.5"><Mail className="size-3 mt-0.5 shrink-0" style={{ color: accentColor }} /><span className="break-all">{pi.email}</span></div>}
              {pi.phone && <div className="flex items-center gap-1.5"><Phone className="size-3 shrink-0" style={{ color: accentColor }} />{pi.phone}</div>}
              {pi.location && <div className="flex items-center gap-1.5"><MapPin className="size-3 shrink-0" style={{ color: accentColor }} />{pi.location}</div>}
              {pi.linkedin && <div className="flex items-start gap-1.5"><Linkedin className="size-3 mt-0.5 shrink-0" style={{ color: accentColor }} /><span className="break-all">{pi.linkedin}</span></div>}
              {pi.website && <div className="flex items-start gap-1.5"><Globe className="size-3 mt-0.5 shrink-0" style={{ color: accentColor }} /><span className="break-all">{pi.website}</span></div>}
            </div>
          </div>
          {data.skills && data.skills.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>Skills</h2><div className="space-y-1.5">{data.skills.map((skill, i) => { const s = typeof skill === 'string' ? { name: skill, level: 3 } : skill; return <div key={i} className="flex items-center justify-between gap-2"><span className="text-xs text-gray-700 truncate">{s.name}</span><div className="flex gap-0.5 shrink-0">{[1,2,3,4,5].map(d => <span key={d} className="w-3 h-3 rounded-sm border inline-block" style={{ borderColor: accentColor, backgroundColor: d <= (s.level ?? 3) ? accentColor : 'transparent' }} />)}</div></div>; })}</div></div>}
          {data.languages && data.languages.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>Languages</h2><div className="grid grid-cols-4 text-xs font-bold text-gray-400 uppercase mb-1"><span>Lang</span><span className="text-center">R</span><span className="text-center">W</span><span className="text-center">S</span></div>{data.languages.map((lang, i) => <div key={i} className="grid grid-cols-4 items-center py-1 border-b border-gray-100 last:border-0"><span className="text-xs font-medium truncate">{lang.name}</span>{['read','write','speak'].map(f => <div key={f} className="flex justify-center"><span className="w-3 h-3 rounded-sm border inline-block" style={{ borderColor: accentColor, backgroundColor: lang[f] ? accentColor : 'transparent', opacity: lang[f] ? 1 : 0.25 }} /></div>)}</div>)}</div>}
          {data.education && data.education.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>Education</h2><div className="space-y-3">{data.education.map((edu, i) => <div key={i}><h3 className="text-xs font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3><p className="text-xs" style={{ color: accentColor }}>{edu.institution}</p><div className="flex justify-between text-xs text-gray-400"><span>{formatDate(edu.graduation_date)}</span>{edu.gpa && <span>GPA: {edu.gpa}</span>}</div></div>)}</div></div>}
        </div>
        <div className="flex flex-col items-center"><div className="w-px flex-1" style={{ backgroundColor: accentColor + '30' }} /><div className="w-2 h-2 rotate-45 my-2" style={{ backgroundColor: accentColor }} /><div className="w-px flex-1" style={{ backgroundColor: accentColor + '30' }} /></div>
        <div className="flex-1 space-y-5">
          {data.experience && data.experience.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>Experience</h2><div className="space-y-3">{data.experience.map((exp, i) => <div key={i}><div className="flex justify-between items-baseline"><h3 className="text-sm font-bold text-gray-900">{exp.position}</h3><span className="text-xs text-gray-400 shrink-0 ml-2">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span></div><p className="text-xs font-semibold" style={{ color: accentColor }}>{exp.company}</p>{exp.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed whitespace-pre-line">{exp.description}</p>}</div>)}</div></div>}
          {data.project && data.project.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>Projects</h2><div className="space-y-2">{data.project.map((proj, i) => <div key={i}><div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ backgroundColor: accentColor }} /><h3 className="text-sm font-bold text-gray-900">{proj.name}</h3>{proj.type && <span className="text-xs text-gray-400">({proj.type})</span>}</div>{proj.description && <p className="text-xs text-gray-600 ml-3.5">{proj.description}</p>}</div>)}</div></div>}
          {data.achievements && data.achievements.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>Achievements</h2><div className="space-y-2">{data.achievements.map((a, i) => <div key={i} className="flex items-start gap-2"><div className="w-1.5 h-1.5 rotate-45 shrink-0 mt-1.5" style={{ backgroundColor: accentColor }} /><div><div className="flex items-center gap-1.5"><span className="text-xs font-bold" style={{ color: accentColor }}>{a.category}</span><span className="text-xs font-semibold text-gray-800">{a.title}</span></div>{a.from_value != null && a.from_value !== '' && a.to_value != null && a.to_value !== '' && <p className="text-xs font-bold" style={{ color: accentColor }}>{a.from_value}{a.unit} → {a.to_value}{a.unit}</p>}{a.description && <p className="text-xs text-gray-500">{a.description}</p>}</div></div>)}</div></div>}
        </div>
      </div>
    </div>
  );
};
export default CornerTemplate;
