import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#E4E4E7] bg-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <div className="text-base font-600 text-[#09090B]">Value Properties</div>
              <div className="text-xs text-[#B8973B] tracking-widest uppercase mt-0.5">Curated by Sreeja</div>
            </div>
            <p className="text-sm text-[#71717A] leading-relaxed max-w-xs">
              A private luxury real estate intelligence platform designed to help clients understand South Mumbai's most prestigious addresses, projects, pricing and future growth potential.
            </p>
          </div>
          <div>
            <div className="text-xs font-600 text-[#A1A1AA] tracking-widest uppercase mb-4">Platform</div>
            <nav className="flex flex-col gap-2">
              {[
                ['Intelligence Map', '/map'],
                ['Properties', '/properties'],
                ['Market Intelligence', '/intelligence'],
                ['Connectivity', '/connectivity'],
                ['Compare Projects', '/compare'],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="text-sm text-[#52525B] hover:text-[#09090B] transition-colors">{label}</Link>
              ))}
            </nav>
          </div>
          <div>
            <div className="text-xs font-600 text-[#A1A1AA] tracking-widest uppercase mb-4">Tools</div>
            <nav className="flex flex-col gap-2">
              {[
                ['Client Match', '/client/match'],
                ['Shortlist Builder', '/client/shortlist'],
                ['Presentation Mode', '/presentation'],
                ['Admin Panel', '/admin'],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="text-sm text-[#52525B] hover:text-[#09090B] transition-colors">{label}</Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[#E4E4E7] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#A1A1AA]">© 2024 Value Properties. Curated by Sreeja. All rights reserved.</p>
          <p className="text-xs text-[#A1A1AA]">A private luxury real estate intelligence platform.</p>
        </div>
      </div>
    </footer>
  )
}
