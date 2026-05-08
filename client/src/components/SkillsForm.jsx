import { Plus, Sparkles, X } from 'lucide-react'
import React, { useState } from 'react'

// Helper: normalise a skill entry → { name, level }
// Supports legacy plain-string entries
const normalise = (skill) =>
    typeof skill === 'string' ? { name: skill, level: 3 } : skill

const LEVELS = [1, 2, 3, 4, 5]
const LEVEL_LABELS = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']

const SkillsForm = ({ data, onChange }) => {
    const [newSkill, setNewSkill] = useState('')
    const [newLevel, setNewLevel] = useState(3)

    // Normalise entire array on the fly
    const skills = (data || []).map(normalise)

    const addSkill = () => {
        const trimmed = newSkill.trim()
        if (!trimmed) return
        if (skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) return
        onChange([...skills, { name: trimmed, level: newLevel }])
        setNewSkill('')
        setNewLevel(3)
    }

    const removeSkill = (i) => onChange(skills.filter((_, idx) => idx !== i))

    const updateLevel = (i, level) => {
        const updated = skills.map((s, idx) => idx === i ? { ...s, level } : s)
        onChange(updated)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); addSkill() }
    }

    return (
        <div className='space-y-4'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Skills</h3>
                <p className='text-sm text-gray-500'>Add your skills and set a proficiency level</p>
            </div>

            {/* Input row */}
            <div className='space-y-2'>
                <div className='flex gap-2'>
                    <input
                        type='text'
                        placeholder='Enter a skill (e.g. JavaScript, Leadership)'
                        className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300'
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={addSkill}
                        disabled={!newSkill.trim()}
                        className='flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <Plus className='size-4' /> Add
                    </button>
                </div>

                {/* Level picker for new skill */}
                <div className='flex items-center gap-3 px-1'>
                    <span className='text-xs text-gray-500 shrink-0'>Level:</span>
                    <div className='flex gap-1.5'>
                        {LEVELS.map(l => (
                            <button
                                key={l}
                                onClick={() => setNewLevel(l)}
                                title={LEVEL_LABELS[l - 1]}
                                className={`w-5 h-5 rounded-sm border-2 transition-all ${newLevel >= l
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'bg-white border-gray-300 hover:border-blue-400'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className='text-xs text-blue-600 font-medium'>{LEVEL_LABELS[newLevel - 1]}</span>
                </div>
            </div>

            {/* Skills list */}
            {skills.length > 0 ? (
                <div className='space-y-2'>
                    {skills.map((skill, i) => (
                        <div
                            key={i}
                            className='flex items-center gap-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg'
                        >
                            <span className='flex-1 text-sm font-medium text-gray-800'>{skill.name}</span>

                            {/* Inline level editor */}
                            <div className='flex gap-1'>
                                {LEVELS.map(l => (
                                    <button
                                        key={l}
                                        onClick={() => updateLevel(i, l)}
                                        title={LEVEL_LABELS[l - 1]}
                                        className={`w-4 h-4 rounded-sm border transition-all ${skill.level >= l
                                            ? 'bg-blue-500 border-blue-500'
                                            : 'bg-white border-gray-300 hover:border-blue-400'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className='text-xs text-gray-400 w-20 text-right'>{LEVEL_LABELS[(skill.level ?? 3) - 1]}</span>

                            <button
                                onClick={() => removeSkill(i)}
                                className='ml-1 p-0.5 rounded-full hover:bg-red-100 transition-colors text-gray-400 hover:text-red-500'
                            >
                                <X className='w-3.5 h-3.5' />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='text-center py-6 text-gray-500'>
                    <Sparkles className='w-10 h-10 mx-auto mb-2 text-gray-300' />
                    <p>No skills added yet.</p>
                    <p className='text-sm'>Add your technical and soft skills above.</p>
                </div>
            )}

            <div className='bg-blue-50 p-3 rounded-lg'>
                <p className='text-sm text-blue-800'>
                    <strong>Tip:</strong> Add 8–12 relevant skills. Set a level for each — it will display as a progress bar in supported templates.
                </p>
            </div>
        </div>
    )
}

export default SkillsForm
