'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, MapPin, BarChart3, Users, GitCompare, Compass, ChevronDown } from 'lucide-react'
import { locations } from '@/data/locations'
import { projects } from '@/data/projects'

const features = [
  {
    icon: MapPin,
    title: 'Intelligence Map',
    description: 'Interactive micro-market map with project intelligence, boundary highlights, and real-time market data.',
    href: '/map',
  },
  {
    icon: BarChart3,
    title: 'Market Intelligence',
    description: 'Pricing history, appreciation analytics, rental yields, and investment thesis for every address.',
    href: '/intelligence',
  },
  {
    icon: Users,
    title: 'Client Match Engine',
    description: 'Instantly match client requirements with inventory ranked by fit score and advisory insights.',
    href: '/client/match',
  },
  {
    icon: GitCompare,
    title: 'Project Comparison',
    description: 'Side-by-side comparison of up to 6 projects across 20+ parameters. Export as PDF.',
    href: '/compare',
  },
  {
    icon: Compass,
    title: 'Connectivity Intelligence',
    description: 'Real travel times, infrastructure layers, and future connectivity from any project.',
    href: '/connectivity',
  },
]

const stats = [
  { value: `${locations.length}+`, label: 'Micro-Markets' },
  { value: `${projects.length}+`, label: 'Curated Projects' },
  { value: '₹500Cr+', label: 'Transactions Advised' },
  { value: '100%', label: 'Ultra Luxury Focus' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#09090B] via-[#18181B] to-[#09090B]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#B8973B] blur-[120px] opacity-20" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#B8973B] blur-[100px] opacity-15" />
        </div>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#B8973B]/30 bg-[#B8973B]/10 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8973B]" />
              <span className="text-[#B8973B] text-xs font-semibold tracking-widest uppercase">Curated by Shreeja</span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-white mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            Making your real estate search
            <br />seamless, personalised and{' '}
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6 }}
              style={{ background: 'linear-gradient(135deg, #B8973B 0%, #D4AF5A 40%, #E8C56A 60%, #B8973B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', backgroundSize: '200% auto', display: 'inline-block' }}
            >
              valued.
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#A1A1AA] text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ fontWeight: 300 }}
          >
            A private luxury real estate intelligence platform designed to help clients understand South Mumbai&apos;s most prestigious addresses, projects, pricing and future growth potential.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/map" className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#B8973B] text-white font-medium hover:bg-[#A07C2A] transition-all duration-300">
              Explore Intelligence Map
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/properties" className="flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-white/20 text-white hover:bg-white/5 transition-all duration-300">
              View Properties
            </Link>
          </motion.div>
        </div>
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40" animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown size={20} />
        </motion.div>
      </section>

      <section className="py-16 border-b border-[#E4E4E7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-3xl font-light text-[#09090B] mb-1 tracking-tight">{stat.value}</div>
                <div className="text-xs text-[#A1A1AA] font-semibold tracking-widest uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-4">Platform Intelligence</div>
            <h2 className="text-4xl font-light text-[#09090B] tracking-tight mb-4">
              Everything your client needs<br />
              <span className="text-[#52525B]">to make the right decision.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.href} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Link href={feature.href} className="group block p-8 rounded-3xl border border-[#E4E4E7] bg-white hover:border-[#B8973B]/30 hover:shadow-lg transition-all duration-500">
                  <div className="w-10 h-10 rounded-2xl bg-[#F5EED4] flex items-center justify-center mb-6 group-hover:bg-[#B8973B] transition-colors duration-300">
                    <feature.icon size={18} className="text-[#B8973B] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-base font-medium text-[#09090B] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#71717A] leading-relaxed">{feature.description}</p>
                  <div className="mt-6 flex items-center gap-1 text-[#B8973B] text-xs font-medium">
                    Explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#F4F4F5] px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs font-semibold text-[#B8973B] tracking-widest uppercase mb-3">Micro-Markets</div>
              <h2 className="text-3xl font-light text-[#09090B] tracking-tight">South Mumbai&apos;s finest addresses</h2>
            </div>
            <Link href="/properties" className="hidden md:flex items-center gap-1.5 text-sm text-[#52525B] hover:text-[#09090B] transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {locations.slice(0, 10).map((location, i) => (
              <motion.div key={location.id} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link href={`/properties/${location.slug}`} className="group block relative overflow-hidden rounded-2xl aspect-[3/4]">
                  <img src={location.heroImage} alt={location.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-white text-sm font-medium">{location.name}</div>
                    <div className="text-white/60 text-xs mt-0.5">{location.averagePricing.split('-')[0].trim()}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-light text-[#09090B] tracking-tight mb-6">
              Ready to find your<br />
              <span style={{ background: 'linear-gradient(135deg, #B8973B 0%, #D4AF5A 50%, #B8973B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                perfect South Mumbai address?
              </span>
            </h2>
            <p className="text-[#71717A] mb-10">Let our intelligence platform guide you to the right home.</p>
            <Link href="/client/match" className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-[#09090B] text-white hover:bg-[#27272A] transition-all duration-300">
              Start Your Search <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
