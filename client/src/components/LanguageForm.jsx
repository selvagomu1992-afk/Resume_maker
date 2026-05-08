import { Plus, Trash2, Languages } from 'lucide-react'
import React, { useState } from 'react'

const LanguageForm = ({ data, onChange }) => {
    const [newLang, setNewLang] = useState('')

    const languages = data || []

    const addLanguage = () => {
        const trimmed = newLang.trim()
        if (!trimmed) return
        if (languages.some(l => l.name.toLowerCase() === trimmed.toLowerCase())) return
        onChange([...languages, { name: trimmed, read: false, write: false, speak: false }])
        setNewLang('')
    }

    const removeLanguage = (i) => onChange(languages.filter((_, idx) => idx !== i))

    const toggle = (i, field) => {
        const updated = languages.map((l, idx) =>
            idx === i ? { ...l, [field]: !l[field] } : l
        )
        onChange(updated)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); addLanguage() }
    }

    return (
        <div className='space-y-4'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                    <Languages className='size-5 text-indigo-500' /> Languages
                </h3>
                <p className='text-sm text-gray-500'>Add languages and select your proficiency</p>
            </div>

            {/* Input row */}
            <div className='flex gap-2'>
                <input
                    type='text'
                    placeholder='e.g. English, Tamil, Hindi'
                    className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300'
                    value={newLang}
                    onChange={e => setNewLang(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={addLanguage}
                    disabled={!newLang.trim()}
                    className='flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50'
                >
                    <Plus className='size-4' /> Add
                </button>
            </div>

            {/* Language list */}
            {languages.length > 0 ? (
                <div className='space-y-2'>
                    {/* Header */}
                    <div className='grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide'>
                        <span>Language</span>
                        <span className='w-12 text-center'>Read</span>
                        <span className='w-12 text-center'>Write</span>
                        <span className='w-12 text-center'>Speak</span>
                        <span className='w-6'></span>
                    </div>

                    {languages.map((lang, i) => (
                        <div key={i} className='grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-center px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg'>
                            <span className='text-sm font-medium text-gray-800'>{lang.name}</span>

                            {['read', 'write', 'speak'].map(field => (
                                <button
                                    key={field}
                                    onClick={() => toggle(i, field)}
                                    className={`w-12 h-7 rounded-md text-xs font-semibold border-2 transition-all ${
                                        lang[field]
                                            ? 'bg-indigo-500 border-indigo-500 text-white'
                                            : 'bg-white border-gray-300 text-gray-400 hover:border-indigo-400'
                                    }`}
                                >
                                    {lang[field] ? '✓' : '—'}
                                </button>
                            ))}

                            <button
                                onClick={() => removeLanguage(i)}
                                className='p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors'
                            >
                                <Trash2 className='size-3.5' />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='text-center py-6 text-gray-400'>
                    <Languages className='w-10 h-10 mx-auto mb-2 text-gray-300' />
                    <p className='text-sm'>No languages added yet.</p>
                </div>
            )}
        </div>
    )
}

export default LanguageForm
