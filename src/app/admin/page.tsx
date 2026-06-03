'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { projects } from '@/data/projects'
import { locations } from '@/data/locations'
import { developers } from '@/data/developers'
import { Plus, Edit2, Trash2, Upload, Building2, MapPin, Users, BarChart3, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const ADMIN_PASSWORD = 'valueprop2024'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'projects' | 'locations' | 'developers' | 'inventory'>('projects')

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

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
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-xl border border-[#E4E4E7] text-sm focus:outline-none focus:border-[#B8973B] mb-4"
            />
            {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl bg-[#09090B] text-white font-medium hover:bg-[#27272A] transition-colors"
            >
              Access Admin
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-2">Admin Panel</div>
            <h1 className="text-3xl font-light text-[#09090B] tracking-tight">Content Management</h1>
          </div>
          <button onClick={() => setAuthed(false)} className="text-sm text-[#71717A] hover:text-[#09090B] transition-colors">Sign Out</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Projects', value: projects.length, icon: Building2 },
            { label: 'Locations', value: locations.length, icon: MapPin },
            { label: 'Developers', value: developers.length, icon: Users },
            { label: 'Inventory Units', value: projects.reduce((acc, p) => acc + p.availableInventory.length, 0), icon: BarChart3 },
          ].map(stat => (
            <div key={stat.label} className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
              <stat.icon size={16} className="text-[#B8973B] mb-3" />
              <div className="text-2xl font-light text-[#09090B]">{stat.value}</div>
              <div className="text-xs text-[#A1A1AA] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#F4F4F5] rounded-2xl w-fit mb-8">
          {(['projects', 'locations', 'developers', 'inventory'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn('px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize', activeTab === tab ? 'bg-white text-[#09090B] shadow-sm' : 'text-[#71717A] hover:text-[#09090B]')}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Projects tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm text-[#71717A]">{projects.length} projects</div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B8973B] text-white text-sm hover:bg-[#A07C2A] transition-colors">
                <Plus size={14} /> Add Project
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#E4E4E7]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F4F4F5] border-b border-[#E4E4E7]">
                    {['Project', 'Developer', 'Location', 'Price/sqft', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id} className="border-t border-[#F4F4F5] hover:bg-[#FAFAFA]">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img src={project.elevationImage} alt="" className="w-9 h-9 rounded-lg object-cover" />
                          <span className="text-sm font-medium text-[#09090B]">{project.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#52525B]">{project.developer}</td>
                      <td className="px-4 py-3.5 text-sm text-[#52525B]">{project.location}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-[#B8973B]">₹{(project.currentPricePerSqFt/1000).toFixed(0)}K</td>
                      <td className="px-4 py-3.5">
                        <span className={cn('text-[10px] px-2.5 py-1 rounded-full font-semibold',
                          project.possessionStatus === 'Ready To Move' ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FFF7ED] text-[#EA580C]'
                        )}>
                          {project.possessionStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <Link href={`/properties/${project.locationId}/${project.id}`} className="p-1.5 rounded-lg hover:bg-[#F4F4F5] text-[#71717A] hover:text-[#09090B] transition-colors">
                            <Edit2 size={14} />
                          </Link>
                          <button className="p-1.5 rounded-lg hover:bg-[#FEF2F2] text-[#71717A] hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-[#F4F4F5] text-[#71717A] hover:text-[#09090B] transition-colors">
                            <Upload size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Locations tab */}
        {activeTab === 'locations' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm text-[#71717A]">{locations.length} locations</div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B8973B] text-white text-sm hover:bg-[#A07C2A] transition-colors">
                <Plus size={14} /> Add Location
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map(loc => (
                <div key={loc.id} className="p-4 rounded-2xl border border-[#E4E4E7] bg-white flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#09090B]">{loc.name}</div>
                    <div className="text-xs text-[#71717A] mt-0.5">{loc.averagePricing.split('-')[0].trim()}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-[#F4F4F5] text-[#71717A] transition-colors"><Edit2 size={13} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-[#FEF2F2] text-[#71717A] hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Developers tab */}
        {activeTab === 'developers' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm text-[#71717A]">{developers.length} developers</div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B8973B] text-white text-sm hover:bg-[#A07C2A] transition-colors">
                <Plus size={14} /> Add Developer
              </button>
            </div>
            <div className="space-y-4">
              {developers.map(dev => (
                <div key={dev.id} className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-[#09090B]">{dev.name}</div>
                      <div className="text-xs text-[#71717A] mt-1 max-w-lg line-clamp-2">{dev.overview}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-[#F4F4F5] text-[#71717A] transition-colors"><Edit2 size={13} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory tab */}
        {activeTab === 'inventory' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm text-[#71717A]">All available inventory</div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B8973B] text-white text-sm hover:bg-[#A07C2A] transition-colors">
                <Plus size={14} /> Add Unit
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#E4E4E7]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F4F4F5] border-b border-[#E4E4E7]">
                    {['Project', 'Config', 'Floor', 'Carpet Area', 'Price', 'Status', 'View'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.flatMap(p => p.availableInventory.map(unit => ({ ...unit, projectName: p.name, locationId: p.locationId, projectId: p.id }))).map(unit => (
                    <tr key={unit.id} className="border-t border-[#F4F4F5] hover:bg-[#FAFAFA]">
                      <td className="px-4 py-3.5 text-sm font-medium text-[#09090B]">{unit.projectName}</td>
                      <td className="px-4 py-3.5 text-sm text-[#52525B]">{unit.configuration}</td>
                      <td className="px-4 py-3.5 text-sm text-[#52525B]">{unit.floor}</td>
                      <td className="px-4 py-3.5 text-sm text-[#52525B]">{unit.carpetArea}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-[#B8973B]">{unit.price}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold',
                          unit.status === 'Available' ? 'bg-[#ECFDF5] text-[#059669]' :
                          unit.status === 'Reserved' ? 'bg-[#FFF7ED] text-[#EA580C]' : 'bg-[#F4F4F5] text-[#71717A]'
                        )}>
                          {unit.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#71717A]">{unit.view}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
