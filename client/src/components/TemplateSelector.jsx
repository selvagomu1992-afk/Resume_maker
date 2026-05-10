import { Check, Layout } from 'lucide-react'
import React, { useState } from 'react'

const TemplateSelector = ({ selectedTemplate, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)

    const templates = [
        { id: "classic",      name: "Classic",       preview: "Clean traditional format with clear sections and professional typography" },
        { id: "modern",       name: "Modern",        preview: "Sleek design with strategic color use and modern font choices" },
        { id: "executive",    name: "Executive",     preview: "Two-column layout with bold colored sidebar — ideal for senior roles" },
        { id: "minimal-image",name: "Minimal Image", preview: "Minimal design with a profile photo and clean typography" },
        { id: "minimal",      name: "Minimal",       preview: "Ultra-clean design that puts your content front and center" },
        { id: "creative",     name: "Creative",      preview: "Bold banner header with two-column layout — great for standing out" },
        { id: "timeline",     name: "Timeline",      preview: "Vertical timeline experience section with clean right-sidebar accent" },
        { id: "infographic",  name: "Infographic",   preview: "Dark sidebar with accent skill progress bars — modern & eye-catching" },
        { id: "elegant",      name: "Elegant",       preview: "Centered thin-font header with dot-ring skill rating indicators" },
        { id: "tech",         name: "Tech",          preview: "Dark navy sidebar with white text — perfect for developers & engineers" },
        { id: "professional", name: "Professional",  preview: "Serif-style with thin top border, two-column body — polished & formal" },
        { id: "bold",         name: "Bold",          preview: "Full-width accent header band with bold uppercase section headings" },
        { id: "compact",      name: "Compact",       preview: "Tiny font, two-column layout — fits maximum content on one page" },
        { id: "academic",     name: "Academic",      preview: "Traditional CV style with centered name, education first, numbered projects" },
        { id: "split",        name: "Split",         preview: "Solid accent left sidebar with photo, white right content area" },
        { id: "card",         name: "Card",          preview: "Gradient header card, each section in shadow cards — modern & clean" },
        { id: "nordic",       name: "Nordic",        preview: "Scandinavian minimal — huge thin name, lots of whitespace, dot skills" },
        { id: "corner",       name: "Corner",        preview: "Decorative corner brackets, centered name, geometric diamond divider" },
        { id: "strip",        name: "Strip",         preview: "Alternating section backgrounds with bold section numbers (01, 02...)" },
    ]

    return (
        <div className='relative'>
            <button onClick={() => setIsOpen(!isOpen)} className='flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 ring-blue-300 hover:ring transition-all px-3 py-2 rounded-lg'>
                <Layout size={14} /> <span className='max-sm:hidden'>Template</span>
            </button>
            {isOpen && (
                <div className='absolute top-full w-72 p-3 mt-2 space-y-2 z-50 bg-white rounded-xl border border-gray-200 shadow-lg max-h-[70vh] overflow-y-auto'>
                    <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 pb-1'>Choose Template</p>
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => { onChange(template.id); setIsOpen(false) }}
                            className={`relative p-3 border rounded-lg cursor-pointer transition-all ${selectedTemplate === template.id
                                ? "border-blue-400 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            {selectedTemplate === template.id && (
                                <div className="absolute top-2 right-2">
                                    <div className='size-5 bg-blue-400 rounded-full flex items-center justify-center'>
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                </div>
                            )}
                            <h4 className='font-semibold text-gray-800 text-sm'>{template.name}</h4>
                            <p className='mt-1 text-xs text-gray-500 italic leading-relaxed'>{template.preview}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TemplateSelector
