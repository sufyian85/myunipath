import React from 'react';

interface FooterProps {
  /** Use "dark" on immersive/dark-background pages (WelcomePage, ResultPage) */
  variant?: 'light' | 'dark';
}

export function Footer({ variant = 'light' }: FooterProps) {
  const year = new Date().getFullYear();
  const isDark = variant === 'dark';

  return (
    <footer
      className={`w-full ${
        isDark
          ? 'bg-black/40 border-t border-white/10 backdrop-blur-sm'
          : 'bg-background border-t border-border'
      }`}
    >
      {/* Main footer row */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

          {/* Left: MyUniPath brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <img
                src="/myunipath-logo.svg"
                alt="MyUniPath"
                className="h-10 w-auto object-contain"
                style={{ filter: isDark ? 'brightness(0) invert(1)' : 'none' }}
              />
            </div>
            <p className={`text-xs leading-relaxed mt-1 max-w-xs ${isDark ? 'text-white/55' : 'text-muted-foreground'}`}>
              A gamified programme discovery platform helping students find their ideal path at CCI, UNITEN.
            </p>
          </div>

          {/* Centre: Institutional logos */}
          <div className="flex items-center justify-center gap-8">
            <img
              src="/cci-logo.png"
              alt="College of Informatics and Computing, UNITEN"
              className="h-16 w-auto object-contain"
            />
            <div className={`w-px h-14 ${isDark ? 'bg-white/20' : 'bg-border'}`} />
            <img
              src="/uniten-logo.png"
              alt="Universiti Tenaga Nasional"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Right: Institution address */}
          <div className={`text-right text-xs space-y-1 ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}>
            <p className={`font-semibold text-sm ${isDark ? 'text-white/90' : 'text-foreground'}`}>
              College of Informatics and Computing
            </p>
            <p>Universiti Tenaga Nasional (UNITEN)</p>
            <p>1 Jalan IKRAM-UNITEN, 43000 Kajang</p>
            <p>Selangor, Malaysia</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={`border-t ${isDark ? 'border-white/10' : 'border-border'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className={`text-xs ${isDark ? 'text-white/40' : 'text-muted-foreground'}`}>
            &copy; {year} MyUniPath &middot; CCI, UNITEN. All rights reserved.
          </p>

          <p className={`text-xs text-center ${isDark ? 'text-white/55' : 'text-muted-foreground'}`}>
            Created, designed and owned by{' '}
            <span className={`font-semibold ${isDark ? 'text-white/80' : 'text-foreground'}`}>
              Muhammad Sufyian
            </span>
            {' & '}
            <span className={`font-semibold ${isDark ? 'text-white/80' : 'text-foreground'}`}>
              Muhammad Akeef
            </span>
          </p>

          <p className={`text-xs ${isDark ? 'text-white/30' : 'text-muted-foreground/60'}`}>
            v1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
}
