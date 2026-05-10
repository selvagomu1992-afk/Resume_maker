import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ModernTemplate = ({ data, accentColor }) => {
	const formatDate = (dateStr) => {
		if (!dateStr) return "";
		const [year, month] = dateStr.split("-");
		return new Date(year, month - 1).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short"
		});
	};

	return (
		<div className="max-w-4xl mx-auto bg-white text-gray-800">
			{/* Header */}
		<header className="p-8 text-white text-center" style={{ backgroundColor: accentColor }}>
				<h1 className="text-4xl font-light mb-1">
					{data.personal_info?.full_name || "Your Name"}
				</h1>
				{data.personal_info?.profession && (
					<p className="text-base opacity-80 mb-3">{data.personal_info.profession}</p>
				)}
				<div className="flex flex-wrap justify-center gap-4 text-sm">
					{data.personal_info?.email && (
						<div className="flex items-center gap-2">
							<Mail className="size-4" />
							<span>{data.personal_info.email}</span>
						</div>
					)}
					{data.personal_info?.phone && (
						<div className="flex items-center gap-2">
							<Phone className="size-4" />
							<span>{data.personal_info.phone}</span>
						</div>
					)}
					{data.personal_info?.location && (
						<div className="flex items-center gap-2">
							<MapPin className="size-4" />
							<span>{data.personal_info.location}</span>
						</div>
					)}
					{data.personal_info?.linkedin && (
						<a target="_blank" href={data.personal_info?.linkedin} className="flex items-center gap-2">
							<Linkedin className="size-4" />
							<span className="break-all text-xs">{data.personal_info.linkedin.split("https://www.")[1] ? data.personal_info.linkedin.split("https://www.")[1] : data.personal_info.linkedin}</span>
						</a>
					)}
					{data.personal_info?.website && (
						<a target="_blank" href={data.personal_info?.website} className="flex items-center gap-2">
							<Globe className="size-4" />
							<span className="break-all text-xs">{data.personal_info.website.split("https://")[1] ? data.personal_info.website.split("https://")[1] : data.personal_info.website}</span>
						</a>
					)}
				</div>
			</header>

			<div className="p-8">
				{/* Professional Summary */}
				{data.professional_summary && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
							Professional Summary
						</h2>
						<p className="text-gray-700 text-justify">{data.professional_summary}</p>
					</section>
				)}

				{/* Experience */}
				{data.experience && data.experience.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-6 pb-2 border-b border-gray-200">
							Experience
						</h2>

						<div className="space-y-6">
							{data.experience.map((exp, index) => (
								<div key={index} className="relative pl-6 border-l border-gray-200">

									<div className="flex justify-between items-start mb-2">
										<div>
											<h3 className="text-xl font-medium text-gray-900">{exp.position}</h3>
											<p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
										</div>
										<div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
											{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
										</div>
									</div>
									{exp.description && (
										<div className="text-gray-700 leading-relaxed mt-3 whitespace-pre-line text-justify">
											{exp.description}
										</div>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				{/* Projects */}
				{data.project && data.project.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
							Projects
						</h2>

						<div className="space-y-6">
							{data.project.map((p, index) => (
								<div key={index} className="relative pl-6 border-l border-gray-200" style={{borderLeftColor: accentColor}}>


									<div className="flex justify-between items-start">
										<div>
											<h3 className="text-lg font-medium text-gray-900">{p.name}</h3>
										</div>
									</div>
									{p.description && (
										<div className="text-gray-700 leading-relaxed text-sm mt-3">
											{p.description}
										</div>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				<div className="grid sm:grid-cols-2 gap-8">
					{/* Education */}
					{data.education && data.education.length > 0 && (
						<section>
							<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">Education</h2>
							<div className="space-y-4">
								{data.education.map((edu, index) => (
									<div key={index}>
										<h3 className="font-semibold text-gray-900">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
										<p style={{ color: accentColor }}>{edu.institution}</p>
										<div className="flex justify-between items-center text-sm text-gray-600">
											<span>{formatDate(edu.graduation_date)}</span>
											{edu.gpa && <span>GPA: {edu.gpa}</span>}
										</div>
									</div>
								))}
							</div>
						</section>
					)}

					{/* Skills compact */}
					{data.skills && data.skills.length > 0 && (
						<section>
							<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">Skills</h2>
							<div className="grid grid-cols-1 gap-1">
								{data.skills.map((skill, index) => {
									const s = typeof skill === 'string' ? { name: skill, level: 3 } : skill
									return (
										<div key={index} className="flex items-center justify-between gap-2">
											<span className="text-xs text-gray-700 truncate">{s.name}</span>
											<div className="flex gap-0.5 shrink-0">
												{[1,2,3,4,5].map(d => (
													<span key={d} className="w-3 h-3 rounded-sm border"
														style={{ borderColor: accentColor, backgroundColor: d <= (s.level ?? 3) ? accentColor : 'transparent' }}
													/>
												))}
											</div>
										</div>
									)
								})}
							</div>
						</section>
					)}
				</div>

				{/* Languages compact */}
				{data.languages && data.languages.length > 0 && (
					<section className="mt-6">
						<h2 className="text-2xl font-light mb-3 pb-2 border-b border-gray-200">Languages</h2>
						<div className="grid grid-cols-2 gap-x-8">
							{data.languages.map((lang, i) => (
								<div key={i} className="flex items-center justify-between py-0.5 border-b border-gray-100 last:border-0">
									<span className="text-xs text-gray-800 font-medium">{lang.name}</span>
									<div className="flex gap-1 text-xs">
										{lang.read && <span className="px-1 py-0.5 rounded text-white text-xs" style={{ backgroundColor: accentColor }}>R</span>}
										{lang.write && <span className="px-1 py-0.5 rounded text-white text-xs" style={{ backgroundColor: accentColor }}>W</span>}
										{lang.speak && <span className="px-1 py-0.5 rounded text-white text-xs" style={{ backgroundColor: accentColor }}>S</span>}
									</div>
								</div>
							))}
						</div>
					</section>
				)}

				{/* Achievements */}
				{data.achievements && data.achievements.length > 0 && (
					<section className="mt-8">
						<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">Achievements</h2>
						<div className="space-y-3">
							{data.achievements.map((a, i) => (
								<div key={i} className="flex items-start gap-3 p-3 rounded-lg border-l-4" style={{ borderColor: accentColor, backgroundColor: accentColor + '08' }}>
									<div className="flex-1">
										<div className="flex items-center gap-2 flex-wrap mb-1">
											<span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accentColor }}>{a.category}</span>
											<span className="text-sm font-semibold text-gray-800">{a.title}</span>
										</div>
										{(a.from_value !== '' && a.from_value != null && a.to_value !== '' && a.to_value != null) && (
											<p className="text-sm font-bold" style={{ color: accentColor }}>{a.from_value}{a.unit} → {a.to_value}{a.unit}</p>
										)}
										{a.description && <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>}
									</div>
								</div>
							))}
						</div>
					</section>
				)}

				{/* Additional Information */}
				{data.additional_info && data.additional_info.length > 0 && (
					<section className="mt-8">
						<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">Additional Information</h2>
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
}

export default ModernTemplate;