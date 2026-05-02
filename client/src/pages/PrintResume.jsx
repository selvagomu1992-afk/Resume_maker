import React, { useEffect, useState } from 'react'
import ResumePreview from '../components/ResumePreview'

const PrintResume = () => {
  const [resumeData, setResumeData] = useState(null)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('print_resume')
      if (stored) {
        setResumeData(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load resume for print', e)
    }
  }, [])

  useEffect(() => {
    if (!resumeData) return
    // Small delay to let the DOM render fully before printing
    const timer = setTimeout(() => {
      window.print()
      // Close tab after print dialog closes
      window.onafterprint = () => window.close()
    }, 500)
    return () => clearTimeout(timer)
  }, [resumeData])

  if (!resumeData) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-gray-500'>Loading resume...</p>
      </div>
    )
  }

  return (
    <div>
      <ResumePreview
        data={resumeData}
        template={resumeData.template}
        accentColor={resumeData.accent_color}
      />
    </div>
  )
}

export default PrintResume
