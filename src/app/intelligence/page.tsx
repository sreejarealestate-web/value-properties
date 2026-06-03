'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { locations } from '@/data/locations'
import { projects } from '@/data/projects'
import { TrendingUp, BarChart3, Home, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function IntelligencePage() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0])

  const locationProjects = projects.filter(p => p.locationId === selectedLocation.id)

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-4">Market Data</div>
          <h1 className="text-4xl font-light text-[#09090B] tracking-tight">South Mumbai Market Intelligence</h1>
          <p className="text-[#71717A] mt-3">Deep pricing data, appreciation analytics, and investment insights for every micro-market.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Location selector */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-4 rounded-2xl border border-[#E4E4E7] bg-white">
              <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">Micro-Markets</div>
              <div className="space-y-1">
                {locations.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={cn('w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all', selectedLocation.id === loc.id ? 'bg-[#09090B] text-white' : 'text-[#52525B] hover:bg-[#F4F4F5]')}
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Intelligence content */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div key={selectedLocation.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              {/* Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Average Price', value: selectedLocation.averagePricing.split(' - ')[0], sub: 'per sq ft', icon: Home },
                  { label: 'Growth Score', value: `${selectedLocation.futureGrowthScore}/100`, sub: 'future potential', icon: TrendingUp },
                  { label: 'Connectivity', value: `${selectedLocation.connectivityScore}/100`, sub: 'score', icon: BarChart3 },
                  { label: 'Lifestyle', value: `${selectedLocation.lifestyleScore}/100`, sub: 'score', icon: ArrowUpRight },
                ].map(card => (
                  <div key={card.label} className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                    <card.icon size={16} className="text-[#B8973B] mb-3" />
                    <div className="text-xl font-light text-[#09090B] tracking-tight">{card.value}</div>
                    <div className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mt-1">{card.label}</div>
                    <div className="text-xs text-[#71717A] mt-0.5">{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* Intelligence scores visual */}
              <div className="p-6 rounded-2xl border border-[#E4E4E7] bg-white mb-6">
                <h3 className="text-base font-medium text-[#09090B] mb-6">{selectedLocation.name} Intelligence Dashboard</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { label: 'Connectivity Score', score: selectedLocation.connectivityScore },
                    { label: 'Infrastructure Score', score: selectedLocation.infrastructureScore },
                    { label: 'Lifestyle Score', score: selectedLocation.lifestyleScore },
                    { label: 'Future Growth Score', score: selectedLocation.futureGrowthScore },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#52525B]">{s.label}</span>
                        <span className="font-semibold text-[#09090B]">{s.score}</span>
                      </div>
                      <div className="h-2 bg-[#F4F4F5] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.score}%` }}
                          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                          className="h-full rounded-full bg-gradient-to-r from-[#B8973B] to-[#D4AF5A]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Area overview */}
              <div className="p-6 rounded-2xl border border-[#E4E4E7] bg-white mb-6">
                <h3 className="text-base font-medium text-[#09090B] mb-4">Area Overview</h3>
                <p className="text-sm text-[#52525B] leading-relaxed mb-4">{selectedLocation.overview}</p>
                <div className="p-4 rounded-xl bg-[#F5EED4]">
                  <div className="text-xs font-semibold text-[#A07C2A] uppercase tracking-wider mb-2">Future Potential</div>
                  <p className="text-sm text-[#78350F]">{selectedLocation.futurePotential}</p>
                </div>
              </div>

              {/* Projects with price data */}
              {locationProjects.length > 0 && (
                <div className="p-6 rounded-2xl border border-[#E4E4E7] bg-white mb-6">
                  <h3 className="text-base font-medium text-[#09090B] mb-5">Project Price Intelligence</h3>
                  <div className="overflow-hidden rounded-2xl border border-[#F4F4F5]">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#F4F4F5]">
                          {['Project', 'Developer', 'Launch', 'Current ₹/sqft', 'Historical ₹/sqft', 'Appreciation', 'Rental Yield'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-[#71717A] uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {locationProjects.map(p => (
                          <tr key={p.id} className="border-t border-[#F4F4F5] hover:bg-[#FAFAFA]">
                            <td className="px-4 py-3.5">
                              <Link href={`/properties/${p.locationId}/${p.id}`} className="text-sm font-medium text-[#09090B] hover:text-[#B8973B] transition-colors">{p.name}</Link>
                            </td>
                            <td className="px-4 py-3.5 text-sm text-[#52525B]">{p.developer}</td>
                            <td className="px-4 py-3.5 text-sm text-[#71717A]">{p.launchYear || '—'}</td>
                            <td className="px-4 py-3.5 text-sm font-semibold text-[#09090B]">₹{(p.currentPricePerSqFt/1000).toFixed(0)}K</td>
                            <td className="px-4 py-3.5 text-sm text-[#71717A]">{p.historicalPricePerSqFt ? `₹${(p.historicalPricePerSqFt/1000).toFixed(0)}K` : '—'}</td>
                            <td className="px-4 py-3.5">
                              {(p.appreciationPercentage ?? 0) > 0 ? (
                                <span className="text-xs font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full">+{p.appreciationPercentage}%</span>
                              ) : <span className="text-xs text-[#A1A1AA]">—</span>}
                            </td>
                            <td className="px-4 py-3.5 text-sm text-[#B8973B]">{p.rentalYield || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Infrastructure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                  <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-4">Schools</div>
                  {selectedLocation.schools.map(s => <div key={s} className="text-sm text-[#52525B] py-1.5 border-b border-[#F4F4F5] last:border-0">{s}</div>)}
                </div>
                <div className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                  <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-4">Hospitals</div>
                  {selectedLocation.hospitals.map(h => <div key={h} className="text-sm text-[#52525B] py-1.5 border-b border-[#F4F4F5] last:border-0">{h}</div>)}
                </div>
                <div className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                  <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-4">Clubs & Lifestyle</div>
                  {selectedLocation.clubs.map(c => <div key={c} className="text-sm text-[#52525B] py-1.5 border-b border-[#F4F4F5] last:border-0">{c}</div>)}
                </div>
                <div className="p-5 rounded-2xl border border-[#E4E4E7] bg-white">
                  <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-4">Landmark Hotels</div>
                  {selectedLocation.hotels.map(h => <div key={h} className="text-sm text-[#52525B] py-1.5 border-b border-[#F4F4F5] last:border-0">{h}</div>)}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
