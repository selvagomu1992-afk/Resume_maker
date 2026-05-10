import { Plus, Trash2, Info, Award, Heart, Users, Star, BookOpen } from 'lucide-react'
import React, { useState } from 'react'

const CATEGORIES = [
    { label: 'Certification',  icon: '🏅', color: '#3B82F6' },
    { label: 'Award',          icon: '🏆', color: '#F59E0B' },
    { label: 'Volunteer',      icon: '🤝', color: '#10B981' },
    { label: 'Hobby',          icon: '🎯', color: '#8B5CF6' },
    { label: 'Publication',    icon: '📖', color: '#EC4899' },
    { label: 'Reference',      icon: '👤', color: '#6B7280' },
    { label: 'Other',          icon: '✨', color: '#14B8A6' },
]

const empty = () => ({
    category: CATEGORIES[0].label,
    title: '',
    subtitle: '',
    date: '',
    description: '',
})

const AdditionalInfoForm = ({ data, onChange }) => {
    const [adding, setAdding] = useState(false)
    const [form, setForm] = useState(empty())
    const [editIndex, setEditIndex] = useState(null)

    const items = data || []
    const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

    const save = () => {
        if (!form.title.trim()) return
        if (editIndex !== null) {
            onChange(items.map((item, i) => i === editIndex ? form : item))
            setEditIndex(null)
        } else {
            onChange([...items, form])
        }
        setForm(empty())
        setAdding(false)
    }

    const remove = (i) => onChange(items.filter((_, idx) => idx !== i))

    const startEdit = (i) => {
        setForm({ ...items[i] })
        setEditIndex(i)
        setAdding(true)
    }

    const cancel = () => { setForm(empty()); setAdding(false); setEditIndex(null) }

    const cat = CATEGORIES.find(c => c.label === form.category) || CATEGORIES[0]

    return (
        <div className='space-y-4'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                    <Info className='size-5 text-teal-500' /> Additional Information
                    <span className='text-xs font-normal text-gray-400'>(Optional)</span>
                </h3>
                <p className='text-sm text-gray-500'>Certifications, awards, hobbies, volunteer work, references</p>
            </div>

            {/* Items list */}
            {items.length > 0 && (
                <div className='space-y-2'>
                    {items.map((item, i) => {
                        const c = CATEGORIES.find(c => c.label === item.category) || CATEGORIES[6]
                        return (
                            <div key={i} className='flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg'>
                                <span className='text-xl mt-0.5'>{c.icon}</span>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center gap-2 flex-wrap'>
                                        <span className='text-xs font-semibold px-2 py-0.5 rounded-full text-white' style={{ backgroundColor: c.color }}>{item.category}</span>
                                        <span className='text-sm font-medium text-gray-800'>{item.title}</span>
                                        {item.date && <span className='text-xs text-gray-400'>{item.date}</span>}
                                    </div>
                                    {item.subtitle && <p className='text-xs text-gray-500 mt-0.5'>{item.subtitle}</p>}
                                    {item.description && <p className='text-xs text-gray-500 mt-0.5'>{item.description}</p>}
                                </div>
                                <div className='flex gap-1 shrink-0'>
                                    <button onClick={() => startEdit(i)} className='p-1 rounded hover:bg-blue-100 text-gray-400 hover:text-blue-500 transition-colors text-xs'>✏️</button>
                                    <button onClick={() => remove(i)} className='p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors'>
                                        <Trash2 className='size-3.5' />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Add form */}
            {adding ? (
                <div className='border border-teal-200 rounded-xl p-4 space-y-3 bg-teal-50/30'>
                    {/* Category */}
                    <div>
                        <label className='text-xs font-semibold text-gray-600 mb-1.5 block'>Category</label>
                        <div className='grid grid-cols-2 gap-1.5'>
                            {CATEGORIES.map(c => (
                                <button
                                    key={c.label}
                                    onClick={() => set('category', c.label)}
                                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs border-2 transition-all ${form.category === c.label ? 'font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                    style={form.category === c.label ? { borderColor: c.color, color: c.color, backgroundColor: c.color + '15' } : {}}
                                >
                                    <span>{c.icon}</span> {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className='text-xs font-semibold text-gray-600 mb-1 block'>Title *</label>
                        <input
                            type='text'
                            placeholder={
                                form.category === 'Certification' ? 'e.g. AWS Certified Solutions Architect' :
                                form.category === 'Award' ? 'e.g. Employee of the Year' :
                                form.category === 'Volunteer' ? 'e.g. Community Tutor' :
                                form.category === 'Hobby' ? 'e.g. Photography, Chess' :
                                form.category === 'Reference' ? 'e.g. John Smith' :
                                'Title'
                            }
                            value={form.title}
                            onChange={e => set('title', e.target.value)}
                            className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300'
                        />
                    </div>

                    {/* Subtitle + Date row */}
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <label className='text-xs font-semibold text-gray-600 mb-1 block'>
                                {form.category === 'Certification' ? 'Issuer' :
                                 form.category === 'Award' ? 'Awarded by' :
                                 form.category === 'Volunteer' ? 'Organization' :
                                 form.category === 'Reference' ? 'Position / Company' :
                                 'Subtitle'} <span className='font-normal text-gray-400'>(optional)</span>
                            </label>
                            <input
                                type='text'
                                placeholder={
                                    form.category === 'Certification' ? 'e.g. Amazon Web Services' :
                                    form.category === 'Award' ? 'e.g. Company Name' :
                                    form.category === 'Reference' ? 'e.g. Senior Manager, Google' :
                                    'Subtitle'
                                }
                                value={form.subtitle}
                                onChange={e => set('subtitle', e.target.value)}
                                className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300'
                            />
                        </div>
                        <div>
                            <label className='text-xs font-semibold text-gray-600 mb-1 block'>Date <span className='font-normal text-gray-400'>(optional)</span></label>
                            <input
                                type='text'
                                placeholder='e.g. 2024, Jan 2023'
                                value={form.date}
                                onChange={e => set('date', e.target.value)}
                                className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300'
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className='text-xs font-semibold text-gray-600 mb-1 block'>Description <span className='font-normal text-gray-400'>(optional)</span></label>
                        <textarea
                            rows={2}
                            placeholder='Brief description...'
                            value={form.description}
                            onChange={e => set('description', e.target.value)}
                            className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none'
                        />
                    </div>

                    <div className='flex gap-2 pt-1'>
                        <button onClick={save} disabled={!form.title.trim()} className='flex-1 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50'>
                            {editIndex !== null ? 'Update' : 'Add'}
                        </button>
                        <button onClick={cancel} className='px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors'>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setAdding(true)}
                    className='w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-teal-300 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors text-sm font-medium'
                >
                    <Plus className='size-4' /> Add Additional Info
                </button>
            )}
        </div>
    )
}

export default AdditionalInfoForm
