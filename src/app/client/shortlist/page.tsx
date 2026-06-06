'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAppStore, ClientCollection } from '@/lib/store'
import { projects as defaultProjects } from '@/data/projects'
import { Project } from '@/types'
import {
  Plus, X, Download, User, FileText, Copy, ExternalLink,
  ChevronUp, ChevronDown, CheckCircle, Trash2, Edit2,
  Save, ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ShortlistPage() {
  const {
    collections, createCollection, updateCollection, deleteCollection,
    addProjectToCollection, removeProjectFromCollection, reorderCollection,
    getAllProjects
  } = useAppStore()

  const allProjects = getAllProjects()
  const [activeCollId, setActiveCollId] = useState<string | null>(collections[0]?.id || null)
  const [newClientName, setNewClientName] = useState('')
  const [addingProject, setAddingProject] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  const activeColl = collections.find(c => c.id === activeCollId) || null

  const createNew = () => {
    if (!newClientName.trim()) return
    const c = createCollection(newClientName.trim())
    setActiveCollId(c.id)
    setNewClientName('')
  }

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/share/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  const move = (projectId: string, dir: 1 | -1) => {
    if (!activeColl) return
    const ids = [...activeColl.projectIds]
    const i = ids.indexOf(projectId)
    const j = i + dir
    if (j < 0 || j >= ids.length) return
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
    reorderCollection(activeColl.id, ids)
  }

  const collProjects = activeColl ? activeColl.projectIds.map(id => allProjects.find(p => p.id === id)).filter(Boolean) as Project[] : []

  const handlePrint = () => window.print()

  return (
    <div className="min-h-screen pt-24 pb-24">
      {/* Print styles */}
      <style>{`
        @media print {
          nav, header, footer, .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { font-family: -apple-system, sans-serif; }
        }
        .print-only { display: none; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-4">Client Tools</div>
          <h1 className="text-4xl font-light text-[#09090B] tracking-tight">Client Collections</h1>
          <p className="text-[#71717A] mt-2">Build curated shortlists for each client. Generate shareable presentation links.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar — collections list */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">Collections ({collections.length})</div>
              <div className="space-y-1">
                {collections.map(col => (
                  <button key={col.id} onClick={() => setActiveCollId(col.id)} className={cn('w-full text-left px-3 py-2.5 rounded-xl transition-all group', activeCollId === col.id ? 'bg-[#09090B] text-white' : 'hover:bg-[#F4F4F5] text-[#52525B]')}>
                    <div className="text-sm font-medium truncate">{col.clientName}</div>
                    <div className={cn('text-[10px] mt-0.5', activeCollId === col.id ? 'text-white/50' : 'text-[#A1A1AA]')}>
                      {col.projectIds.length} project{col.projectIds.length !== 1 ? 's' : ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* New collection */}
            <div className="p-4 rounded-2xl border border-dashed border-[#E4E4E7]">
              <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">New Collection</div>
              <input
                value={newClientName}
                onChange={e => setNewClientName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createNew()}
                placeholder="Client name…"
                className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] text-sm focus:outline-none focus:border-[#B8973B] mb-2"
              />
              <button onClick={createNew} disabled={!newClientName.trim()} className="w-full py-2 rounded-xl bg-[#B8973B] text-white text-sm hover:bg-[#A07C2A] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                <Plus size={13} /> Create Collection
              </button>
            </div>
          </div>

          {/* Main — active collection */}
          <div className="lg:col-span-3">
            {!activeColl ? (
              <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-[#E4E4E7] text-center">
                <div className="w-14 h-14 rounded-3xl bg-[#F5EED4] flex items-center justify-center mb-4">
                  <User size={22} className="text-[#B8973B]" />
                </div>
                <p className="text-[#A1A1AA] text-sm">Create a client collection to get started</p>
              </div>
            ) : (
              <>
                {/* Collection header */}
                <div className="flex items-start justify-between mb-6 p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                  <div className="flex-1">
                    {editingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          defaultValue={activeColl.clientName}
                          onBlur={e => { updateCollection(activeColl.id, { clientName: e.target.value }); setEditingName(false) }}
                          onKeyDown={e => { if (e.key === 'Enter') { updateCollection(activeColl.id, { clientName: e.currentTarget.value }); setEditingName(false) } }}
                          className="text-xl font-light border-b border-[#B8973B] focus:outline-none bg-transparent"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-light text-[#09090B]">{activeColl.clientName}</h2>
                        <button onClick={() => setEditingName(true)} className="p-1 hover:bg-[#F4F4F5] rounded text-[#A1A1AA]"><Edit2 size={13} /></button>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <select
                        value={activeColl.objective || ''}
                        onChange={e => updateCollection(activeColl.id, { objective: (e.target.value || null) as any })}
                        className="text-xs px-2.5 py-1 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#B8973B] bg-white"
                      >
                        <option value="">Select Objective</option>
                        <option>End User</option><option>Investor</option><option>Family Office</option><option>NRI Buyer</option>
                      </select>
                      <span className="text-xs text-[#A1A1AA]">{collProjects.length} projects</span>
                    </div>
                    <textarea
                      value={activeColl.notes}
                      onChange={e => updateCollection(activeColl.id, { notes: e.target.value })}
                      placeholder="Add private advisory notes…"
                      rows={2}
                      className="mt-3 w-full text-sm text-[#52525B] border-0 border-b border-[#F4F4F5] focus:outline-none focus:border-[#B8973B] resize-none bg-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button onClick={() => copyLink(activeColl.slug)} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors', copiedSlug === activeColl.slug ? 'bg-[#059669] text-white' : 'border border-[#E4E4E7] text-[#52525B] hover:bg-[#F4F4F5]')}>
                      {copiedSlug === activeColl.slug ? <><CheckCircle size={11} /> Copied!</> : <><Copy size={11} /> Copy Link</>}
                    </button>
                    <Link href={`/share/${activeColl.slug}`} target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#09090B] text-white text-xs hover:bg-[#27272A] transition-colors">
                      <ExternalLink size={11} /> Open Presentation
                    </Link>
                    <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4E4E7] text-xs text-[#52525B] hover:bg-[#F4F4F5] transition-colors">
                      <FileText size={11} /> Print / PDF
                    </button>
                    <button onClick={() => { deleteCollection(activeColl.id); setActiveCollId(collections.find(c => c.id !== activeColl.id)?.id || null) }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-100 text-xs text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                </div>

                {/* Project list */}
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm text-[#71717A]">Shortlisted projects</span>
                  <button onClick={() => setAddingProject(!addingProject)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-[#D4D4D8] text-sm text-[#71717A] hover:border-[#B8973B] hover:text-[#B8973B] transition-colors">
                    <Plus size={13} /> Add Project
                  </button>
                </div>

                {/* Project picker */}
                <AnimatePresence>
                  {addingProject && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-5 p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                      <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-4">Select project</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {allProjects.filter(p => !activeColl.projectIds.includes(p.id)).map(p => (
                          <button key={p.id} onClick={() => { addProjectToCollection(activeColl.id, p.id); setAddingProject(false) }} className="text-left p-3 rounded-xl border border-[#E4E4E7] hover:border-[#B8973B] transition-all">
                            <img src={p.elevationImage} alt="" className="w-full h-16 object-cover rounded-lg mb-2" />
                            <div className="text-xs font-medium text-[#09090B] truncate">{p.name}</div>
                            <div className="text-[10px] text-[#71717A]">{p.location}</div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {collProjects.length === 0 ? (
                  <div className="py-16 rounded-2xl border border-dashed border-[#E4E4E7] text-center text-[#A1A1AA] text-sm">
                    Click &ldquo;Add Project&rdquo; to build this shortlist.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {collProjects.map((project, idx) => (
                      <motion.div key={project.id} layout className="flex items-center gap-4 p-4 rounded-2xl border border-[#E4E4E7] bg-white hover:border-[#B8973B]/20 transition-all">
                        <div className="flex flex-col gap-0.5">
                          <button onClick={() => move(project.id, -1)} disabled={idx === 0} className="p-0.5 hover:bg-[#F4F4F5] rounded disabled:opacity-30 text-[#A1A1AA]"><ChevronUp size={14} /></button>
                          <button onClick={() => move(project.id, 1)} disabled={idx === collProjects.length - 1} className="p-0.5 hover:bg-[#F4F4F5] rounded disabled:opacity-30 text-[#A1A1AA]"><ChevronDown size={14} /></button>
                        </div>
                        <span className="text-sm font-light text-[#A1A1AA] w-5 text-center">{idx + 1}</span>
                        <img src={project.elevationImage} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[#09090B] truncate">{project.name}</div>
                          <div className="text-xs text-[#71717A] mt-0.5">{project.developer} · {project.location}</div>
                          <div className="text-xs text-[#B8973B] mt-0.5">{project.configurations[0]?.price} onwards</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link href={`/properties/${project.locationId}/${project.id}`} className="p-1.5 rounded-lg border border-[#E4E4E7] text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5] transition-colors"><ExternalLink size={13} /></Link>
                          <button onClick={() => removeProjectFromCollection(activeColl.id, project.id)} className="p-1.5 rounded-lg border border-[#E4E4E7] text-[#A1A1AA] hover:text-red-500 hover:bg-red-50 transition-colors"><X size={13} /></button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
