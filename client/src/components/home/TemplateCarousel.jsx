import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { dummyResumeData } from '../../assets/assets'

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

// Duplicate for seamless infinite loop
const ITEMS = [...TEMPLATES, ...TEMPLATES]

const CARD_WIDTH = 220   // px
const CARD_GAP   = 20    // px
const STEP       = CARD_WIDTH + CARD_GAP

const TemplateCarousel = () => {
    const trackRef  = useRef(null)
    const rafRef    = useRef(null)
    const posRef    = useRef(0)
    const pausedRef = useRef(false)
    const [hoveredIdx, setHoveredIdx] = useState(null)

    const totalWidth = TEMPLATES.length * STEP

    // Animate
    useEffect(() => {
        const speed = 0.5 // px per frame

        const tick = () => {
            if (!pausedRef.current) {
                posRef.current += speed
                // Reset seamlessly when we've scrolled one full set
                if (posRef.current >= totalWidth) {
                    posRef.current -= totalWidth
                }
                if (trackRef.current) {
                    trackRef.current.style.transform = `translateX(-${posRef.current}px)`
                }
            }
            rafRef.current = requestAnimationFrame(tick)
        }

        rafRef.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(rafRef.current)
    }, [totalWidth])

    return (
        <div className="w-full mt-16 mb-4 overflow-hidden">
            <p className="text-center text-xs text-slate-400 mb-6 font-semibold uppercase tracking-widest">
                20 Professional Templates — Pick yours
            </p>

            {/* Track */}
            <div
                className="relative"
                onMouseEnter={() => { pausedRef.current = true }}
                onMouseLeave={() => { pausedRef.current = false; setHoveredIdx(null) }}
            >
                {/* Left fade */}
                <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to right, white, transparent)' }} />
                {/* Right fade */}
                <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to left, white, transparent)' }} />

                <div
                    ref={trackRef}
                    className="flex will-change-transform"
                    style={{ gap: CARD_GAP, paddingLeft: CARD_GAP }}
                >
                    {ITEMS.map(({ component: Template, name, color, id }, i) => {
                        const resumeData = dummyResumeData[i % dummyResumeData.length]
                        const isHovered = hoveredIdx === i

                        return (
                            <div
                                key={i}
                                className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                                style={{
                                    width: CARD_WIDTH,
                                    height: 300,
                                    boxShadow: isHovered
                                        ? `0 16px 40px ${color}50`
                                        : '0 2px 12px rgba(0,0,0,0.08)',
                                    transform: isHovered ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
                                    border: isHovered ? `2px solid ${color}` : '2px solid transparent',
                                }}
                                onMouseEnter={() => setHoveredIdx(i)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            >
                                {/* Template preview — scaled down */}
                                <div className="w-full h-full bg-white overflow-hidden">
                                    <div style={{
                                        transform: 'scale(0.21)',
                                        transformOrigin: 'top left',
                                        width: `${100 / 0.21}%`,
                                        pointerEvents: 'none',
                                        userSelect: 'none',
                                    }}>
                                        <Template data={resumeData} accentColor={color} />
                                    </div>
                                </div>

                                {/* Hover overlay */}
                                <div className={`absolute inset-0 flex flex-col items-center justify-end pb-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                                    style={{ background: `linear-gradient(to top, ${color}ee 0%, transparent 60%)` }}>
                                    <p className="text-white font-bold text-sm mb-2">{name}</p>
                                    <Link
                                        to="/app"
                                        className="text-xs font-semibold px-4 py-1.5 rounded-full bg-white transition-colors"
                                        style={{ color }}
                                    >
                                        Use Template →
                                    </Link>
                                </div>

                                {/* Name badge (always visible) */}
                                <div className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full text-white transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                                    style={{ backgroundColor: color + 'dd' }}>
                                    {name}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default TemplateCarousel
