import { Check, Palette } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react'

const COLORS = [
  // Reds
  "#FF0000","#FF3333","#FF6666","#FF9999","#FFCCCC",
  "#CC0000","#990000","#660000","#330000","#FF1A1A",
  // Oranges
  "#FF6600","#FF8533","#FFA366","#FFC299","#FFE0CC",
  "#CC5200","#993D00","#662900","#FF7A1A","#FF9933",
  // Yellows
  "#FFD700","#FFDD33","#FFE566","#FFEE99","#FFF5CC",
  "#CCAC00","#998100","#665600","#FFD11A","#FFCC00",
  // Greens
  "#00CC00","#33D633","#66E066","#99EB99","#CCF5CC",
  "#009900","#006600","#003300","#1AD61A","#00FF00",
  // Teals & Cyans
  "#00CCCC","#33D6D6","#66E0E0","#99EBEB","#CCF5F5",
  "#009999","#006666","#003333","#00FFFF","#1AD6D6",
  // Blues
  "#3B82F6","#1D4ED8","#2563EB","#60A5FA","#93C5FD",
  "#1E40AF","#1E3A8A","#172554","#BFDBFE","#DBEAFE",
  // Indigos & Purples
  "#6366F1","#4F46E5","#4338CA","#818CF8","#A5B4FC",
  "#8B5CF6","#7C3AED","#6D28D9","#A78BFA","#C4B5FD",
  // Pinks & Magentas
  "#EC4899","#DB2777","#BE185D","#F472B6","#FBCFE8",
  "#FF00FF","#CC00CC","#990099","#FF33FF","#FF66FF",
  // Browns & Neutrals
  "#8B4513","#A0522D","#CD853F","#D2691E","#F4A460",
  "#6B7280","#4B5563","#374151","#1F2937","#111827",
  // Whites, Grays, Blacks
  "#FFFFFF","#F3F4F6","#E5E7EB","#D1D5DB","#9CA3AF",
  "#6B7280","#4B5563","#374151","#1F2937","#000000",
]

const ColorPicker = ({ selectedColor, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [customHex, setCustomHex] = useState('')
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const applyCustom = () => {
    const hex = customHex.startsWith('#') ? customHex : '#' + customHex
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onChange(hex)
      setIsOpen(false)
      setCustomHex('')
    }
  }

  return (
    <div className='relative' ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-1 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg'
      >
        <Palette size={16} />
        <span className="max-sm:hidden">Accent</span>
        <span className="w-4 h-4 rounded-full border border-white/50 shadow-sm ml-1" style={{ backgroundColor: selectedColor }} />
      </button>

      {isOpen && (
        <div className='absolute top-full left-0 mt-2 z-50 bg-white rounded-xl border border-gray-200 shadow-lg p-3 w-72'>
          <p className='text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide'>Choose Accent Color</p>

          {/* Color grid */}
          <div className='grid grid-cols-10 gap-1 mb-3'>
            {COLORS.map((color) => (
              <button
                key={color}
                title={color}
                onClick={() => { onChange(color); setIsOpen(false) }}
                className='w-6 h-6 rounded-sm border border-gray-200 hover:scale-125 transition-transform relative flex items-center justify-center'
                style={{ backgroundColor: color }}
              >
                {selectedColor === color && (
                  <Check className="size-3 text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>

          {/* Custom hex input */}
          <div className='flex gap-2 items-center border-t border-gray-100 pt-2'>
            <div className='w-7 h-7 rounded border border-gray-300 shrink-0' style={{ backgroundColor: customHex.length >= 6 ? (customHex.startsWith('#') ? customHex : '#' + customHex) : selectedColor }} />
            <input
              type='text'
              placeholder='Custom hex e.g. #FF5733'
              maxLength={7}
              value={customHex}
              onChange={e => setCustomHex(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyCustom()}
              className='flex-1 text-xs px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400'
            />
            <button
              onClick={applyCustom}
              className='text-xs px-2 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorPicker
