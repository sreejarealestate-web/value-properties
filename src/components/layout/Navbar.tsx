'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Menu, X, MapPin, LayoutGrid, BarChart3, GitCompare, Users, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/map', label: 'Intelligence Map', icon: MapPin },
  { href: '/properties', label: 'Properties', icon: LayoutGrid },
  { href: '/intelligence', label: 'Market Intelligence', icon: BarChart3 },
  { href: '/connectivity', label: 'Connectivity', icon: Compass },
  { href: '/compare', label: 'Compare', icon: GitCompare },
  { href: '/client', label: 'Client Tools', icon: Users },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const isPresentation = pathname?.includes('/presentation')

  if (isPresentation) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="glass mx-4 mt-4 rounded-2xl px-6 py-3 flex items-center justify-between shadow-sm shadow-black/5">
        {/* Brand */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-sm font-600 tracking-tight text-[#09090B]">Value Properties</span>
          <span className="text-[10px] font-400 text-[#B8973B] tracking-widest uppercase">Curated by Sreeja</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const active = pathname?.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-sm transition-all duration-200',
                  active
                    ? 'bg-[#09090B] text-white font-500'
                    : 'text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5]'
                )}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/client/match" className="px-4 py-1.5 rounded-xl bg-[#B8973B] text-white text-sm font-500 hover:bg-[#A07C2A] transition-colors">
            Find Match
          </Link>
          <Link href="/admin" className="px-3.5 py-1.5 rounded-xl border border-[#E4E4E7] text-sm text-[#52525B] hover:bg-[#F4F4F5] transition-colors">
            Admin
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded-xl hover:bg-[#F4F4F5] transition-colors"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass mx-4 mt-2 rounded-2xl p-4 shadow-lg lg:hidden"
          >
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                  pathname?.startsWith(href)
                    ? 'bg-[#09090B] text-white'
                    : 'text-[#52525B] hover:bg-[#F4F4F5]'
                )}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-[#E4E4E7] flex gap-2">
              <Link href="/client/match" onClick={() => setOpen(false)} className="flex-1 py-2 text-center rounded-xl bg-[#B8973B] text-white text-sm font-500">
                Find Match
              </Link>
              <Link href="/admin" onClick={() => setOpen(false)} className="flex-1 py-2 text-center rounded-xl border border-[#E4E4E7] text-sm text-[#52525B]">
                Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
