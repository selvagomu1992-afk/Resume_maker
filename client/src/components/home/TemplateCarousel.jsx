import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronUp, ChevronDown } from 'lucide-react'
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
    { id: 'gradient',      name: 'Gradient',       component: GradientTemplate,      color: '#7C3AED' },
    { id: 'executive',     name: 'Executive',      component: ExecutiveTemplate,     color: '#8B5CF6' },
    { id: 'creative',      name: 'Creative',       component: CreativeTemplate,      color: '#EC4899' },
    { id: 'elegant',       name: 'Elegant',        component: ElegantTemplate,       color: '#6B7280' },
    { id: 'infographic',   name: 'Infographic',    component: InfographicTemplate,   color: '#EF4444' },
    { id: 'tech',          name: 'Tech',           component: TechTemplate,          color: '#0EA5E9' },
    { id: 'split',         name: 'Split',          component: SplitTemplate,         color: '#D97706' },
    { id: 'card',          name: 'Card',           component: CardTemplate,          color: '#0891B2' },
    { id: 'bold',          name: 'Bold',           component: BoldTemplate,          color: '#DC2626' },
    { id: 'professional',  name: 'Professional',   component: ProfessionalTemplate,  color: '#1D4ED8' },
    { id: 'timeline',      name: 'Timeline',       component: TimelineTemplate,      color: '#F59E0B' },
    { id: 'minimal-image', name: 'Minimal Image',  component: MinimalImageTemplate,  color: '#14B8A6' },
    { id: 'minimal',       name: 'Minimal',        component: MinimalTemplate,       color: '#10B981' },
    { id: 'nordic',        name: 'Nordic',         component: NordicTemplate,        color: '#475569' },
    { id: 'academic',      name: 'Academic',       component: AcademicTemplate,      color: '#7C3AED' },
    { id: 'compact',       name: 'Compact',        component: CompactTemplate,       color: '#059669' },
    { id: 'corner',        name: 'Corner',         component: CornerTemplate,        color: '#BE185D' },
    { id: 'strip',         name: 'Strip',          component: StripTemplate,         color: '#16A34A' },
]

