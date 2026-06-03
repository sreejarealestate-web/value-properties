'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { developers } from '@/data/developers'
import { projects } from '@/data/projects'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

export default function DeveloperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const developer = developers.find(d => d.id === id)
  if (!developer) notFound()

  const developerProjects = projects.filter(p => p.developerId === id)

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <Link href="/intelligence" className="flex items-center gap-2 text-sm text-[#71717A] hover:text-[#09090B] mb-8 transition-colors">
          <ArrowLeft size={14} /> Developers
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-4">Developer Profile</div>
          <h1 className="text-5xl font-light text-[#09090B] tracking-tight mb-6">{developer.name}</h1>
          <p className="text-[#52525B] text-lg leading-relaxed max-w-3xl mb-12">{developer.overview}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[
                { label: 'Construction Quality', value: developer.constructionQuality },
                { label: 'Reputation', value: developer.reputation },
                { label: 'Design Philosophy', value: developer.designPhilosophy },
                { label: 'Delivery Track Record', value: developer.deliveryTrackRecord },
              ].map(item => (
                <div key={item.label} className="p-6 rounded-2xl border border-[#E4E4E7] bg-white">
                  <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">{item.label}</div>
                  <p className="text-sm text-[#52525B] leading-relaxed">{item.value}</p>
                </div>
              ))}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-6 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0]">
                  <div className="text-xs font-semibold text-[#059669] uppercase tracking-wider mb-4">Strengths</div>
                  <ul className="space-y-2">
                    {developer.strengths.map(s => (
                      <li key={s} className="flex gap-2 text-sm text-[#052e16]">
                        <CheckCircle size={14} className="text-[#059669] flex-shrink-0 mt-0.5" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA]">
                  <div className="text-xs font-semibold text-[#EA580C] uppercase tracking-wider mb-4">Weaknesses</div>
                  <ul className="space-y-2">
                    {developer.weaknesses.map(w => (
                      <li key={w} className="flex gap-2 text-sm text-[#431407]">
                        <AlertCircle size={14} className="text-[#EA580C] flex-shrink-0 mt-0.5" /> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {developerProjects.length > 0 && (
                <div>
                  <h2 className="text-xl font-light text-[#09090B] tracking-tight mb-5">Projects</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {developerProjects.map(project => (
                      <Link key={project.id} href={`/properties/${project.locationId}/${project.id}`} className="group flex gap-3 p-4 rounded-2xl border border-[#E4E4E7] bg-white hover:border-[#B8973B]/30 transition-all">
                        <img src={project.elevationImage} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-[#09090B]">{project.name}</div>
                          <div className="text-xs text-[#71717A] mt-0.5">{project.location}</div>
                          <div className="text-xs text-[#B8973B] mt-1">₹{(project.currentPricePerSqFt/1000).toFixed(0)}K/sqft</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="sticky top-24 p-6 rounded-2xl border border-[#E4E4E7] bg-white">
                <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-4">Signature Projects</div>
                {developer.signatureProjects.map(p => (
                  <div key={p} className="py-2 border-b border-[#F4F4F5] last:border-0 text-sm text-[#52525B]">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
