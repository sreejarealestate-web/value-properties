'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { projects } from '@/data/projects'
import { locations } from '@/data/locations'
import { Project } from '@/types'
import { Search, SlidersHorizontal, TrendingUp, ArrowRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Filters {
  location: string
  budget: [number, number]
  configuration: string
  carpetMin: number
  carpetMax: number
  viewPreference: string
  readyToMove: boolean | null
  purpose: string
  minCeilingHeight: number
  tenure: string
}

const defaultFilters: Filters = {
  location: '',
  budget: [0, 200],
  configuration: '',
  carpetMin: 0,
  carpetMax: 15000,
  viewPreference: '',
  readyToMove: null,
  purpose: '',
  minCeilingHeight: 0,
  tenure: '',
}

function matchScore(project: Project, filters: Filters): number {
  let score = 0
  let total = 0

  if (filters.location) {
    total += 30
    if (project.locationId === filters.location || project.location.toLowerCase().includes(filters.location.toLowerCase())) score += 30
  }

  if (filters.configuration) {
    total += 25
    if (project.configurations.some(c => c.type.includes(filters.configuration))) score += 25
  }

  if (filters.viewPreference) {
    total += 20
    if (project.viewTypes.some(v => v.toLowerCase().includes(filters.viewPreference.toLowerCase()))) score += 20
  }

  if (filters.readyToMove !== null) {
    total += 15
    const isReady = project.possessionStatus === 'Ready To Move' || project.possessionStatus === 'OC Received'
    if (filters.readyToMove === isReady) score += 15
  }

  if (filters.tenure) {
    total += 10
    if (project.tenure === filters.tenure) score += 10
  }

  if (total === 0) return 75
  return Math.round((score / total) * 100)
}

export default function ClientMatchPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [sortBy, setSortBy] = useState<'match' | 'price' | 'carpet' | 'possession'>('match')
  const [searched, setSearched] = useState(false)

  const results = useMemo(() => {
    if (!searched) return []
    const withScores = projects.map(p => ({ project: p, score: matchScore(p, filters) }))
    const filtered = withScores.filter(({ score }) => score > 20)
    return filtered.sort((a, b) => {
      if (sortBy === 'match') return b.score - a.score
      if (sortBy === 'price') return a.project.currentPricePerSqFt - b.project.currentPricePerSqFt
      if (sortBy === 'carpet') return parseInt(b.project.configurations[0]?.carpetArea || '0') - parseInt(a.project.configurations[0]?.carpetArea || '0')
      return 0
    })
  }, [filters, sortBy, searched])

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-4">Client Tools</div>
          <h1 className="text-4xl font-light text-[#09090B] tracking-tight">Smart Client Match</h1>
          <p className="text-[#71717A] mt-3">Enter client requirements to instantly find and rank matching properties.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-3xl border border-[#E4E4E7] bg-white space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <SlidersHorizontal size={16} className="text-[#B8973B]" />
                <span className="font-medium text-[#09090B]">Client Requirements</span>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-2">Preferred Location</label>
                <select
                  value={filters.location}
                  onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] text-sm text-[#09090B] bg-white focus:outline-none focus:border-[#B8973B]"
                >
                  <option value="">Any Location</option>
                  {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>

              {/* Configuration */}
              <div>
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-2">Configuration</label>
                <div className="grid grid-cols-3 gap-2">
                  {['', '2 BHK', '3 BHK', '4 BHK', 'Penthouse', 'Duplex'].map(c => (
                    <button
                      key={c}
                      onClick={() => setFilters(f => ({ ...f, configuration: c }))}
                      className={cn('px-2 py-2 rounded-xl border text-xs font-medium transition-all', filters.configuration === c ? 'bg-[#09090B] border-[#09090B] text-white' : 'border-[#E4E4E7] text-[#52525B] hover:border-[#B8973B]/40')}
                    >
                      {c || 'Any'}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Preference */}
              <div>
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-2">View Preference</label>
                <select
                  value={filters.viewPreference}
                  onChange={e => setFilters(f => ({ ...f, viewPreference: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] text-sm bg-white focus:outline-none focus:border-[#B8973B]"
                >
                  <option value="">Any View</option>
                  {['Sea View', 'Arabian Sea Facing', 'Racecourse View', 'City Skyline View', 'Garden View'].map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Ready to move */}
              <div>
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-2">Possession</label>
                <div className="grid grid-cols-3 gap-2">
                  {[null, true, false].map((val, i) => (
                    <button
                      key={i}
                      onClick={() => setFilters(f => ({ ...f, readyToMove: val }))}
                      className={cn('px-2 py-2 rounded-xl border text-xs font-medium transition-all', filters.readyToMove === val ? 'bg-[#09090B] border-[#09090B] text-white' : 'border-[#E4E4E7] text-[#52525B] hover:border-[#B8973B]/40')}
                    >
                      {val === null ? 'Any' : val ? 'Ready' : 'Under Construction'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenure */}
              <div>
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-2">Tenure</label>
                <div className="grid grid-cols-3 gap-2">
                  {['', 'Freehold', 'Leasehold'].map(t => (
                    <button
                      key={t}
                      onClick={() => setFilters(f => ({ ...f, tenure: t }))}
                      className={cn('px-2 py-2 rounded-xl border text-xs font-medium transition-all', filters.tenure === t ? 'bg-[#09090B] border-[#09090B] text-white' : 'border-[#E4E4E7] text-[#52525B] hover:border-[#B8973B]/40')}
                    >
                      {t || 'Any'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSearched(true)}
                className="w-full py-3 rounded-2xl bg-[#B8973B] text-white font-medium hover:bg-[#A07C2A] transition-colors flex items-center justify-center gap-2"
              >
                <Search size={16} /> Find Matches
              </button>

              {searched && (
                <button onClick={() => { setFilters(defaultFilters); setSearched(false) }} className="w-full py-2 text-sm text-[#A1A1AA] hover:text-[#09090B] transition-colors">
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {!searched ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 rounded-3xl bg-[#F5EED4] flex items-center justify-center mb-4">
                  <Search size={24} className="text-[#B8973B]" />
                </div>
                <h3 className="text-lg font-light text-[#09090B] mb-2">Set your requirements</h3>
                <p className="text-sm text-[#A1A1AA]">Configure client preferences and click Find Matches to see ranked results.</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-[#71717A]"><span className="font-semibold text-[#09090B]">{results.length}</span> matches found</div>
                  <div className="flex gap-2">
                    {(['match', 'price', 'carpet'] as const).map(s => (
                      <button key={s} onClick={() => setSortBy(s)} className={cn('px-3 py-1.5 rounded-xl text-xs font-medium transition-all', sortBy === s ? 'bg-[#09090B] text-white' : 'border border-[#E4E4E7] text-[#52525B] hover:bg-[#F4F4F5]')}>
                        {s === 'match' ? 'Best Match' : s === 'price' ? 'Lowest Price' : 'Largest Carpet'}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="popLayout">
                  {results.map(({ project, score }, i) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="mb-4 p-5 rounded-2xl border border-[#E4E4E7] bg-white hover:border-[#B8973B]/30 transition-all"
                    >
                      <div className="flex gap-4">
                        <img src={project.elevationImage} alt={project.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-medium text-[#09090B]">{project.name}</h3>
                              <p className="text-xs text-[#71717A] mt-0.5">{project.developer} · {project.location}</p>
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-center w-14">
                              <div className={cn('text-xl font-light', score >= 80 ? 'text-[#059669]' : score >= 60 ? 'text-[#B8973B]' : 'text-[#71717A]')}>
                                {score}%
                              </div>
                              <div className="text-[10px] text-[#A1A1AA]">Match</div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs text-[#B8973B] font-medium">₹{(project.currentPricePerSqFt/1000).toFixed(0)}K/sqft</span>
                            <span className="text-xs text-[#A1A1AA]">·</span>
                            <span className="text-xs text-[#71717A]">{project.configurations.map(c => c.type).join(', ')}</span>
                            <span className="text-xs text-[#A1A1AA]">·</span>
                            <span className={cn('text-xs', project.possessionStatus === 'Ready To Move' ? 'text-[#059669]' : 'text-[#EA580C]')}>
                              {project.possessionStatus}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <Link href={`/properties/${project.locationId}/${project.id}`} className="text-xs px-3 py-1.5 rounded-lg bg-[#09090B] text-white hover:bg-[#27272A] transition-colors">Details</Link>
                            <Link href={`/compare?add=${project.id}`} className="text-xs px-3 py-1.5 rounded-lg border border-[#E4E4E7] text-[#52525B] hover:bg-[#F4F4F5] transition-colors">Compare</Link>
                            <Link href={`/presentation/${project.id}`} className="text-xs px-3 py-1.5 rounded-lg border border-[#E4E4E7] text-[#52525B] hover:bg-[#F4F4F5] transition-colors">Present</Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {results.length === 0 && (
                  <div className="text-center py-16 text-[#A1A1AA]">
                    <p>No matches found. Try adjusting your filters.</p>
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
