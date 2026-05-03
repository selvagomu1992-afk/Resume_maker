import React, { useEffect, useState, useRef } from 'react'
import { Link, useParams, useNavigate, useSearchParams }  from 'react-router-dom'
//import { dummyResumeData } from '../assets/assets'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import { useSelector } from 'react-redux'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ResumeBuilder = () => {

  const { resumeId } = useParams()
  const { token } = useSelector(state => state.auth)
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const paymentVerified = useRef(false)

  const [isPaid, setIsPaid] = useState(false)
  const [pageReady, setPageReady] = useState(false)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
    isPaid: false,
  })

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/get/' + resumeId, { headers: { Authorization: token } })
      if (data.resume) {
        setResumeData(data.resume)
        setIsPaid(!!data.resume.isPaid)
        document.title = data.resume.title;
        return data.resume
      }
    } catch (error) {
      console.log(error.message)
    }
    return null
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ]

  const activeSection = sections[activeSectionIndex]

  useEffect(() => {
    const orderId = searchParams.get('order_id')

    const init = async () => {
      // Load resume from DB first
      const resume = await loadExistingResume()

      // Already paid in DB — show Download button immediately
      if (resume?.isPaid) {
        setIsPaid(true)
        setPageReady(true)
        return
      }

      // If order_id is in URL, Cashfree redirected back after payment — verify it
      if (orderId && !paymentVerified.current) {
        paymentVerified.current = true
        try {
          const { data } = await api.post('/api/payment/verify', { orderId, resumeId })
          if (data.isPaid) {
            setIsPaid(true)
            toast.success('Payment successful! Click Download PDF to save your resume.')
          } else {
            toast.error('Payment not completed. Please try again.')
          }
        } catch (err) {
          console.error('Verify failed:', err.message)
          toast.error('Could not confirm payment. Please refresh.')
        }
      }

      setPageReady(true)
    }

    init()
  }, [])
  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData()
      formData.append("resumeId", resumeId)
      formData.append("resumeData", JSON.stringify({ public: !resumeData.public }))

      const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: token } })

      setResumeData({ ...resumeData, public: !resumeData.public })
      toast.success(data.message)
    } catch (error) {
      console.error("Error saving resume:", error)
    }
  }
  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume", })
    } else {
      alert('Share not supported on this browser.')
    }
  }

  const downloadResume = async () => {
    const element = document.getElementById('resume-preview')
    if (!element) return

    const toastId = toast.loading('Generating PDF...')
    try {
      // Capture as PNG — html-to-image handles oklch/Tailwind v4 colors correctly
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      })

      const img = new Image()
      img.src = dataUrl
      await new Promise(resolve => { img.onload = resolve })

      // A4 size in mm
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()   // 210mm
      const pageH = pdf.internal.pageSize.getHeight()  // 297mm

      const imgAspect = img.height / img.width
      const imgH = pageW * imgAspect

      if (imgH <= pageH) {
        // Single page
        pdf.addImage(dataUrl, 'PNG', 0, 0, pageW, imgH)
      } else {
        // Multi-page: slice the image across A4 pages
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const sliceH = Math.floor((pageH / imgH) * img.height)
        canvas.width = img.width
        let yOffset = 0
        let first = true

        while (yOffset < img.height) {
          const h = Math.min(sliceH, img.height - yOffset)
          canvas.height = h
          ctx.clearRect(0, 0, canvas.width, h)
          ctx.drawImage(img, 0, yOffset, img.width, h, 0, 0, img.width, h)
          const slice = canvas.toDataURL('image/png')
          if (!first) pdf.addPage()
          pdf.addImage(slice, 'PNG', 0, 0, pageW, (h / img.width) * pageW)
          yOffset += h
          first = false
        }
      }

      pdf.save(`${resumeData.title || 'resume'}.pdf`)
      toast.success('PDF downloaded!', { id: toastId })
    } catch (err) {
      console.error('PDF generation failed:', err)
      toast.error('Failed: ' + err.message, { id: toastId })
    }
  }
  const goToPayment = () => navigate(`/payment/${resumeId}`)

  const saveResume = async () => {
    try {
      let updatedResumeData = structuredClone(resumeData)

      // remove image from updatedResumeData
      if (typeof resumeData.personal_info.image === 'object') {
        delete updatedResumeData.personal_info.image
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId)
      formData.append('resumeData', JSON.stringify(updatedResumeData))
      removeBackground && formData.append("removeBackground", "yes");
      typeof resumeData.personal_info.image === 'object' && formData.append("image", resumeData.personal_info.image)

      const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: token } })

      // Preserve isPaid from current state — server protects it but keep client in sync
      setResumeData(prev => ({ ...data.resume, isPaid: prev.isPaid }))
      toast.success(data.message)
    } catch (error) {
      console.error("Error saving resume:", error)
    }
  }

  return (
    <div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          {/* Left Panel - Form */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              {/* progress bar using activeSectionIndex */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr className="absolute top-0 left-0  h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 border-none transition-all duration-2000" style={{ width: `${activeSectionIndex * 100 / (sections.length - 1)}%` }} />

              {/* Section Navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">

                <div className='flex items-center gap-2'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData(prev => ({ ...prev, template }))} />
                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(color) => setResumeData(prev => ({ ...prev, accent_color: color }))} />
                </div>

                <div className='flex items-center'>
                  {activeSectionIndex !== 0 && (
                    <button onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex === 0}>
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}
                  <button onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1}>
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className='space-y-6'>
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm data={resumeData.personal_info} onChange={(data) => setResumeData(prev => ({ ...prev, personal_info: data }))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                )}
                {activeSection.id === 'summary' && (
                  <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))} setResumeData={setResumeData} />
                )}
                {activeSection.id === 'experience' && (
                  <ExperienceForm data={resumeData.experience} onChange={(data) => setResumeData(prev => ({ ...prev, experience: data }))} />
                )}
                {activeSection.id === 'education' && (
                  <EducationForm data={resumeData.education} onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))} />
                )}
                {activeSection.id === 'projects' && (
                  <ProjectForm data={resumeData.project} onChange={(data) => setResumeData(prev => ({ ...prev, project: data }))} />
                )}
                {activeSection.id === 'skills' && (
                  <SkillsForm data={resumeData.skills} onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))} />
                )}

              </div>
              <button onClick={() => { toast.promise(saveResume, { loading: 'Saving...' }) }} className='bg-gradient-to-br from-indigo-100 to-indigo-200 ring-indigo-300 text-indigo-600 ring hover:ring-indigo-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
                Save Changes
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className='lg:col-span-7 max-lg:mt-6'>
            {/* Action buttons — row above preview, wraps on mobile */}
            <div className='flex flex-wrap items-center justify-end gap-2 mb-3'>
              {/* Share */}
              {(resumeData.public || isPaid) && (
                <button onClick={handleShare} className='flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors'>
                  <Share2Icon className='size-3.5' /> Share
                </button>
              )}
              {/* Public / Private toggle */}
              <button onClick={changeResumeVisibility} className='flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors'>
                {resumeData.public ? <EyeIcon className='size-3.5' /> : <EyeOffIcon className='size-3.5' />}
                {resumeData.public ? 'Public' : 'Private'}
              </button>
              {/* Pay / Download */}
              {pageReady && (
                isPaid ? (
                  <button onClick={downloadResume} className='flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
                    <DownloadIcon className='size-3.5' /> Download PDF
                  </button>
                ) : (
                  <button onClick={goToPayment} className='flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors'>
                    <span className='text-sm leading-none'>₹</span> Pay ₹49
                  </button>
                )
              )}
            </div>

            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
          </div>
        </div>
      </div>

    </div>
  )
}

export default ResumeBuilder
