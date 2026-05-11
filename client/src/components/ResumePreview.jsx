import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import ExecutiveTemplate from './templates/ExecutiveTemplate'
import CreativeTemplate from './templates/CreativeTemplate'
import TimelineTemplate from './templates/TimelineTemplate'
import InfographicTemplate from './templates/InfographicTemplate'
import ElegantTemplate from './templates/ElegantTemplate'
import TechTemplate from './templates/TechTemplate'
import ProfessionalTemplate from './templates/ProfessionalTemplate'
import BoldTemplate from './templates/BoldTemplate'
import CompactTemplate from './templates/CompactTemplate'
import AcademicTemplate from './templates/AcademicTemplate'
import SplitTemplate from './templates/SplitTemplate'
import CardTemplate from './templates/CardTemplate'
import NordicTemplate from './templates/NordicTemplate'
import CornerTemplate from './templates/CornerTemplate'
import StripTemplate from './templates/StripTemplate'
import GradientTemplate from './templates/GradientTemplate'

const normalizeSkills = (skills = []) =>
    skills.map(s => (typeof s === 'string' ? { name: s, level: 3 } : s))

const ResumePreview = ({ data, template, accentColor, classes = "" }) => {
    const normData = { ...data, skills: normalizeSkills(data?.skills) }

    const renderTemplate = () => {
        switch (template) {
            case "modern":         return <ModernTemplate data={normData} accentColor={accentColor} />;
            case "minimal":        return <MinimalTemplate data={normData} accentColor={accentColor} />;
            case "minimal-image":  return <MinimalImageTemplate data={normData} accentColor={accentColor} />;
            case "executive":      return <ExecutiveTemplate data={normData} accentColor={accentColor} />;
            case "creative":       return <CreativeTemplate data={normData} accentColor={accentColor} />;
            case "timeline":       return <TimelineTemplate data={normData} accentColor={accentColor} />;
            case "infographic":    return <InfographicTemplate data={normData} accentColor={accentColor} />;
            case "elegant":        return <ElegantTemplate data={normData} accentColor={accentColor} />;
            case "tech":           return <TechTemplate data={normData} accentColor={accentColor} />;
            case "professional":   return <ProfessionalTemplate data={normData} accentColor={accentColor} />;
            case "bold":           return <BoldTemplate data={normData} accentColor={accentColor} />;
            case "compact":        return <CompactTemplate data={normData} accentColor={accentColor} />;
            case "academic":       return <AcademicTemplate data={normData} accentColor={accentColor} />;
            case "split":          return <SplitTemplate data={normData} accentColor={accentColor} />;
            case "card":           return <CardTemplate data={normData} accentColor={accentColor} />;
            case "nordic":         return <NordicTemplate data={normData} accentColor={accentColor} />;
            case "corner":         return <CornerTemplate data={normData} accentColor={accentColor} />;
            case "strip":          return <StripTemplate data={normData} accentColor={accentColor} />;
            case "gradient":       return <GradientTemplate data={normData} accentColor={accentColor} />;
            default:               return <ClassicTemplate data={normData} accentColor={accentColor} />;
        }
    }

    return (
        <div className='w-full bg-gray-100 print:bg-white'>
            <div id="resume-preview" className={"border border-gray-200 print:border-none " + classes}>
                {renderTemplate()}
            </div>
        </div>
    )
}

export default ResumePreview
