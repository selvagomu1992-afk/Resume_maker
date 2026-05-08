import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import CreativeTemplate from './templates/CreativeTemplate'
import TimelineTemplate from './templates/TimelineTemplate'

const ResumePreview = ({data, template, accentColor, classes = ""}) => {

    const renderTemplate = ()=>{
        switch (template) {
            case "modern":
                return <ModernTemplate data={data} accentColor={accentColor}/>;
            case "minimal":
                return <MinimalTemplate data={data} accentColor={accentColor}/>;
            case "minimal-image":
                return <MinimalImageTemplate data={data} accentColor={accentColor}/>;
            case "creative":
                return <CreativeTemplate data={data} accentColor={accentColor}/>;
            case "timeline":
                return <TimelineTemplate data={data} accentColor={accentColor}/>;

            default:
                return <ClassicTemplate data={data} accentColor={accentColor}/>;
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
