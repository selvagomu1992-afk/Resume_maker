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
import jsPDF from 'jspdf'
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
      // html-to-image supports modern CSS (oklch, etc.) unlike html2canvas
      const imgData = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      })

      const img = new Image()
      img.src = imgData
      await new Promise(resolve => { img.onload = resolve })

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()   // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight() // 297mm
      const imgAspect = img.height / img.width
      const imgHeightMm = pdfWidth * imgAspect

      // If content fits on one page
      if (imgHeightMm <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightMm)
      } else {
        // Multi-page: slice image across pages
        const pageCanvas = document.createElement('canvas')
        const scale = 2
        const pageHeightPx = Math.floor((pdfHeight / pdfWidth) * img.width * scale)
        pageCanvas.width = img.width * scale
        const ctx = pageCanvas.getContext('2d')
        let yOffset = 0
        let page = 0

        while (yOffset < img.height * scale) {
          pageCanvas.height = Math.min(pageHeightPx, img.height * scale - yOffset)
          ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height)
          ctx.drawImage(img, 0, -yOffset)
          const pageData = pageCanvas.toDataURL('image/png')
          if (page > 0) pdf.addPage()
          pdf.addImage(pageData, 'PNG', 0, 0, pdfWidth, (pageCanvas.height / pageCanvas.width) * pdfWidth)
          yOffset += pageHeightPx
          page++
        }
      }

      pdf.save(`${resumeData.title || 'resume'}.pdf`)
      toast.success('PDF downloaded!', { id: toastId })
    } catch (err) {
      console.error('PDF generation failed:', err)
      toast.error('Failed to generate PDF: ' + err.message, { id: toastId })
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
            <div className='relative w-full'>
              <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                {/* Share button — always visible after paid */}
                {(resumeData.public || isPaid) && (
                  <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                    <Share2Icon className='size-4' /> Share
                  </button>
                )}
                <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors'>
                  {resumeData.public ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
                  {resumeData.public ? 'Public' : 'Private'}
                </button>
                {/* Show nothing until page is ready to avoid flash of wrong button */}
                {pageReady && (
                  <>
                    {isPaid && (
                      <button
                        onClick={downloadResume}
                        className='flex items-center gap-2 px-5 py-2 text-xs rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white shadow-sm hover:from-green-600 hover:to-green-700 transition-all'
                      >
                        <DownloadIcon className='size-4' /> Download PDF
                      </button>
                    )}
                    {!isPaid && (
                      <button
                        onClick={goToPayment}
                        className='flex items-center gap-2 px-5 py-2 text-xs rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-sm hover:from-indigo-600 hover:to-indigo-700 transition-all'
                      >
                        <span className='text-base leading-none'>₹</span> Pay ₹49
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
          </div>
        </div>
      </div>

    </div>
  )
}

export default ResumeBuilder
