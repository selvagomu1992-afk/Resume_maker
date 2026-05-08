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

// Normalise skills once so every template receives { name, level } objects
const normalizeSkills = (skills = []) =>
    skills.map(s => (typeof s === 'string' ? { name: s, level: 3 } : s))

const ResumePreview = ({data, template, accentColor, classes = ""}) => {

    // Pass normalised data to every template
    const normData = { ...data, skills: normalizeSkills(data?.skills) }

    const renderTemplate = () => {
        switch (template) {
            case "modern":
                return <ModernTemplate data={normData} accentColor={accentColor}/>;
            case "minimal":
                return <MinimalTemplate data={normData} accentColor={accentColor}/>;
            case "minimal-image":
                return <MinimalImageTemplate data={normData} accentColor={accentColor}/>;
            case "executive":
                return <ExecutiveTemplate data={normData} accentColor={accentColor}/>;
            case "creative":
                return <CreativeTemplate data={normData} accentColor={accentColor}/>;
            case "timeline":
                return <TimelineTemplate data={normData} accentColor={accentColor}/>;
            case "infographic":
                return <InfographicTemplate data={normData} accentColor={accentColor}/>;
            case "elegant":
                return <ElegantTemplate data={normData} accentColor={accentColor}/>;
            default:
                return <ClassicTemplate data={normData} accentColor={accentColor}/>;
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
