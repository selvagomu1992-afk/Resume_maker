import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
const AcademicTemplate = ({ data, accentColor }) => {
  const formatDate = (d) => { if (!d) return ''; const [y, m] = d.split('-'); return new Date(y, m - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }); };
  const pi = data.personal_info || {};
  const SD = ({ title }) => <div className="flex items-center gap-3 mb-4"><div className="h-px flex-1 bg-gray-300" /><h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 px-2" style={{ color: accentColor }}>{title}</h2><div className="h-px flex-1 bg-gray-300" /></div>;
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 px-10 py-8">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{pi.full_name || 'Your Name'}</h1>
        {pi.profession && <p className="text-base text-gray-500 mt-1">{pi.profession}</p>}
        <div className="h-0.5 w-24 mx-auto mt-3 mb-3" style={{ backgroundColor: accentColor }} />
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {pi.email && <span className="flex items-center gap-1"><Mail className="size-3.5" />{pi.email}</span>}
          {pi.phone && <span className="flex items-center gap-1"><Phone className="size-3.5" />{pi.phone}</span>}
          {pi.location && <span className="flex items-center gap-1"><MapPin className="size-3.5" />{pi.location}</span>}
          {pi.linkedin && <span className="flex items-center gap-1"><Linkedin className="size-3.5" />{pi.linkedin}</span>}
          {pi.website && <span className="flex items-center gap-1"><Globe className="size-3.5" />{pi.website}</span>}
        </div>
      </header>
      {data.professional_summary && <section className="mb-6"><SD title="Summary" /><p className="text-sm text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">{data.professional_summary}</p></section>}
      {data.education && data.education.length > 0 && (
        <section className="mb-6"><SD title="Education" />
          <div className="space-y-4">{data.education.map((edu, i) => <div key={i} className="flex justify-between items-start"><div><h3 className="font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3><p className="text-sm font-semibold" style={{ color: accentColor }}>{edu.institution}</p>{edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}</div><span className="text-sm text-gray-500 shrink-0 ml-4">{formatDate(edu.graduation_date)}</span></div>)}</div>
        </section>
      )}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6"><SD title="Experience" />
          <div className="space-y-4">{data.experience.map((exp, i) => <div key={i}><div className="flex justify-between items-baseline"><h3 className="font-bold text-gray-900">{exp.position}</h3><span className="text-sm text-gray-500 shrink-0 ml-4">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span></div><p className="text-sm font-semibold" style={{ color: accentColor }}>{exp.company}</p>{exp.description && <p className="text-sm text-gray-600 mt-1 leading-relaxed whitespace-pre-line text-center">{exp.description}</p>}</div>)}</div>
        </section>
      )}
      {data.project && data.project.length > 0 && (
        <section className="mb-6"><SD title="Publications & Projects" />
          <div className="space-y-3">{data.project.map((proj, i) => <div key={i} className="flex gap-3"><span className="text-gray-400 font-bold shrink-0">[{i+1}]</span><div><span className="font-semibold text-gray-900">{proj.name}</span>{proj.type && <span className="ml-2 text-sm text-gray-500 italic">{proj.type}</span>}{proj.description && <p className="text-sm text-gray-600 mt-0.5">{proj.description}</p>}</div></div>)}</div>
        </section>
      )}
      {(data.skills?.length > 0 || data.languages?.length > 0) && (
        <section className="mb-6"><SD title="Skills & Languages" />
          <div className="grid grid-cols-2 gap-8">
            {data.skills && data.skills.length > 0 && <div><h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Technical Skills</h3><div className="space-y-1.5">{data.skills.map((skill, i) => { const s = typeof skill === 'string' ? { name: skill, level: 3 } : skill; return <div key={i} className="flex items-center justify-between gap-2"><span className="text-sm text-gray-700 truncate">{s.name}</span><div className="flex gap-0.5 shrink-0">{[1,2,3,4,5].map(d => <span key={d} className="w-3 h-3 rounded-sm border inline-block" style={{ borderColor: accentColor, backgroundColor: d <= (s.level ?? 3) ? accentColor : 'transparent' }} />)}</div></div>; })}</div></div>}
            {data.languages && data.languages.length > 0 && <div><h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Languages</h3><div className="grid grid-cols-4 text-xs font-bold text-gray-400 uppercase mb-1"><span>Lang</span><span className="text-center">R</span><span className="text-center">W</span><span className="text-center">S</span></div>{data.languages.map((lang, i) => <div key={i} className="grid grid-cols-4 items-center py-1 border-b border-gray-100 last:border-0"><span className="text-sm text-gray-800 font-medium truncate">{lang.name}</span>{['read','write','speak'].map(f => <div key={f} className="flex justify-center"><span className="w-3 h-3 rounded-sm border inline-block" style={{ borderColor: accentColor, backgroundColor: lang[f] ? accentColor : 'transparent', opacity: lang[f] ? 1 : 0.25 }} /></div>)}</div>)}</div>}
          </div>
        </section>
      )}
      {data.achievements && data.achievements.length > 0 && (
        <section className="mb-6"><SD title="Achievements" />
          <div className="space-y-3">{data.achievements.map((a, i) => <div key={i} className="flex gap-3"><span className="text-gray-400 font-bold shrink-0">[{i+1}]</span><div><div className="flex items-center gap-2"><span className="text-xs font-bold uppercase" style={{ color: accentColor }}>{a.category}</span><span className="font-semibold text-gray-800">{a.title}</span></div>{a.from_value != null && a.from_value !== '' && a.to_value != null && a.to_value !== '' && <p className="text-sm font-bold" style={{ color: accentColor }}>{a.from_value}{a.unit} → {a.to_value}{a.unit}</p>}{a.description && <p className="text-sm text-gray-500">{a.description}</p>}</div></div>)}</div>
        </section>
      )}
    </div>
  );
};
export default AcademicTemplate;