const TemplateCarousel = () => {
    const [active, setActive] = useState(0)
    const [animating, setAnimating] = useState(false)
    const [direction, setDirection] = useState('down')
    const autoRef = useRef(null)
    const thumbListRef = useRef(null)

    const total = TEMPLATES.length

    const goTo = useCallback((idx, dir = 'down') => {
        if (animating) return
        setDirection(dir)
        setAnimating(true)
        setTimeout(() => {
            setActive(idx)
            setAnimating(false)
        }, 280)
    }, [animating])

    const next = useCallback(() => goTo((active + 1) % total, 'down'), [active, total, goTo])
    const prev = useCallback(() => goTo((active - 1 + total) % total, 'up'), [active, total, goTo])

    // Auto-advance every 3.5s
    useEffect(() => {
        autoRef.current = setInterval(next, 3500)
        return () => clearInterval(autoRef.current)
    }, [next])

    // Scroll thumbnail into view
    useEffect(() => {
        if (thumbListRef.current) {
            const el = thumbListRef.current.children[active]
            if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
    }, [active])

    const { component: ActiveTemplate, name, color, id } = TEMPLATES[active]
    const resumeData = dummyResumeData[active % dummyResumeData.length]

    const slideClass = animating
        ? direction === 'down'
            ? 'opacity-0 translate-y-4'
            : 'opacity-0 -translate-y-4'
        : 'opacity-100 translate-y-0'

    return (
        <div className="w-full mt-16 mb-4">
            <p className="text-center text-xs text-slate-400 mb-8 font-semibold uppercase tracking-widest">
                20 Professional Templates
            </p>

            <div className="flex gap-6 max-w-5xl mx-auto px-4">

                {/* ── LEFT: Large preview ── */}
                <div className="flex-1 relative">
                    {/* Glow */}
                    <div className="absolute inset-0 rounded-2xl blur-2xl opacity-20 transition-all duration-700"
                        style={{ backgroundColor: color }} />

                    {/* Preview card */}
                    <div className="relative rounded-2xl overflow-hidden border-2 shadow-xl transition-all duration-500"
                        style={{ borderColor: color, boxShadow: `0 8px 40px ${color}30` }}>

                        {/* Header bar */}
                        <div className="flex items-center justify-between px-4 py-2.5 text-white"
                            style={{ backgroundColor: color }}>
                            <span className="text-sm font-bold tracking-wide">{name}</span>
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-white/30" />
                                <div className="w-3 h-3 rounded-full bg-white/30" />
                                <div className="w-3 h-3 rounded-full bg-white/30" />
                            </div>
                        </div>

                        {/* Template preview */}
                        <div className="bg-white overflow-hidden" style={{ height: 420 }}>
                            <div className={`transition-all duration-280 ease-out ${slideClass}`}
                                style={{
                                    transform: `scale(0.42) ${animating ? (direction === 'down' ? 'translateY(16px)' : 'translateY(-16px)') : 'translateY(0)'}`,
                                    transformOrigin: 'top left',
                                    width: `${100 / 0.42}%`,
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                }}>
                                <ActiveTemplate data={resumeData} accentColor={color} />
                            </div>
                        </div>

                        {/* CTA overlay at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between"
                            style={{ background: `linear-gradient(to top, ${color}f0, transparent)` }}>
                            <div>
                                <p className="text-white font-bold text-sm">{name} Template</p>
                                <p className="text-white/70 text-xs">{active + 1} of {total}</p>
                            </div>
                            <Link to="/app"
                                className="text-xs font-bold px-4 py-2 rounded-full bg-white shadow transition-transform hover:scale-105"
                                style={{ color }}>
                                Use This →
                            </Link>
                        </div>
                    </div>

                    {/* Prev / Next arrows */}
                    <div className="flex justify-center gap-3 mt-4">
                        <button onClick={prev}
                            className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition-all hover:scale-110">
                            <ChevronUp className="size-4 text-gray-600" />
                        </button>
                        {/* Progress dots */}
                        <div className="flex items-center gap-1">
                            {TEMPLATES.map((_, i) => (
                                <button key={i} onClick={() => goTo(i, i > active ? 'down' : 'up')}
                                    className="rounded-full transition-all duration-300"
                                    style={{
                                        width: i === active ? 20 : 6,
                                        height: 6,
                                        backgroundColor: i === active ? color : '#d1d5db',
                                    }} />
                            ))}
                        </div>
                        <button onClick={next}
                            className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition-all hover:scale-110">
                            <ChevronDown className="size-4 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* ── RIGHT: Scrollable thumbnail list ── */}
                <div className="w-36 flex flex-col gap-2 relative">
                    <div className="absolute top-0 left-0 right-0 h-6 z-10 pointer-events-none"
                        style={{ background: 'linear-gradient(to bottom, white, transparent)' }} />
                    <div className="absolute bottom-0 left-0 right-0 h-6 z-10 pointer-events-none"
                        style={{ background: 'linear-gradient(to top, white, transparent)' }} />

                    <div ref={thumbListRef}
                        className="flex flex-col gap-2 overflow-y-auto max-h-[480px] pr-1 scroll-smooth"
                        style={{ scrollbarWidth: 'none' }}>
                        {TEMPLATES.map(({ component: T, name: n, color: c, id: tid }, i) => {
                            const rd = dummyResumeData[i % dummyResumeData.length]
                            const isActive = i === active
                            return (
                                <button key={i}
                                    onClick={() => goTo(i, i > active ? 'down' : 'up')}
                                    className="relative flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer"
                                    style={{
                                        height: 90,
                                        borderColor: isActive ? c : 'transparent',
                                        boxShadow: isActive ? `0 4px 16px ${c}40` : '0 1px 4px rgba(0,0,0,0.08)',
                                        transform: isActive ? 'scale(1.04)' : 'scale(1)',
                                    }}>
                                    {/* Mini preview */}
                                    <div className="w-full h-full bg-white overflow-hidden">
                                        <div style={{
                                            transform: 'scale(0.14)',
                                            transformOrigin: 'top left',
                                            width: `${100 / 0.14}%`,
                                            pointerEvents: 'none',
                                            userSelect: 'none',
                                        }}>
                                            <T data={rd} accentColor={c} />
                                        </div>
                                    </div>
                                    {/* Name label */}
                                    <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 text-center"
                                        style={{ background: isActive ? c : 'rgba(0,0,0,0.45)' }}>
                                        <span className="text-white text-[9px] font-semibold truncate block">{n}</span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TemplateCarousel
