'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { projects } from '@/data/projects'
import { Project } from '@/types'
import { Plus, X, Download, User, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Shortlist {
  clientName: string
  projects: Project[]
  notes: string
}

export default function ShortlistPage() {
  const [shortlist, setShortlist] = useState<Shortlist>({ clientName: '', projects: [], notes: '' })
  const [addingProject, setAddingProject] = useState(false)

  const addProject = (p: Project) => {
    if (!shortlist.projects.find(sp => sp.id === p.id)) {
      setShortlist(s => ({ ...s, projects: [...s.projects, p] }))
    }
    setAddingProject(false)
  }

  const removeProject = (id: string) => setShortlist(s => ({ ...s, projects: s.projects.filter(p => p.id !== id) }))

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-4">Client Tools</div>
          <h1 className="text-4xl font-light text-[#09090B] tracking-tight">Client Shortlist Builder</h1>
          <p className="text-[#71717A] mt-3">Build a curated shortlist and generate a luxury presentation for your client.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — client setup */}
          <div>
            <div className="p-6 rounded-2xl border border-[#E4E4E7] bg-white mb-6">
              <div className="flex items-center gap-2 mb-5">
                <User size={16} className="text-[#B8973B]" />
                <span className="font-medium text-[#09090B]">Client Details</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-2">Client Name</label>
                  <input
                    value={shortlist.clientName}
                    onChange={e => setShortlist(s => ({ ...s, clientName: e.target.value }))}
                    placeholder="e.g. Mr. Shah"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] text-sm focus:outline-none focus:border-[#B8973B]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-2">Advisory Notes</label>
                  <textarea
                    value={shortlist.notes}
                    onChange={e => setShortlist(s => ({ ...s, notes: e.target.value }))}
                    placeholder="Add private notes for this client..."
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] text-sm focus:outline-none focus:border-[#B8973B] resize-none"
                  />
                </div>
              </div>
            </div>

            {shortlist.projects.length > 0 && shortlist.clientName && (
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#09090B] text-white text-sm hover:bg-[#27272A] transition-colors">
                  <Download size={14} /> Export PDF
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#E4E4E7] text-sm text-[#52525B] hover:bg-[#F4F4F5] transition-colors">
                  <FileText size={14} /> Print Ready PDF
                </button>
              </div>
            )}
          </div>

          {/* Right — shortlisted projects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm text-[#71717A]">
                {shortlist.projects.length === 0 ? 'No projects added yet' : `${shortlist.projects.length} project${shortlist.projects.length > 1 ? 's' : ''} shortlisted`}
              </div>
              <button onClick={() => setAddingProject(!addingProject)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#D4D4D8] text-sm text-[#71717A] hover:border-[#B8973B] hover:text-[#B8973B] transition-colors">
                <Plus size={14} /> Add Project
              </button>
            </div>

            {/* Project picker */}
            {addingProject && (
              <div className="mb-6 p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-4">Select project to add</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {projects.filter(p => !shortlist.projects.find(sp => sp.id === p.id)).map(p => (
                    <button key={p.id} onClick={() => addProject(p)} className="text-left p-3 rounded-xl border border-[#E4E4E7] hover:border-[#B8973B] transition-all">
                      <img src={p.elevationImage} alt="" className="w-full h-20 object-cover rounded-lg mb-2" />
                      <div className="text-xs font-medium text-[#09090B] truncate">{p.name}</div>
                      <div className="text-[10px] text-[#71717A]">{p.location}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {shortlist.projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-[#E4E4E7]">
                <Plus size={32} className="text-[#D4D4D8] mb-4" />
                <p className="text-[#A1A1AA] text-sm">Add projects to build the shortlist</p>
              </div>
            ) : (
              <div className="space-y-4">
                {shortlist.projects.map((project, i) => (
                  <motion.div key={project.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-5 rounded-2xl border border-[#E4E4E7] bg-white hover:border-[#B8973B]/30 transition-all">
                    <div className="flex gap-4">
                      <img src={project.elevationImage} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-[#09090B]">{project.name}</h3>
                            <p className="text-xs text-[#71717A] mt-0.5">{project.developer} · {project.location}</p>
                          </div>
                          <button onClick={() => removeProject(project.id)} className="text-[#A1A1AA] hover:text-[#09090B] transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {project.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5EED4] text-[#B8973B]">{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xs text-[#B8973B] font-medium">{project.configurations[0]?.price}</span>
                          <span className="text-xs text-[#A1A1AA]">·</span>
                          <span className={cn('text-xs', project.possessionStatus === 'Ready To Move' ? 'text-[#059669]' : 'text-[#EA580C]')}>
                            {project.possessionStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-[#F4F4F5]">
                      <Link href={`/properties/${project.locationId}/${project.id}`} className="text-xs px-3 py-1.5 rounded-lg border border-[#E4E4E7] text-[#52525B] hover:bg-[#F4F4F5] transition-colors">Details</Link>
                      <Link href={`/presentation/${project.id}`} className="text-xs px-3 py-1.5 rounded-lg border border-[#E4E4E7] text-[#52525B] hover:bg-[#F4F4F5] transition-colors">Present</Link>
                      <Link href={`/compare?add=${project.id}`} className="text-xs px-3 py-1.5 rounded-lg border border-[#E4E4E7] text-[#52525B] hover:bg-[#F4F4F5] transition-colors">Compare</Link>
                    </div>
                  </motion.div>
                ))}

                {/* Summary */}
                {shortlist.clientName && (
                  <div className="p-6 rounded-2xl bg-[#09090B] text-white mt-6">
                    <div className="text-xs text-[#B8973B] uppercase tracking-widest mb-3">Client Shortlist Summary</div>
                    <div className="text-xl font-light mb-4">{shortlist.clientName}</div>
                    <div className="text-sm text-[#A1A1AA] mb-4">{shortlist.projects.length} properties shortlisted</div>
                    <div className="text-xs text-[#71717A]">Curated by Sreeja · Value Properties</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
