import { Plus, Trash2, Trophy, TrendingUp, TrendingDown, Users, ShoppingCart, Wrench } from 'lucide-react'
import React, { useState } from 'react'

const CATEGORIES = [
    { label: 'Manpower Reduction',   icon: '👥', color: '#EF4444' },
    { label: 'Production Increase',  icon: '🏭', color: '#10B981' },
    { label: 'Kaizen / Process',     icon: '⚙️', color: '#F59E0B' },
    { label: 'Sales Improvement',    icon: '📈', color: '#3B82F6' },
    { label: 'Cost Reduction',       icon: '💰', color: '#8B5CF6' },
    { label: 'Quality Improvement',  icon: '✅', color: '#14B8A6' },
    { label: 'Customer Satisfaction',icon: '⭐', color: '#F97316' },
    { label: 'Other',                icon: '🏆', color: '#6B7280' },
]

const UNITS = ['%', 'units', '₹', '$', 'hrs', 'days', 'pcs', 'kg', 'custom']

const empty = () => ({
    category: CATEGORIES[0].label,
    title: '',
    from_value: '',
    to_value: '',
    unit: '%',
    description: '',
})

const AchievementForm = ({ data, onChange }) => {
    const [adding, setAdding] = useState(false)
    const [form, setForm] = useState(empty())
    const [editIndex, setEditIndex] = useState(null)

    const achievements = data || []

    const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

    const save = () => {
        if (!form.title.trim()) return
        if (editIndex !== null) {
            const updated = achievements.map((a, i) => i === editIndex ? form : a)
            onChange(updated)
            setEditIndex(null)
        } else {
            onChange([...achievements, form])
        }
        setForm(empty())
        setAdding(false)
    }

    const remove = (i) => onChange(achievements.filter((_, idx) => idx !== i))

    const startEdit = (i) => {
        setForm({ ...achievements[i] })
        setEditIndex(i)
        setAdding(true)
    }

    const cancel = () => { setForm(empty()); setAdding(false); setEditIndex(null) }

    const cat = CATEGORIES.find(c => c.label === form.category) || CATEGORIES[0]

    return (
        <div className='space-y-4'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                    <Trophy className='size-5 text-yellow-500' /> Achievements
                    <span className='text-xs font-normal text-gray-400'>(Optional)</span>
                </h3>
                <p className='text-sm text-gray-500'>Quantify your impact with measurable results</p>
            </div>

            {/* Achievement list */}
            {achievements.length > 0 && (
                <div className='space-y-2'>
                    {achievements.map((a, i) => {
                        const c = CATEGORIES.find(c => c.label === a.category) || CATEGORIES[7]
                        return (
                            <div key={i} className='flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg'>
                                <span className='text-xl mt-0.5'>{c.icon}</span>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center gap-2 flex-wrap'>
                                        <span className='text-xs font-semibold px-2 py-0.5 rounded-full text-white' style={{ backgroundColor: c.color }}>{a.category}</span>
                                        <span className='text-sm font-medium text-gray-800'>{a.title}</span>
                                    </div>
                                    {(a.from_value !== '' && a.to_value !== '') && (
                                        <p className='text-sm text-gray-600 mt-0.5'>
                                            <span className='font-semibold' style={{ color: c.color }}>
                                                {a.from_value}{a.unit} → {a.to_value}{a.unit}
                                            </span>
                                        </p>
                                    )}
                                    {a.description && <p className='text-xs text-gray-500 mt-0.5'>{a.description}</p>}
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
                <div className='border border-indigo-200 rounded-xl p-4 space-y-3 bg-indigo-50/40'>
                    {/* Category */}
                    <div>
                        <label className='text-xs font-semibold text-gray-600 mb-1.5 block'>Category</label>
                        <div className='grid grid-cols-2 gap-1.5'>
                            {CATEGORIES.map(c => (
                                <button
                                    key={c.label}
                                    onClick={() => set('category', c.label)}
                                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs border-2 transition-all ${form.category === c.label ? 'border-current font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                    style={form.category === c.label ? { borderColor: c.color, color: c.color, backgroundColor: c.color + '15' } : {}}
                                >
                                    <span>{c.icon}</span> {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className='text-xs font-semibold text-gray-600 mb-1 block'>Achievement Title *</label>
                        <input
                            type='text'
                            placeholder='e.g. Reduced assembly line headcount'
                            value={form.title}
                            onChange={e => set('title', e.target.value)}
                            className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300'
                        />
                    </div>

                    {/* Range */}
                    <div>
                        <label className='text-xs font-semibold text-gray-600 mb-1 block'>Range (Before → After)</label>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                placeholder='From'
                                value={form.from_value}
                                onChange={e => set('from_value', e.target.value)}
                                className='w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300'
                            />
                            <span className='text-gray-400 font-bold'>→</span>
                            <input
                                type='number'
                                placeholder='To'
                                value={form.to_value}
                                onChange={e => set('to_value', e.target.value)}
                                className='w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300'
                            />
                            <select
                                value={form.unit}
                                onChange={e => set('unit', e.target.value)}
                                className='px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300'
                            >
                                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                        <p className='text-xs text-gray-400 mt-1'>e.g. 10 → 7 % means reduced from 10% to 7%</p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className='text-xs font-semibold text-gray-600 mb-1 block'>Description <span className='font-normal text-gray-400'>(optional)</span></label>
                        <textarea
                            rows={2}
                            placeholder='Brief context about this achievement...'
                            value={form.description}
                            onChange={e => set('description', e.target.value)}
                            className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none'
                        />
                    </div>

                    {/* Preview */}
                    {form.title && (
                        <div className='flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 text-sm'>
                            <span>{cat.icon}</span>
                            <span className='font-medium text-gray-800'>{form.title}</span>
                            {form.from_value !== '' && form.to_value !== '' && (
                                <span className='font-semibold ml-auto' style={{ color: cat.color }}>
                                    {form.from_value}{form.unit} → {form.to_value}{form.unit}
                                </span>
                            )}
                        </div>
                    )}

                    <div className='flex gap-2 pt-1'>
                        <button onClick={save} disabled={!form.title.trim()} className='flex-1 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50'>
                            {editIndex !== null ? 'Update' : 'Add Achievement'}
                        </button>
                        <button onClick={cancel} className='px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors'>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setAdding(true)}
                    className='w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium'
                >
                    <Plus className='size-4' /> Add Achievement
                </button>
            )}
        </div>
    )
}

export default AchievementForm
