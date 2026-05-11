import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { dummyResumeData } from '../../assets/assets'

// Import all templates
import ClassicTemplate from '../templates/ClassicTemplate'
import ModernTemplate from '../templates/ModernTemplate'
import MinimalTemplate from '../templates/MinimalTemplate'
import MinimalImageTemplate from '../templates/MinimalImageTemplate'
import ExecutiveTemplate from '../templates/ExecutiveTemplate'
import CreativeTemplate from '../templates/CreativeTemplate'
import TimelineTemplate from '../templates/TimelineTemplate'
import InfographicTemplate from '../templates/InfographicTemplate'
import ElegantTemplate from '../templates/ElegantTemplate'
import TechTemplate from '../templates/TechTemplate'
import ProfessionalTemplate from '../templates/ProfessionalTemplate'
import BoldTemplate from '../templates/BoldTemplate'
import CompactTemplate from '../templates/CompactTemplate'
import AcademicTemplate from '../templates/AcademicTemplate'
import SplitTemplate from '../templates/SplitTemplate'
import CardTemplate from '../templates/CardTemplate'
import NordicTemplate from '../templates/NordicTemplate'
import CornerTemplate from '../templates/CornerTemplate'
import StripTemplate from '../templates/StripTemplate'
import GradientTemplate from '../templates/GradientTemplate'

const TEMPLATES = [
    { id: 'classic',       name: 'Classic',        component: ClassicTemplate,       color: '#3B82F6' },
    { id: 'modern',        name: 'Modern',         component: ModernTemplate,        color: '#6366F1' },
    { id: 'minimal',       name: 'Minimal',        component: MinimalTemplate,       color: '#10B981' },
    { id: 'minimal-image', name: 'Minimal Image',  component: MinimalImageTemplate,  color: '#14B8A6' },
    { id: 'executive',     name: 'Executive',      component: ExecutiveTemplate,     color: '#8B5CF6' },
    { id: 'creative',      name: 'Creative',       component: CreativeTemplate,      color: '#EC4899' },
    { id: 'timeline',      name: 'Timeline',       component: TimelineTemplate,      color: '#F59E0B' },
    { id: 'infographic',   name: 'Infographic',    component: InfographicTemplate,   color: '#EF4444' },
    { id: 'elegant',       name: 'Elegant',        component: ElegantTemplate,       color: '#6B7280' },
    { id: 'tech',          name: 'Tech',           component: TechTemplate,          color: '#0EA5E9' },
    { id: 'professional',  name: 'Professional',   component: ProfessionalTemplate,  color: '#1D4ED8' },
    { id: 'bold',          name: 'Bold',           component: BoldTemplate,          color: '#DC2626' },
    { id: 'compact',       name: 'Compact',        component: CompactTemplate,       color: '#059669' },
    { id: 'academic',      name: 'Academic',       component: AcademicTemplate,      color: '#7C3AED' },
    { id: 'split',         name: 'Split',          component: SplitTemplate,         color: '#D97706' },
    { id: 'card',          name: 'Card',           component: CardTemplate,          color: '#0891B2' },
    { id: 'nordic',        name: 'Nordic',         component: NordicTemplate,        color: '#475569' },
    { id: 'corner',        name: 'Corner',         component: CornerTemplate,        color: '#BE185D' },
    { id: 'strip',         name: 'Strip',          component: StripTemplate,         color: '#16A34A' },
    { id: 'gradient',      name: 'Gradient',       component: GradientTemplate,      color: '#7C3AED' },
]

// Cycle through dummy resumes for variety
const getResumeData = (index) => dummyResumeData[index % dummyResumeData.length]

const TemplateCarousel = () => {
    const [current, setCurrent] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const autoRef = useRef(null)

    const total = TEMPLATES.length

    const prev = () => setCurrent(c => (c - 1 + total) % total)
    const next = () => setCurrent(c => (c + 1) % total)

    // Auto-advance every 3s unless hovered
    useEffect(() => {
        if (isHovered) return
        autoRef.current = setInterval(next, 3000)
        return () => clearInterval(autoRef.current)
    }, [isHovered, current])

    // Visible: current-1, current, current+1 (3 cards)
    const getVisible = () => {
        return [-1, 0, 1].map(offset => {
            const idx = (current + offset + total) % total
            return { ...TEMPLATES[idx], offset, idx }
        })
    }

    const visible = getVisible()

    return (
        <div className="w-full mt-16 mb-4">
            <p className="text-center text-sm text-slate-500 mb-6 font-medium uppercase tracking-widest">
                19 Professional Templates
            </p>

            <div
                className="relative flex items-center justify-center gap-4 overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Prev button */}
                <button
                    onClick={prev}
                    className="absolute left-2 z-20 p-2 bg-white rounded-full shadow-md hover:shadow-lg border border-gray-200 hover:bg-indigo-50 transition-all"
                >
                    <ChevronLeft className="size-5 text-gray-600" />
                </button>

                {/* Cards */}
                <div className="flex items-center justify-center gap-4 w-full max-w-5xl px-12">
                    {visible.map(({ component: Template, name, color, offset, idx }) => {
                        const resumeData = getResumeData(idx)
                        const isCenter = offset === 0

                        return (
                            <div
                                key={idx}
                                className={`relative flex-shrink-0 transition-all duration-500 cursor-pointer rounded-xl overflow-hidden border-2 shadow-lg
                                    ${isCenter
                                        ? 'w-72 scale-100 z-10 border-indigo-400 shadow-indigo-200'
                                        : 'w-52 scale-90 opacity-60 z-0 border-gray-200'
                                    }`}
                                onClick={() => setCurrent(idx)}
                                style={isCenter ? { boxShadow: `0 8px 32px ${color}40` } : {}}
                            >
                                {/* Template name badge */}
                                <div
                                    className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-white text-xs font-semibold shadow"
                                    style={{ backgroundColor: color }}
                                >
                                    {name}
                                </div>

                                {/* Scaled-down template preview */}
                                <div
                                    className="w-full bg-white overflow-hidden"
                                    style={{ height: isCenter ? '380px' : '280px' }}
                                >
                                    <div
                                        style={{
                                            transform: `scale(${isCenter ? 0.36 : 0.26})`,
                                            transformOrigin: 'top left',
                                            width: `${100 / (isCenter ? 0.36 : 0.26)}%`,
                                            pointerEvents: 'none',
                                            userSelect: 'none',
                                        }}
                                    >
                                        <Template
                                            data={{ ...resumeData, template: TEMPLATES.find(t => t.component === Template)?.id }}
                                            accentColor={color}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Next button */}
                <button
                    onClick={next}
                    className="absolute right-2 z-20 p-2 bg-white rounded-full shadow-md hover:shadow-lg border border-gray-200 hover:bg-indigo-50 transition-all"
                >
                    <ChevronRight className="size-5 text-gray-600" />
                </button>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5 mt-5">
                {TEMPLATES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-indigo-500' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default TemplateCarousel
