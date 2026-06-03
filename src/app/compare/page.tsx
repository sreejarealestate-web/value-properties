'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { projects } from '@/data/projects'
import { Project } from '@/types'
import { Plus, X, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

const COMPARE_FIELDS = [
  { label: 'Developer', key: 'developer' as const },
  { label: 'Location', key: 'location' as const },
  { label: 'Land Parcel', key: 'landParcel' as const },
  { label: 'Tenure', key: 'tenure' as const },
  { label: 'Towers', key: 'towers' as const },
  { label: 'Total Storeys', key: 'totalStoreys' as const },
  { label: 'Apartments/Floor', key: 'apartmentsPerFloor' as const },
  { label: 'First Floor', key: 'firstHabitableFloor' as const },
  { label: 'Ceiling Height', key: 'ceilingHeight' as const },
  { label: 'Price/Sq Ft', key: 'currentPricePerSqFt' as const },
  { label: 'Possession', key: 'possessionStatus' as const },
  { label: 'Car Park', key: 'carParkType' as const },
  { label: 'Maintenance', key: 'maintenance' as const },
  { label: 'Rental Yield', key: 'rentalYield' as const },
]

export default function ComparePage() {
  const [selected, setSelected] = useState<Project[]>([])
  const [adding, setAdding] = useState(false)

  const add = (p: Project) => {
    if (selected.length < 6 && !selected.find(s => s.id === p.id)) {
      setSelected(prev => [...prev, p])
    }
    setAdding(false)
  }

  const remove = (id: string) => setSelected(prev => prev.filter(p => p.id !== id))

  const getValue = (project: Project, key: keyof Project): string => {
    const val = project[key]
    if (key === 'currentPricePerSqFt') return `₹${((val as number)/1000).toFixed(0)}K`
    return String(val ?? '—')
  }

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-4">Intelligence Tools</div>
          <h1 className="text-4xl font-light text-[#09090B] tracking-tight">Project Comparison</h1>
          <p className="text-[#71717A] mt-3">Compare up to 6 projects side by side across 20+ parameters.</p>
        </motion.div>

        {/* Add projects */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          {selected.map(p => (
            <div key={p.id} className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-[#E4E4E7] bg-white text-sm">
              <img src={p.elevationImage} alt="" className="w-6 h-6 rounded-md object-cover" />
              <span className="font-medium text-[#09090B]">{p.name}</span>
              <button onClick={() => remove(p.id)} className="text-[#A1A1AA] hover:text-[#09090B] transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
          {selected.length < 6 && (
            <button onClick={() => setAdding(!adding)} className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-dashed border-[#D4D4D8] text-sm text-[#71717A] hover:border-[#B8973B] hover:text-[#B8973B] transition-colors">
              <Plus size={14} /> Add Project
            </button>
          )}
          {selected.length >= 2 && (
            <button className="ml-auto flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#09090B] text-white text-sm hover:bg-[#27272A] transition-colors">
              <Download size={14} /> Export
            </button>
          )}
        </div>

        {/* Project picker */}
        {adding && (
          <div className="mb-8 p-5 rounded-2xl border border-[#E4E4E7] bg-white">
            <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-4">Select a project to add</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {projects.filter(p => !selected.find(s => s.id === p.id)).map(p => (
                <button key={p.id} onClick={() => add(p)} className="text-left p-3 rounded-xl border border-[#E4E4E7] hover:border-[#B8973B] transition-all group">
                  <img src={p.elevationImage} alt="" className="w-full h-20 object-cover rounded-lg mb-2" />
                  <div className="text-xs font-medium text-[#09090B] truncate">{p.name}</div>
                  <div className="text-[10px] text-[#71717A]">{p.location}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comparison table */}
        {selected.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#F5EED4] flex items-center justify-center mb-4">
              <Plus size={24} className="text-[#B8973B]" />
            </div>
            <h3 className="text-lg font-light text-[#09090B] mb-2">Add projects to compare</h3>
            <p className="text-sm text-[#A1A1AA]">Select up to 6 projects to compare them side by side.</p>
          </div>
        ) : selected.length === 1 ? (
          <div className="text-center py-12 text-[#A1A1AA] text-sm">Add at least 2 projects to start comparing.</div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-[#E4E4E7]">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-[#F4F4F5] border-b border-[#E4E4E7]">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider w-36">Attribute</th>
                  {selected.map(p => (
                    <th key={p.id} className="px-4 py-4 min-w-[180px]">
                      <div className="flex flex-col items-center gap-2">
                        <img src={p.elevationImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        <div className="text-sm font-medium text-[#09090B]">{p.name}</div>
                        <div className="text-[10px] text-[#71717A]">{p.developer}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_FIELDS.map(({ label, key }, i) => (
                  <tr key={key} className={cn('border-t border-[#F4F4F5]', i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]')}>
                    <td className="px-5 py-3.5 text-xs font-medium text-[#71717A]">{label}</td>
                    {selected.map(p => (
                      <td key={p.id} className="px-4 py-3.5 text-sm text-center text-[#09090B]">
                        {getValue(p, key)}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Configurations row */}
                <tr className="border-t border-[#F4F4F5]">
                  <td className="px-5 py-3.5 text-xs font-medium text-[#71717A]">Configurations</td>
                  {selected.map(p => (
                    <td key={p.id} className="px-4 py-3.5 text-xs text-center text-[#52525B]">
                      {p.configurations.map(c => c.type).join(', ')}
                    </td>
                  ))}
                </tr>
                {/* Views row */}
                <tr className="border-t border-[#F4F4F5] bg-[#FAFAFA]">
                  <td className="px-5 py-3.5 text-xs font-medium text-[#71717A]">Views</td>
                  {selected.map(p => (
                    <td key={p.id} className="px-4 py-3.5 text-xs text-center text-[#52525B]">
                      {p.viewTypes.join(', ')}
                    </td>
                  ))}
                </tr>
                {/* Tags row */}
                <tr className="border-t border-[#F4F4F5]">
                  <td className="px-5 py-3.5 text-xs font-medium text-[#71717A]">Tags</td>
                  {selected.map(p => (
                    <td key={p.id} className="px-4 py-3.5">
                      <div className="flex flex-wrap justify-center gap-1">
                        {p.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5EED4] text-[#B8973B]">{tag}</span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                {/* Actions */}
                <tr className="border-t border-[#E4E4E7] bg-[#F4F4F5]">
                  <td className="px-5 py-4 text-xs font-medium text-[#71717A]">Actions</td>
                  {selected.map(p => (
                    <td key={p.id} className="px-4 py-4">
                      <div className="flex flex-col items-center gap-2">
                        <Link href={`/properties/${p.locationId}/${p.id}`} className="text-xs px-3 py-1.5 rounded-lg bg-[#09090B] text-white hover:bg-[#27272A] transition-colors">View Details</Link>
                        <Link href={`/presentation/${p.id}`} className="text-xs px-3 py-1.5 rounded-lg border border-[#E4E4E7] text-[#52525B] hover:bg-white transition-colors">Present</Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
