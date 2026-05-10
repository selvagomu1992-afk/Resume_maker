import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
const NordicTemplate = ({ data, accentColor }) => {
  const formatDate = (d) => { if (!d) return ''; const [y, m] = d.split('-'); return new Date(y, m - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }); };
  const pi = data.personal_info || {};
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 px-12 py-10">
      <header className="mb-8">
        <h1 className="text-5xl font-thin tracking-tight text-gray-900 leading-none">{pi.full_name || 'Your Name'}</h1>
        {pi.profession && <p className="text-lg font-light text-gray-400 mt-2">{pi.profession}</p>}
        <div className="h-px mt-4 mb-4" style={{ backgroundColor: accentColor }} />
        <div className="flex flex-wrap gap-5 text-sm text-gray-500 font-light">
          {pi.email && <span className="flex items-center gap-1.5"><Mail className="size-3.5" />{pi.email}</span>}
          {pi.phone && <span className="flex items-center gap-1.5"><Phone className="size-3.5" />{pi.phone}</span>}
          {pi.location && <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{pi.location}</span>}
          {pi.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="size-3.5" />{pi.linkedin}</span>}
          {pi.website && <span className="flex items-center gap-1.5"><Globe className="size-3.5" />{pi.website}</span>}
        </div>
      </header>
      {data.professional_summary && <section className="mb-10"><p className="text-base font-light text-gray-600 leading-loose max-w-2xl">{data.professional_summary}</p></section>}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: accentColor }}>Experience</h2>
          <div className="space-y-7">{data.experience.map((exp, i) => <div key={i} className="flex gap-8"><div className="w-28 shrink-0 text-xs text-gray-400 font-light pt-0.5 text-right"><p>{formatDate(exp.start_date)}</p><p>–</p><p>{exp.is_current ? 'Present' : formatDate(exp.end_date)}</p></div><div className="flex-1"><h3 className="font-semibold text-gray-900">{exp.position}</h3><p className="text-sm font-light" style={{ color: accentColor }}>{exp.company}</p>{exp.description && <p className="text-sm font-light text-gray-600 mt-2 leading-relaxed whitespace-pre-line">{exp.description}</p>}</div></div>)}</div>
        </section>
      )}
      {data.education && data.education.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: accentColor }}>Education</h2>
          <div className="space-y-4">{data.education.map((edu, i) => <div key={i} className="flex gap-8"><div className="w-28 shrink-0 text-xs text-gray-400 font-light pt-0.5 text-right">{formatDate(edu.graduation_date)}</div><div className="flex-1"><h3 className="font-semibold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3><p className="text-sm font-light" style={{ color: accentColor }}>{edu.institution}</p>{edu.gpa && <p className="text-xs font-light text-gray-400 mt-0.5">GPA: {edu.gpa}</p>}</div></div>)}</div>
        </section>
      )}
      {data.project && data.project.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: accentColor }}>Projects</h2>
          <div className="space-y-4">{data.project.map((proj, i) => <div key={i} className="flex gap-8"><div className="w-28 shrink-0 text-xs text-gray-400 font-light pt-0.5 text-right">{proj.type || ''}</div><div className="flex-1"><h3 className="font-semibold text-gray-900">{proj.name}</h3>{proj.description && <p className="text-sm font-light text-gray-600 mt-1">{proj.description}</p>}</div></div>)}</div>
        </section>
      )}
      {(data.skills?.length > 0 || data.languages?.length > 0) && (
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: accentColor }}>Skills & Languages</h2>
          <div className="grid grid-cols-2 gap-10">
            {data.skills && data.skills.length > 0 && <div className="space-y-2">{data.skills.map((skill, i) => { const s = typeof skill === 'string' ? { name: skill, level: 3 } : skill; return <div key={i} className="flex items-center justify-between gap-3"><span className="text-sm font-light text-gray-700">{s.name}</span><div className="flex gap-1 shrink-0">{[1,2,3,4,5].map(d => <span key={d} className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: d <= (s.level ?? 3) ? accentColor : '#e5e7eb' }} />)}</div></div>; })}</div>}
            {data.languages && data.languages.length > 0 && <div className="space-y-2">{data.languages.map((lang, i) => <div key={i} className="flex items-center justify-between"><span className="text-sm font-light text-gray-700">{lang.name}</span><div className="flex gap-1 text-xs font-light">{lang.read && <span style={{ color: accentColor }}>Read</span>}{lang.write && <span style={{ color: accentColor }}>Write</span>}{lang.speak && <span style={{ color: accentColor }}>Speak</span>}</div></div>)}</div>}
          </div>
        </section>
      )}
      {data.achievements && data.achievements.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: accentColor }}>Achievements</h2>
          <div className="space-y-4">{data.achievements.map((a, i) => <div key={i} className="flex gap-8"><div className="w-28 shrink-0 text-xs text-gray-400 font-light pt-0.5 text-right">{a.category}</div><div className="flex-1"><h3 className="font-semibold text-gray-900">{a.title}</h3>{a.from_value != null && a.from_value !== '' && a.to_value != null && a.to_value !== '' && <p className="text-sm font-semibold" style={{ color: accentColor }}>{a.from_value}{a.unit} → {a.to_value}{a.unit}</p>}{a.description && <p className="text-sm font-light text-gray-600 mt-0.5">{a.description}</p>}</div></div>)}</div>
        </section>
      )}
    </div>
  );
};
export default NordicTemplate;
