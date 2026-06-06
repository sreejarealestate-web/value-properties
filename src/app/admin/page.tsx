'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { projects as defaultProjects } from '@/data/projects'
import { locations } from '@/data/locations'
import { developers } from '@/data/developers'
import { Project } from '@/types'
import {
  Lock, Building2, MapPin, Users, BarChart3, Edit2, Trash2,
  Upload, Save, X, Plus, ChevronDown, ChevronUp, RotateCcw,
  Navigation, Copy, CheckCircle, ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ADMIN_PASSWORD = 'valueprop2024'

// ─── Field editor ────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', textarea = false }: {
  label: string; value: string | number; onChange: (v: string) => void
  type?: string; textarea?: boolean
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          value={String(value)}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] text-sm focus:outline-none focus:border-[#B8973B] resize-none bg-white"
        />
      ) : (
        <input
          type={type}
          value={String(value)}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] text-sm focus:outline-none focus:border-[#B8973B] bg-white"
        />
      )}
    </div>
  )
}

// ─── Project editor ──────────────────────────────────────────────────────────
function ProjectEditor({ project, onClose }: { project: Project; onClose: () => void }) {
  const { updateProject, resetProject, getProject } = useAppStore()
  const resolved = getProject(project.id) || project
  const [form, setForm] = useState({ ...resolved })
  const [coordLat, setCoordLat] = useState(String(resolved.coordinates[1]))
  const [coordLng, setCoordLng] = useState(String(resolved.coordinates[0]))
  const [saved, setSaved] = useState(false)
  const [images, setImages] = useState<string[]>(resolved.images || [])
  const [newImageUrl, setNewImageUrl] = useState('')

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const save = () => {
    const lat = parseFloat(coordLat)
    const lng = parseFloat(coordLng)
    updateProject(project.id, {
      name: form.name,
      developer: form.developer,
      location: form.location,
      currentPricePerSqFt: Number(form.currentPricePerSqFt),
      possessionStatus: form.possessionStatus as any,
      possessionDate: form.possessionDate,
      landParcel: form.landParcel,
      tenure: form.tenure as any,
      towers: Number(form.towers),
      totalStoreys: Number(form.totalStoreys),
      apartmentsPerFloor: Number(form.apartmentsPerFloor),
      firstHabitableFloor: Number(form.firstHabitableFloor),
      ceilingHeight: form.ceilingHeight,
      maintenance: form.maintenance,
      carParkType: form.carParkType,
      rentalYield: form.rentalYield,
      elevationExplained: form.elevationExplained,
      masterLayoutDescription: form.masterLayoutDescription,
      whyRecommend: form.whyRecommend,
      investmentThesis: form.investmentThesis,
      heroImage: form.heroImage,
      images,
      brochureUrl: form.brochureUrl,
      coordinates: (!isNaN(lat) && !isNaN(lng)) ? [lng, lat] : form.coordinates,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addImage = () => {
    if (newImageUrl.trim()) { setImages(i => [...i, newImageUrl.trim()]); setNewImageUrl('') }
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-start justify-end overflow-y-auto">
      <motion.div initial={{ x: 600 }} animate={{ x: 0 }} exit={{ x: 600 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="w-full max-w-2xl bg-white min-h-full shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-[#E4E4E7] p-5 flex items-center justify-between z-10">
          <div>
            <div className="text-xs text-[#A1A1AA] uppercase tracking-wider">Editing</div>
            <div className="font-semibold text-[#09090B]">{form.name}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { resetProject(project.id); onClose() }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4E4E7] text-xs text-[#71717A] hover:bg-[#F4F4F5] transition-colors">
              <RotateCcw size={11} /> Reset
            </button>
            <button onClick={save} className={cn('flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors', saved ? 'bg-[#059669] text-white' : 'bg-[#B8973B] text-white hover:bg-[#A07C2A]')}>
              {saved ? <><CheckCircle size={11} /> Saved!</> : <><Save size={11} /> Save Changes</>}
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-[#F4F4F5] rounded-lg"><X size={16} /></button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Info */}
          <section>
            <div className="text-xs font-semibold text-[#B8973B] uppercase tracking-widest mb-4">Basic Information</div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Project Name" value={form.name} onChange={v => set('name', v)} />
              <Field label="Developer" value={form.developer} onChange={v => set('developer', v)} />
              <Field label="Location" value={form.location} onChange={v => set('location', v)} />
              <div>
                <label className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Possession Status</label>
                <select value={form.possessionStatus} onChange={e => set('possessionStatus', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] text-sm focus:outline-none focus:border-[#B8973B] bg-white">
                  {['Ready To Move', 'Under Construction', 'New Launch', 'OC Received'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <Field label="Possession Date" value={form.possessionDate || ''} onChange={v => set('possessionDate', v)} />
              <div>
                <label className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Tenure</label>
                <select value={form.tenure} onChange={e => set('tenure', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] text-sm focus:outline-none focus:border-[#B8973B] bg-white">
                  <option>Freehold</option><option>Leasehold</option>
                </select>
              </div>
            </div>
          </section>

          {/* Specs */}
          <section>
            <div className="text-xs font-semibold text-[#B8973B] uppercase tracking-widest mb-4">Project Specifications</div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Land Parcel" value={form.landParcel} onChange={v => set('landParcel', v)} />
              <Field label="Towers" value={form.towers} onChange={v => set('towers', v)} type="number" />
              <Field label="Total Storeys" value={form.totalStoreys} onChange={v => set('totalStoreys', v)} type="number" />
              <Field label="Apartments Per Floor" value={form.apartmentsPerFloor} onChange={v => set('apartmentsPerFloor', v)} type="number" />
              <Field label="First Habitable Floor" value={form.firstHabitableFloor} onChange={v => set('firstHabitableFloor', v)} type="number" />
              <Field label="Ceiling Height" value={form.ceilingHeight} onChange={v => set('ceilingHeight', v)} />
              <Field label="Maintenance" value={form.maintenance} onChange={v => set('maintenance', v)} />
              <Field label="Car Park Type" value={form.carParkType} onChange={v => set('carParkType', v)} />
            </div>
          </section>

          {/* Pricing */}
          <section>
            <div className="text-xs font-semibold text-[#B8973B] uppercase tracking-widest mb-4">Pricing & Yield</div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price per Sq Ft (₹)" value={form.currentPricePerSqFt} onChange={v => set('currentPricePerSqFt', v)} type="number" />
              <Field label="Rental Yield" value={form.rentalYield || ''} onChange={v => set('rentalYield', v)} />
            </div>
          </section>

          {/* Location / Coordinates */}
          <section>
            <div className="text-xs font-semibold text-[#B8973B] uppercase tracking-widest mb-4">
              <Navigation size={11} className="inline mr-1" />Map Coordinates
            </div>
            <div className="p-4 rounded-xl bg-[#F4F4F5] mb-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Latitude</label>
                  <input value={coordLat} onChange={e => setCoordLat(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] text-sm focus:outline-none focus:border-[#B8973B] bg-white font-mono" placeholder="18.9984" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Longitude</label>
                  <input value={coordLng} onChange={e => setCoordLng(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] text-sm focus:outline-none focus:border-[#B8973B] bg-white font-mono" placeholder="72.8162" />
                </div>
              </div>
              <a href={`https://maps.google.com/?q=${coordLat},${coordLng}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[#B8973B] hover:underline">
                <ExternalLink size={11} /> Verify on Google Maps
              </a>
            </div>
          </section>

          {/* Media */}
          <section>
            <div className="text-xs font-semibold text-[#B8973B] uppercase tracking-widest mb-4">Media</div>
            <Field label="Hero Image URL" value={form.heroImage} onChange={v => set('heroImage', v)} />
            {form.heroImage && <img src={form.heroImage} alt="" className="mt-2 h-24 rounded-xl object-cover w-full" />}

            <div className="mt-4">
              <div className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Gallery Images</div>
              <div className="space-y-2 mb-3">
                {images.map((img, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <img src={img} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <input value={img} onChange={e => setImages(imgs => imgs.map((x, j) => j === i ? e.target.value : x))} className="flex-1 px-3 py-1.5 rounded-xl border border-[#E4E4E7] text-xs focus:outline-none focus:border-[#B8973B] bg-white font-mono" />
                    <button onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))} className="p-1.5 hover:bg-[#FEF2F2] rounded-lg text-[#A1A1AA] hover:text-red-500"><X size={13} /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="Paste image URL…" className="flex-1 px-3 py-2 rounded-xl border border-[#E4E4E7] text-sm focus:outline-none focus:border-[#B8973B] bg-white" onKeyDown={e => e.key === 'Enter' && addImage()} />
                <button onClick={addImage} className="px-4 py-2 rounded-xl bg-[#09090B] text-white text-sm hover:bg-[#27272A]"><Plus size={14} /></button>
              </div>
            </div>

            <div className="mt-4">
              <Field label="Brochure PDF URL" value={form.brochureUrl || ''} onChange={v => set('brochureUrl', v)} />
            </div>
          </section>

          {/* Advisory text */}
          <section>
            <div className="text-xs font-semibold text-[#B8973B] uppercase tracking-widest mb-4">Advisory & Description</div>
            <div className="space-y-4">
              <Field label="Elevation Explained" value={form.elevationExplained} onChange={v => set('elevationExplained', v)} textarea />
              <Field label="Master Layout Description" value={form.masterLayoutDescription || ''} onChange={v => set('masterLayoutDescription', v)} textarea />
              <Field label="Why We Recommend" value={form.whyRecommend || ''} onChange={v => set('whyRecommend', v)} textarea />
              <Field label="Investment Thesis" value={form.investmentThesis || ''} onChange={v => set('investmentThesis', v)} textarea />
            </div>
          </section>

          <div className="pb-8">
            <button onClick={save} className={cn('w-full py-3 rounded-2xl text-sm font-medium transition-colors', saved ? 'bg-[#059669] text-white' : 'bg-[#B8973B] text-white hover:bg-[#A07C2A]')}>
              {saved ? '✓ Changes Saved' : 'Save All Changes'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Main admin page ─────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'projects' | 'locations' | 'developers' | 'inventory' | 'collections'>('projects')
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const { getAllProjects, projectOverrides, collections, deleteCollection } = useAppStore()

  const allProjects = getAllProjects()

  if (!authed) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="w-12 h-12 rounded-2xl bg-[#F5EED4] flex items-center justify-center mx-auto mb-4">
              <Lock size={20} className="text-[#B8973B]" />
            </div>
            <h1 className="text-2xl font-light text-[#09090B] tracking-tight">Admin Panel</h1>
            <p className="text-sm text-[#71717A] mt-2">Value Properties · Curated by Sreeja</p>
          </div>
          <div className="p-8 rounded-3xl border border-[#E4E4E7] bg-white shadow-sm">
            <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && (password === ADMIN_PASSWORD ? (setAuthed(true), setError('')) : setError('Incorrect password.'))} placeholder="Enter admin password" className="w-full px-4 py-3 rounded-xl border border-[#E4E4E7] text-sm focus:outline-none focus:border-[#B8973B] mb-4" />
            {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
            <button onClick={() => password === ADMIN_PASSWORD ? (setAuthed(true), setError('')) : setError('Incorrect password.')} className="w-full py-3 rounded-xl bg-[#09090B] text-white font-medium hover:bg-[#27272A] transition-colors">Access Admin</button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-24">
      {editingProject && <ProjectEditor project={editingProject} onClose={() => setEditingProject(null)} />}

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-2">Admin Panel</div>
            <h1 className="text-3xl font-light text-[#09090B] tracking-tight">Content Management</h1>
          </div>
          <button onClick={() => setAuthed(false)} className="text-sm text-[#71717A] hover:text-[#09090B] transition-colors">Sign Out</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Projects', value: allProjects.length, icon: Building2 },
            { label: 'Locations', value: locations.length, icon: MapPin },
            { label: 'Developers', value: developers.length, icon: Users },
            { label: 'Edits Applied', value: Object.keys(projectOverrides).length, icon: Edit2 },
            { label: 'Collections', value: collections.length, icon: BarChart3 },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-2xl border border-[#E4E4E7] bg-white">
              <s.icon size={15} className="text-[#B8973B] mb-2" />
              <div className="text-2xl font-light text-[#09090B]">{s.value}</div>
              <div className="text-[10px] text-[#A1A1AA] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#F4F4F5] rounded-2xl w-fit mb-8 overflow-x-auto">
          {(['projects', 'locations', 'developers', 'inventory', 'collections'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize whitespace-nowrap', activeTab === tab ? 'bg-white text-[#09090B] shadow-sm' : 'text-[#71717A] hover:text-[#09090B]')}>
              {tab}
            </button>
          ))}
        </div>

        {/* Projects */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm text-[#71717A]">{allProjects.length} projects · {Object.keys(projectOverrides).length} with custom edits</div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#E4E4E7]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F4F4F5] border-b border-[#E4E4E7]">
                    {['Project', 'Developer', 'Location', 'Price/sqft', 'Coords', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allProjects.map(project => {
                    const edited = !!projectOverrides[project.id]
                    return (
                      <tr key={project.id} className="border-t border-[#F4F4F5] hover:bg-[#FAFAFA]">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <img src={project.heroImage} alt="" className="w-9 h-9 rounded-lg object-cover" />
                            <div>
                              <span className="text-sm font-medium text-[#09090B]">{project.name}</span>
                              {edited && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-[#F5EED4] text-[#B8973B]">Edited</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-[#52525B]">{project.developer}</td>
                        <td className="px-4 py-3.5 text-sm text-[#52525B]">{project.location}</td>
                        <td className="px-4 py-3.5 text-sm font-medium text-[#B8973B]">₹{(project.currentPricePerSqFt/1000).toFixed(0)}K</td>
                        <td className="px-4 py-3.5 text-xs font-mono text-[#A1A1AA]">{project.coordinates[1].toFixed(4)}, {project.coordinates[0].toFixed(4)}</td>
                        <td className="px-4 py-3.5">
                          <span className={cn('text-[10px] px-2.5 py-1 rounded-full font-semibold', project.possessionStatus === 'Ready To Move' ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FFF7ED] text-[#EA580C]')}>
                            {project.possessionStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setEditingProject(project)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#09090B] text-white text-xs hover:bg-[#27272A] transition-colors">
                              <Edit2 size={11} /> Edit
                            </button>
                            <Link href={`/properties/${project.locationId}/${project.id}`} className="p-1.5 rounded-lg hover:bg-[#F4F4F5] text-[#71717A] transition-colors" target="_blank">
                              <ExternalLink size={13} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Locations */}
        {activeTab === 'locations' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map(loc => (
              <div key={loc.id} className="p-4 rounded-2xl border border-[#E4E4E7] bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#09090B]">{loc.name}</div>
                    <div className="text-xs text-[#71717A] mt-0.5">{loc.averagePricing.split('-')[0].trim()}</div>
                    <div className="text-[10px] font-mono text-[#A1A1AA] mt-1">{loc.coordinates[1].toFixed(4)}, {loc.coordinates[0].toFixed(4)}</div>
                  </div>
                  <a href={`https://maps.google.com/?q=${loc.coordinates[1]},${loc.coordinates[0]}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-[#F4F4F5] text-[#A1A1AA] hover:text-[#B8973B] transition-colors">
                    <Navigation size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Developers */}
        {activeTab === 'developers' && (
          <div className="space-y-4">
            {developers.map(dev => (
              <div key={dev.id} className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-[#09090B]">{dev.name}</div>
                    <div className="text-xs text-[#71717A] mt-1 max-w-lg line-clamp-2">{dev.overview}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inventory */}
        {activeTab === 'inventory' && (
          <div className="overflow-hidden rounded-2xl border border-[#E4E4E7]">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F4F4F5] border-b border-[#E4E4E7]">
                  {['Project', 'Config', 'Floor', 'Carpet', 'Price', 'Status', 'View'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allProjects.flatMap(p => p.availableInventory.map(u => ({ ...u, pName: p.name, pId: p.id, locId: p.locationId }))).map(u => (
                  <tr key={u.id} className="border-t border-[#F4F4F5] hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3 text-sm font-medium text-[#09090B]">{u.pName}</td>
                    <td className="px-4 py-3 text-sm text-[#52525B]">{u.configuration}</td>
                    <td className="px-4 py-3 text-sm text-[#52525B]">{u.floor}</td>
                    <td className="px-4 py-3 text-sm text-[#52525B]">{u.carpetArea}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#B8973B]">{u.price}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold', u.status === 'Available' ? 'bg-[#ECFDF5] text-[#059669]' : u.status === 'Reserved' ? 'bg-[#FFF7ED] text-[#EA580C]' : 'bg-[#F4F4F5] text-[#71717A]')}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#71717A]">{u.view}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Collections */}
        {activeTab === 'collections' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm text-[#71717A]">{collections.length} client collections</div>
            </div>
            {collections.length === 0 ? (
              <div className="p-12 rounded-2xl border border-dashed border-[#E4E4E7] text-center">
                <p className="text-[#A1A1AA] text-sm">No collections yet. Create one from the Client Tools page.</p>
                <Link href="/client/shortlist" className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B8973B] text-white text-sm hover:bg-[#A07C2A] transition-colors">
                  <Plus size={14} /> Create Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {collections.map(col => (
                  <div key={col.id} className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-[#09090B]">{col.clientName}</div>
                        <div className="text-xs text-[#71717A] mt-0.5">{col.projectIds.length} project{col.projectIds.length !== 1 ? 's' : ''}</div>
                      </div>
                      <button onClick={() => deleteCollection(col.id)} className="p-1.5 hover:bg-[#FEF2F2] rounded-lg text-[#A1A1AA] hover:text-red-500 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/share/${col.slug}`} target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#09090B] text-white text-xs hover:bg-[#27272A] transition-colors">
                        <ExternalLink size={11} /> Open Presentation
                      </Link>
                      <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/share/${col.slug}`) }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4E4E7] text-xs text-[#52525B] hover:bg-[#F4F4F5] transition-colors">
                        <Copy size={11} /> Copy Link
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
