import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
const StripTemplate = ({ data, accentColor }) => {
  const formatDate = (d) => { if (!d) return ''; const [y, m] = d.split('-'); return new Date(y, m - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }); };
  const pi = data.personal_info || {};
  const sections = [];
  if (data.professional_summary) sections.push({ id: 'summary', title: 'Summary' });
  if (data.experience?.length > 0) sections.push({ id: 'experience', title: 'Experience' });
  if (data.education?.length > 0) sections.push({ id: 'education', title: 'Education' });
  if (data.project?.length > 0) sections.push({ id: 'projects', title: 'Projects' });
  if (data.skills?.length > 0 || data.languages?.length > 0) sections.push({ id: 'skills', title: 'Skills & Languages' });
  if (data.achievements?.length > 0) sections.push({ id: 'achievements', title: 'Achievements' });
  const renderContent = (id) => {
    if (id === 'summary') return <p className="text-sm text-gray-700 leading-relaxed text-justify">{data.professional_summary}</p>;
    if (id === 'experience') return <div className="space-y-4">{data.experience.map((exp, i) => <div key={i}><div className="flex justify-between items-baseline"><h3 className="font-bold text-gray-900">{exp.position}</h3><span className="text-xs text-gray-500 shrink-0 ml-2">{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span></div><p className="text-sm font-semibold" style={{ color: accentColor }}>{exp.company}</p>{exp.description && <p className="text-sm text-gray-600 mt-1 leading-relaxed whitespace-pre-line text-justify">{exp.description}</p>}</div>)}</div>;
    if (id === 'education') return <div className="space-y-3">{data.education.map((edu, i) => <div key={i} className="flex justify-between items-start"><div><h3 className="font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3><p className="text-sm" style={{ color: accentColor }}>{edu.institution}</p>{edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}</div><span className="text-sm text-gray-500 shrink-0 ml-2">{formatDate(edu.graduation_date)}</span></div>)}</div>;
    if (id === 'projects') return <div className="space-y-3">{data.project.map((proj, i) => <div key={i}><div className="flex items-center gap-2"><h3 className="font-bold text-gray-900">{proj.name}</h3>{proj.type && <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: accentColor }}>{proj.type}</span>}</div>{proj.description && <p className="text-sm text-gray-600 mt-0.5">{proj.description}</p>}</div>)}</div>;
    if (id === 'skills') return <div className="grid grid-cols-2 gap-6">{data.skills?.length > 0 && <div><h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Skills</h3><div className="flex flex-wrap gap-2">{data.skills.map((skill, i) => { const s = typeof skill === 'string' ? { name: skill, level: 3 } : skill; return <div key={i} className="flex items-center gap-1.5 bg-white rounded px-2 py-1 border text-xs"><span className="text-gray-700">{s.name}</span><div className="flex gap-0.5">{[1,2,3,4,5].map(d => <span key={d} className="w-2.5 h-2.5 rounded-sm border inline-block" style={{ borderColor: accentColor, backgroundColor: d <= (s.level ?? 3) ? accentColor : 'transparent' }} />)}</div></div>; })}</div></div>}{data.languages?.length > 0 && <div><h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Languages</h3><div className="grid grid-cols-4 text-xs font-bold text-gray-400 uppercase mb-1"><span>Lang</span><span className="text-center">R</span><span className="text-center">W</span><span className="text-center">S</span></div>{data.languages.map((lang, i) => <div key={i} className="grid grid-cols-4 items-center py-1 border-b border-gray-200 last:border-0"><span className="text-xs font-medium truncate">{lang.name}</span>{['read','write','speak'].map(f => <div key={f} className="flex justify-center"><span className="w-3 h-3 rounded-sm border inline-block" style={{ borderColor: accentColor, backgroundColor: lang[f] ? accentColor : 'transparent', opacity: lang[f] ? 1 : 0.25 }} /></div>)}</div>)}</div>}</div>;
    if (id === 'achievements') return <div className="space-y-3">{data.achievements.map((a, i) => <div key={i} className="flex items-start gap-3 p-3 rounded-lg border-l-4 bg-white" style={{ borderColor: accentColor }}><div className="flex-1"><div className="flex items-center gap-2 flex-wrap mb-1"><span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accentColor }}>{a.category}</span><span className="text-sm font-semibold text-gray-800">{a.title}</span></div>{a.from_value != null && a.from_value !== '' && a.to_value != null && a.to_value !== '' && <p className="text-sm font-bold" style={{ color: accentColor }}>{a.from_value}{a.unit} → {a.to_value}{a.unit}</p>}{a.description && <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>}</div></div>)}</div>;
    return null;
  };
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800">
      <header className="px-8 py-6 text-center" style={{ backgroundColor: accentColor }}>
        <h1 className="text-3xl font-bold text-white">{pi.full_name || 'Your Name'}</h1>
        {pi.profession && <p className="text-base text-white opacity-80 mt-1">{pi.profession}</p>}
        <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm text-white opacity-90">
          {pi.email && <span className="flex items-center gap-1.5"><Mail className="size-3.5" />{pi.email}</span>}
          {pi.phone && <span className="flex items-center gap-1.5"><Phone className="size-3.5" />{pi.phone}</span>}
          {pi.location && <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{pi.location}</span>}
          {pi.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="size-3.5" />{pi.linkedin}</span>}
          {pi.website && <span className="flex items-center gap-1.5"><Globe className="size-3.5" />{pi.website}</span>}
        </div>
      </header>
      {sections.map((section, idx) => (
        <section key={section.id} className="px-8 py-5" style={{ backgroundColor: idx % 2 === 0 ? 'white' : accentColor + '15' }}>
          <div className="flex items-baseline gap-3 mb-4"><span className="text-3xl font-black opacity-20" style={{ color: accentColor }}>{String(idx+1).padStart(2,'0')}</span><h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: accentColor }}>{section.title}</h2></div>
          {renderContent(section.id)}
        </section>
      ))}
    </div>
  );
};
export default StripTemplate;
