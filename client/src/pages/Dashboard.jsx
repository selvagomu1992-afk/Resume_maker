import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { dummyResumeData } from '../assets/assets'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'

const Dashboard = () => {

  const {user, token} = useSelector(state => state.auth)

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]
  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(preselectedTemplate || 'classic')

  const TEMPLATE_OPTIONS = [
    { id: 'classic', name: 'Classic', color: '#3B82F6' },
    { id: 'modern', name: 'Modern', color: '#6366F1' },
    { id: 'gradient', name: 'Gradient', color: '#7C3AED' },
    { id: 'executive', name: 'Executive', color: '#8B5CF6' },
    { id: 'creative', name: 'Creative', color: '#EC4899' },
    { id: 'elegant', name: 'Elegant', color: '#6B7280' },
    { id: 'infographic', name: 'Infographic', color: '#EF4444' },
    { id: 'tech', name: 'Tech', color: '#0EA5E9' },
    { id: 'split', name: 'Split', color: '#D97706' },
    { id: 'card', name: 'Card', color: '#0891B2' },
    { id: 'bold', name: 'Bold', color: '#DC2626' },
    { id: 'professional', name: 'Professional', color: '#1D4ED8' },
    { id: 'timeline', name: 'Timeline', color: '#F59E0B' },
    { id: 'minimal-image', name: 'Minimal Image', color: '#14B8A6' },
    { id: 'minimal', name: 'Minimal', color: '#10B981' },
    { id: 'nordic', name: 'Nordic', color: '#475569' },
    { id: 'academic', name: 'Academic', color: '#7C3AED' },
    { id: 'compact', name: 'Compact', color: '#059669' },
    { id: 'corner', name: 'Corner', color: '#BE185D' },
    { id: 'strip', name: 'Strip', color: '#16A34A' },
  ]

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // If user came from carousel with ?template=xxx, auto-open create modal
  const preselectedTemplate = searchParams.get('template')

  useEffect(() => {
    if (preselectedTemplate) {
      setShowCreateResume(true)
    }
  }, [preselectedTemplate])

  const loadAllResumes = async () =>{
    try {
      const { data } = await api.get('/api/users/resumes', {headers: { Authorization: token }})
      setAllResumes(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const createResume = async (event) => {
   try {
    event.preventDefault()
    const { data } = await api.post('/api/resumes/create', {title}, {headers: { Authorization: token }})
    setAllResumes([...allResumes, data.resume])
    setTitle('')
    setShowCreateResume(false)

    // If a template was preselected from the carousel, apply it immediately
    if (selectedTemplate) {
      await api.put('/api/resumes/update', {
        resumeId: data.resume._id,
        resumeData: JSON.stringify({ template: selectedTemplate })
      }, { headers: { Authorization: token } })
    }

    navigate(`/app/builder/${data.resume._id}`)
   } catch (error) {
    toast.error(error?.response?.data?.message || error.message)
   }
  }

  const uploadResume = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const resumeText = await pdfToText(resume)
      const { data } = await api.post('/api/ai/upload-resume', {title, resumeText}, {headers: { Authorization: token }})
      setTitle('')
      setResume(null)
      setShowUploadResume(false)
      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    setIsLoading(false)
  }

  const editTitle = async (event) => {
    try {
      event.preventDefault()
      const {data} = await api.put(`/api/resumes/update`, {resumeId: editResumeId, resumeData: { title }}, {headers: { Authorization: token }})
      setAllResumes(allResumes.map(resume => resume._id === editResumeId ? { ...resume, title } : resume))
      setTitle('')
      setEditResumeId('')
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
     
  }

  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this resume?')
     if(confirm){
      const {data} = await api.delete(`/api/resumes/delete/${resumeId}`, {headers: { Authorization: token }})
      setAllResumes(allResumes.filter(resume => resume._id !== resumeId))
      toast.success(data.message)
     }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
     
  }

  useEffect(()=>{
    loadAllResumes()
  },[])

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8'>

        <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>Welcome, {user?.name}</p>

        <div className='flex gap-4 '>
            <button onClick={()=> setShowCreateResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <PlusIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500  text-white rounded-full'/>
              <p className='text-sm group-hover:text-indigo-600 transition-all duration-300'>Create Resume</p>
            </button>
            <button onClick={()=> setShowUploadResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <UploadCloudIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500  text-white rounded-full'/>
              <p className='text-sm group-hover:text-purple-600 transition-all duration-300'>Upload Existing</p>
            </button>
        </div>

      <hr className='border-slate-300 my-6 sm:w-[305px]' />

      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4 ">
        {allResumes.map((resume, index)=>{
          const baseColor = colors[index % colors.length];
          return (
            <button key={index} onClick={()=> navigate(`/app/builder/${resume._id}`)} className='relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer' style={{background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`, borderColor: baseColor + '40'}}>

              <FilePenLineIcon className="size-7 group-hover:scale-105 transition-all " style={{ color: baseColor }}/>
              <p className='text-sm group-hover:scale-105 transition-all  px-2 text-center' style={{ color: baseColor }}>{resume.title}</p>
              <p className='absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center' style={{ color: baseColor + '90' }}>
                 Updated on {new Date(resume.updatedAt).toLocaleDateString()}
              </p>
              <div onClick={e=> e.stopPropagation()} className='absolute top-1 right-1 group-hover:flex items-center hidden'>
                <TrashIcon onClick={()=>deleteResume(resume._id)} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"/>
                <PencilIcon onClick={()=> {setEditResumeId(resume._id); setTitle(resume.title)}} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"/>
              </div>
            </button>
          )
        })}
      </div>

        {showCreateResume && (
          <form onSubmit={createResume} onClick={()=> setShowCreateResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center p-4'>
            <div onClick={e => e.stopPropagation()} className='relative bg-white border shadow-xl rounded-2xl w-full max-w-4xl flex overflow-hidden max-h-[90vh]'>

              {/* Left — Form + Template Grid */}
              <div className='flex-1 p-6 overflow-y-auto'>
                <h2 className='text-xl font-bold mb-1'>Create a Resume</h2>
                <p className='text-sm text-gray-500 mb-4'>Choose a template and enter a title</p>

                <input onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2.5 mb-4 focus:border-indigo-600 ring-indigo-600 text-sm' required/>

                {/* Template grid */}
                <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>Select Template</p>
                <div className='grid grid-cols-4 sm:grid-cols-5 gap-2 mb-4 max-h-[240px] overflow-y-auto pr-1'>
                  {TEMPLATE_OPTIONS.map(t => (
                    <button
                      key={t.id}
                      type='button'
                      onClick={() => setSelectedTemplate(t.id)}
                      className={`relative p-2 rounded-lg border-2 text-center transition-all ${selectedTemplate === t.id ? 'border-indigo-500 bg-indigo-50 scale-105' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className='w-full h-8 rounded mb-1' style={{ backgroundColor: t.color + '30' }}>
                        <div className='w-full h-2 rounded-t' style={{ backgroundColor: t.color }} />
                      </div>
                      <span className='text-xs font-medium text-gray-700 block truncate'>{t.name}</span>
                      {selectedTemplate === t.id && (
                        <div className='absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center'>
                          <span className='text-white text-xs'>✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <button className='w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium'>
                  Create Resume
                </button>
              </div>

              {/* Right — Template Preview (static visual) */}
              <div className='hidden md:flex w-64 bg-gray-100 border-l border-gray-200 p-4 flex-col items-center justify-center'>
                <div className='w-full rounded-xl overflow-hidden border-2 shadow-lg bg-white' style={{ borderColor: TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.color || '#3B82F6' }}>
                  {/* Static template mockup */}
                  <div className='h-3 w-full' style={{ backgroundColor: TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.color || '#3B82F6' }} />
                  <div className='p-4 space-y-3'>
                    <div className='h-4 w-3/4 rounded bg-gray-200' />
                    <div className='h-2 w-1/2 rounded' style={{ backgroundColor: (TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.color || '#3B82F6') + '40' }} />
                    <div className='space-y-1.5 mt-4'>
                      <div className='h-2 w-full rounded bg-gray-100' />
                      <div className='h-2 w-5/6 rounded bg-gray-100' />
                      <div className='h-2 w-4/6 rounded bg-gray-100' />
                    </div>
                    <div className='flex gap-2 mt-4'>
                      <div className='h-6 w-6 rounded' style={{ backgroundColor: (TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.color || '#3B82F6') + '30' }} />
                      <div className='h-6 w-6 rounded' style={{ backgroundColor: (TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.color || '#3B82F6') + '30' }} />
                      <div className='h-6 w-6 rounded' style={{ backgroundColor: (TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.color || '#3B82F6') + '30' }} />
                      <div className='h-6 w-6 rounded' style={{ backgroundColor: (TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.color || '#3B82F6') + '30' }} />
                      <div className='h-6 w-6 rounded' style={{ backgroundColor: (TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.color || '#3B82F6') + '30' }} />
                    </div>
                    <div className='space-y-1.5 mt-4'>
                      <div className='h-2 w-full rounded bg-gray-100' />
                      <div className='h-2 w-3/4 rounded bg-gray-100' />
                    </div>
                  </div>
                </div>
                <p className='text-sm font-bold mt-3 capitalize' style={{ color: TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.color || '#3B82F6' }}>
                  {selectedTemplate?.replace('-', ' ')} Template
                </p>
                <p className='text-xs text-gray-400 mt-1'>Preview available in builder</p>
              </div>

              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=> {setShowCreateResume(false); setTitle('')}}/>
            </div>
          </form>
        )
        }

        {showUploadResume && (
          <form onSubmit={uploadResume} onClick={()=> setShowUploadResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>Upload Resume</h2>
              <input onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-indigo-600 ring-indigo-600' required/>
                <div>
                  <label htmlFor="resume-input" className="block text-sm text-slate-700">
                    Select resume file
                    <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-indigo-500 hover:text-indigo-700 cursor-pointer transition-colors'>
                      {resume ? (
                        <p className='text-indigo-700'>{resume.name}</p>
                      ) : (
                        <>
                          <UploadCloud className='size-14 stroke-1'/>
                          <p>Upload resume</p>
                        </>
                      )}
                    </div>
                  </label>
                  <input type="file" id='resume-input' accept='.pdf' hidden onChange={(e)=> setResume(e.target.files[0])}/>
                </div>
              <button disabled={isLoading} className='w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2'>
                {isLoading && <LoaderCircleIcon className='animate-spin size-4 text-white'/>}
                {isLoading ? 'Uploading...' : 'Upload Resume'}
                
                </button>
              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=> {setShowUploadResume(false); setTitle('')}}/>
            </div>
          </form>
        )
        }

        {editResumeId && (
          <form onSubmit={editTitle} onClick={()=> setEditResumeId('')} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>Edit Resume Title</h2>
              <input onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-indigo-600 ring-indigo-600' required/>

              <button className='w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors'>Update</button>
              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=> {setEditResumeId(''); setTitle('')}}/>
            </div>
          </form>
        )
        }
      
      </div>
    </div>
  )
}

export default Dashboard
