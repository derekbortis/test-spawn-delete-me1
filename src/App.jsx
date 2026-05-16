import { useState, useEffect } from 'react'

/*
 * ─────────────────────────────────────────────────────────────────────
 *  ASSISTED LIVING TEMPLATE
 *  Replace every {{PLACEHOLDER}} below with the client's real value.
 *  See README.md at the project root for the full list of variables
 *  and recommended image sizes.
 * ─────────────────────────────────────────────────────────────────────
 */

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return 'light'
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const toggleTheme = () =>
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const navLinks = [
    ['About', '#about'],
    ['Services', '#services'],
    ['Our Home', '#gallery'],
    ['Contact', '#contact'],
  ]

  // Edit titles / descriptions per the client's offerings.
  const services = [
    {
      n: '01',
      title: '{{SERVICE_1_TITLE}}',
      body: '{{SERVICE_1_DESCRIPTION}}',
    },
    {
      n: '02',
      title: '{{SERVICE_2_TITLE}}',
      body: '{{SERVICE_2_DESCRIPTION}}',
    },
    {
      n: '03',
      title: '{{SERVICE_3_TITLE}}',
      body: '{{SERVICE_3_DESCRIPTION}}',
    },
  ]

  return (
    <div className="font-['Jost'] font-light bg-[#EFE5D3] dark:bg-[#0D0D0D] text-[#2A1810] dark:text-white antialiased selection:bg-[#C9A96E] selection:text-[#1F140C] transition-colors duration-500 overflow-x-hidden">
      {/* NAV */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? 'bg-[#1F140C]/92 dark:bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#C9A96E]/20 dark:border-[#C9A96E]/15'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 flex items-center justify-between">
          <a
            href="#top"
            onClick={() => setMenuOpen(false)}
            className="flex items-center shrink-0"
          >
            <img
              src="/images/logo-icon.png"
              alt="{{BUSINESS_NAME}}"
              className="h-16 sm:h-20 md:h-28 lg:h-40 w-auto"
            />
          </a>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-xs tracking-[0.22em] uppercase text-white/75 hover:text-[#C9A96E] transition-colors duration-300"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <a
              href="tel:{{PHONE_DIGITS}}"
              className="hidden md:inline-block border border-[#C9A96E] text-[#C9A96E] px-5 py-2.5 text-xs tracking-[0.18em] hover:bg-[#C9A96E] hover:text-[#1F140C] transition-all duration-300"
            >
              {'{{PHONE}}'}
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="md:hidden relative h-10 w-10 flex items-center justify-center border border-[#C9A96E]/70 text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#1F140C] transition-all duration-300"
            >
              <span
                className={`absolute h-px w-5 bg-current transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-0' : '-translate-y-[5px]'
                }`}
              />
              <span
                className={`absolute h-px w-5 bg-current transition-opacity duration-200 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute h-px w-5 bg-current transition-all duration-300 ${
                  menuOpen ? '-rotate-45 translate-y-0' : 'translate-y-[5px]'
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-[#1F140C]/97 dark:bg-[#0D0D0D]/97 backdrop-blur-lg"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`relative h-full flex flex-col items-center justify-center gap-7 px-6 transition-all duration-500 ${
            menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          {navLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="font-['Playfair_Display'] text-3xl text-white hover:text-[#C9A96E] transition-colors duration-300"
            >
              {label}
            </a>
          ))}
          <div className="h-px w-16 bg-[#C9A96E]/40 my-4" />
          <a
            href="tel:{{PHONE_DIGITS}}"
            onClick={() => setMenuOpen(false)}
            className="bg-[#C9A96E] text-[#1F140C] px-8 py-4 text-xs tracking-[0.22em] uppercase font-medium hover:bg-[#D4AF6A] transition-colors duration-300"
          >
            {'{{PHONE}}'}
          </a>
          <a
            href="mailto:{{EMAIL}}"
            onClick={() => setMenuOpen(false)}
            className="border border-[#C9A96E] text-[#C9A96E] px-8 py-4 text-xs tracking-[0.22em] uppercase hover:bg-[#C9A96E] hover:text-[#1F140C] transition-all duration-300"
          >
            Send Email
          </a>
        </div>
      </div>

      {/* HERO */}
      <section
        id="top"
        className="relative min-h-screen min-h-[100dvh] flex items-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt="{{BUSINESS_NAME}} exterior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1F140C]/85 via-[#1F140C]/55 to-[#1F140C] dark:from-[#0D0D0D]/85 dark:via-[#0D0D0D]/55 dark:to-[#0D0D0D]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F140C]/80 dark:from-[#0D0D0D]/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-28 sm:pt-32 md:pt-40 lg:pt-52 pb-20 md:pb-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <span className="h-px w-10 md:w-12 bg-[#C9A96E]" />
              <span className="text-[#C9A96E] text-[10px] md:text-[11px] tracking-[0.35em] uppercase">
                {'{{CITY}}'} · {'{{STATE}}'}
              </span>
            </div>
            <h1 className="font-['Playfair_Display'] text-[42px] sm:text-6xl md:text-7xl lg:text-[88px] text-white leading-[1.05] mb-6 md:mb-8 tracking-tight">
              {'{{HERO_HEADLINE_PRIMARY}}'}
              <br />
              <span className="italic text-[#C9A96E]">
                {'{{HERO_HEADLINE_ACCENT}}'}
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/75 leading-relaxed max-w-xl mb-8 md:mb-12 font-light">
              {'{{HERO_SUBTEXT}}'}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <a
                href="#contact"
                className="bg-[#C9A96E] text-[#1F140C] px-7 py-4 text-xs tracking-[0.22em] uppercase font-medium text-center hover:bg-[#D4AF6A] transition-colors duration-300"
              >
                Schedule a Tour
              </a>
              <a
                href="#services"
                className="border border-[#C9A96E]/70 text-[#C9A96E] px-7 py-4 text-xs tracking-[0.22em] uppercase text-center hover:bg-[#C9A96E] hover:text-[#1F140C] transition-all duration-300"
              >
                Our Care Levels
              </a>
            </div>
          </div>

          <div className="hidden md:flex absolute bottom-12 right-6 lg:right-10 items-end gap-8 lg:gap-12">
            <Stat number="{{STAT_1_NUMBER}}" label="{{STAT_1_LABEL}}" />
            <span className="h-12 w-px bg-[#C9A96E]/30" />
            <Stat number="{{STAT_2_NUMBER}}" label="{{STAT_2_LABEL}}" />
            <span className="h-12 w-px bg-[#C9A96E]/30" />
            <Stat number="{{STAT_3_NUMBER}}" label="{{STAT_3_LABEL}}" />
          </div>

          <div className="md:hidden mt-12 grid grid-cols-3 gap-4 border-t border-[#C9A96E]/25 pt-6">
            <StatMobile number="{{STAT_1_NUMBER}}" label="{{STAT_1_LABEL_SHORT}}" />
            <StatMobile number="{{STAT_2_NUMBER}}" label="{{STAT_2_LABEL_SHORT}}" />
            <StatMobile number="{{STAT_3_NUMBER}}" label="{{STAT_3_LABEL_SHORT}}" />
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="bg-[#E5D8BD] dark:bg-[#111111] border-y border-[#C9A96E]/30 dark:border-[#C9A96E]/10 transition-colors duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto">
          <Pillar
            icon="✦"
            title="{{PILLAR_1_TITLE}}"
            body="{{PILLAR_1_BODY}}"
            border
          />
          <Pillar
            icon="❋"
            title="{{PILLAR_2_TITLE}}"
            body="{{PILLAR_2_BODY}}"
            border
          />
          <Pillar
            icon="♡"
            title="{{PILLAR_3_TITLE}}"
            body="{{PILLAR_3_BODY}}"
          />
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="grid grid-cols-1 lg:grid-cols-2 scroll-mt-20 md:scroll-mt-28 lg:scroll-mt-40"
      >
        <div className="relative min-h-[380px] sm:min-h-[480px] lg:min-h-[720px]">
          <img
            src="/images/about.jpg"
            alt="{{BUSINESS_NAME}} home"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F140C]/85 via-[#1F140C]/25 to-transparent dark:from-[#0D0D0D]/90 dark:via-[#0D0D0D]/30" />
          <div className="absolute bottom-8 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 z-10">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <span className="h-px w-10 bg-[#C9A96E]" />
              <span className="text-[#C9A96E] text-[11px] tracking-[0.3em] uppercase">
                Our Home
              </span>
            </div>
            <p className="font-['Playfair_Display'] italic text-white text-xl sm:text-2xl lg:text-3xl leading-snug max-w-md">
              {'{{ABOUT_IMAGE_CAPTION}}'}
            </p>
          </div>
        </div>

        <div className="bg-[#EFE5D3] dark:bg-[#0D0D0D] p-8 sm:p-10 md:p-16 lg:p-20 flex flex-col justify-center transition-colors duration-500">
          <div className="text-[#C9A96E] text-[11px] tracking-[0.35em] uppercase mb-5 sm:mb-6">
            About {'{{BUSINESS_SHORT_NAME}}'}
          </div>
          <h2 className="font-['Playfair_Display'] text-[34px] sm:text-4xl md:text-5xl lg:text-[52px] text-[#2A1810] dark:text-white leading-[1.12] mb-8 md:mb-10 tracking-tight">
            {'{{ABOUT_HEADLINE_PRIMARY}}'}
            <br />
            <span className="italic text-[#C9A96E]">
              {'{{ABOUT_HEADLINE_ACCENT}}'}
            </span>
          </h2>
          <p className="text-[#5C4633] dark:text-white/70 text-base md:text-lg leading-[1.85] mb-5 sm:mb-6 font-light max-w-xl">
            {'{{ABOUT_PARAGRAPH_1}}'}
          </p>
          <p className="text-[#5C4633] dark:text-white/70 text-base md:text-lg leading-[1.85] mb-8 md:mb-10 font-light max-w-xl">
            {'{{ABOUT_PARAGRAPH_2}}'}
          </p>
          <blockquote className="border-l-2 border-[#C9A96E] pl-5 sm:pl-6 font-['Playfair_Display'] italic text-lg sm:text-xl md:text-2xl text-[#2A1810] dark:text-white/90 leading-relaxed max-w-xl">
            {'{{ABOUT_BLOCKQUOTE}}'}
          </blockquote>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="relative scroll-mt-20 md:scroll-mt-28 lg:scroll-mt-40"
      >
        <div className="absolute inset-0">
          <img
            src="/images/services-bg.jpg"
            alt="{{BUSINESS_NAME}} interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1F140C]/90 dark:bg-[#0D0D0D]/92" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-20 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 mb-12 md:mb-16">
            <div className="lg:col-span-7">
              <div className="text-[#C9A96E] text-[11px] tracking-[0.35em] uppercase mb-5 sm:mb-6">
                Levels of Care
              </div>
              <h2 className="font-['Playfair_Display'] text-[34px] sm:text-4xl md:text-5xl lg:text-[52px] text-white leading-[1.12] tracking-tight">
                {'{{SERVICES_HEADLINE_PRIMARY}}'}{' '}
                <span className="italic text-[#C9A96E]">
                  {'{{SERVICES_HEADLINE_ACCENT}}'}
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-4">
              <p className="text-white/65 text-base md:text-lg leading-[1.8] font-light">
                {'{{SERVICES_SUBTEXT}}'}
              </p>
            </div>
          </div>

          <div className="border-t border-[#C9A96E]/25">
            {services.map((s) => (
              <a
                key={s.n}
                href="#contact"
                className="group grid grid-cols-12 gap-4 sm:gap-6 lg:gap-10 py-8 sm:py-10 lg:py-14 border-b border-[#C9A96E]/25 cursor-pointer"
              >
                <div className="col-span-2 lg:col-span-1 font-['Playfair_Display'] text-[#C9A96E] text-sm tracking-[0.25em] pt-2">
                  {s.n}
                </div>
                <div className="col-span-10 lg:col-span-8">
                  <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-4xl text-white group-hover:text-[#C9A96E] transition-colors duration-300 mb-3">
                    {s.title}
                  </h3>
                  <p className="text-white/65 text-sm sm:text-base leading-[1.8] font-light max-w-xl">
                    {s.body}
                  </p>
                </div>
                <div className="hidden lg:flex lg:col-span-3 lg:items-center lg:justify-end">
                  <span className="text-[#C9A96E] text-2xl tracking-widest opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        className="bg-[#EFE5D3] dark:bg-[#0D0D0D] py-20 md:py-24 lg:py-32 transition-colors duration-500 scroll-mt-20 md:scroll-mt-28 lg:scroll-mt-40"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 md:mb-14 gap-5 md:gap-6">
            <div className="max-w-xl">
              <div className="text-[#C9A96E] text-[11px] tracking-[0.35em] uppercase mb-5 sm:mb-6">
                Inside Our Home
              </div>
              <h2 className="font-['Playfair_Display'] text-[34px] sm:text-4xl md:text-5xl lg:text-[52px] text-[#2A1810] dark:text-white leading-[1.12] tracking-tight">
                {'{{GALLERY_HEADLINE_PRIMARY}}'}{' '}
                <span className="italic text-[#C9A96E]">
                  {'{{GALLERY_HEADLINE_ACCENT}}'}
                </span>
              </h2>
            </div>
            <p className="text-[#5C4633] dark:text-white/60 max-w-sm font-light leading-[1.8]">
              {'{{GALLERY_SUBTEXT}}'}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 auto-rows-[160px] sm:auto-rows-[200px] md:auto-rows-[220px] lg:auto-rows-[240px] gap-2.5 sm:gap-3 lg:gap-4">
            <GalleryImg
              src="/images/gallery-1.jpg"
              label="{{GALLERY_1_LABEL}}"
              className="col-span-2 lg:col-span-4 row-span-2"
            />
            <GalleryImg
              src="/images/gallery-2.jpg"
              label="{{GALLERY_2_LABEL}}"
              className="col-span-2 lg:col-span-2"
            />
            <GalleryImg
              src="/images/gallery-3.jpg"
              label="{{GALLERY_3_LABEL}}"
              className="col-span-2 lg:col-span-2"
            />
            <GalleryImg
              src="/images/gallery-4.jpg"
              label="{{GALLERY_4_LABEL}}"
              className="col-span-1 lg:col-span-2"
            />
            <GalleryImg
              src="/images/gallery-5.jpg"
              label="{{GALLERY_5_LABEL}}"
              className="col-span-1 lg:col-span-2"
            />
            <GalleryImg
              src="/images/gallery-6.jpg"
              label="{{GALLERY_6_LABEL}}"
              className="col-span-2 lg:col-span-2"
            />
          </div>
        </div>
      </section>

      {/* QUOTE BAND */}
      <section className="bg-[#E5D8BD] dark:bg-[#111111] py-20 md:py-24 lg:py-32 border-y border-[#C9A96E]/30 dark:border-[#C9A96E]/10 relative overflow-hidden transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-10 text-center relative">
          <div className="font-['Playfair_Display'] text-[#C9A96E] text-[100px] sm:text-[140px] md:text-[180px] leading-none mb-[-20px] sm:mb-[-30px] opacity-90 select-none">
            &ldquo;
          </div>
          <p className="font-['Playfair_Display'] italic text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-[#2A1810] dark:text-white leading-[1.4] mb-8 md:mb-10 tracking-tight">
            {'{{TESTIMONIAL_QUOTE}}'}
          </p>
          <div className="inline-flex items-center gap-4">
            <span className="h-px w-10 sm:w-12 bg-[#C9A96E]" />
            <span className="text-[#C9A96E] text-[10px] sm:text-[11px] tracking-[0.35em] uppercase">
              {'{{TESTIMONIAL_ATTRIBUTION}}'}
            </span>
            <span className="h-px w-10 sm:w-12 bg-[#C9A96E]" />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="relative bg-[#EFE5D3] dark:bg-[#0D0D0D] overflow-hidden transition-colors duration-500 scroll-mt-20 md:scroll-mt-28 lg:scroll-mt-40"
      >
        {/* Light-mode background */}
        <div className="absolute inset-0 dark:hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F4EBD8] via-[#EFE5D3] to-[#E5D8BD]" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at 85% 15%, rgba(201,169,110,0.35), transparent 65%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 10% 95%, rgba(212,175,106,0.28), transparent 60%)',
            }}
          />
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(201,169,110,0.18), transparent 70%)',
            }}
          />
          <div
            className="pointer-events-none absolute -left-40 bottom-0 h-[32rem] w-[32rem] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(212,175,106,0.14), transparent 70%)',
            }}
          />
        </div>

        {/* Dark-mode background */}
        <div className="absolute inset-0 hidden dark:block">
          <div className="absolute inset-0 bg-gradient-to-br from-[#161310] via-[#0D0D0D] to-[#080808]" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at 85% 15%, rgba(201,169,110,0.22), transparent 65%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 10% 95%, rgba(212,175,106,0.14), transparent 60%)',
            }}
          />
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(201,169,110,0.18), transparent 70%)',
            }}
          />
          <div
            className="pointer-events-none absolute -left-40 bottom-0 h-[32rem] w-[32rem] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(212,175,106,0.10), transparent 70%)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-20 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">
            <div>
              <div className="text-[#C9A96E] text-[11px] tracking-[0.35em] uppercase mb-5 sm:mb-6">
                Visit · Call · Write
              </div>
              <h2 className="font-['Playfair_Display'] text-[34px] sm:text-4xl md:text-5xl lg:text-[52px] text-[#2A1810] dark:text-white leading-[1.12] mb-5 sm:mb-6 tracking-tight">
                {'{{CONTACT_HEADLINE_PRIMARY}}'}{' '}
                <span className="italic text-[#C9A96E]">
                  {'{{CONTACT_HEADLINE_ACCENT}}'}
                </span>
              </h2>
              <p className="text-[#5C4633] dark:text-white/70 text-base md:text-lg leading-[1.85] mb-10 md:mb-12 font-light max-w-md">
                {'{{CONTACT_SUBTEXT}}'}
              </p>

              <div className="space-y-7 sm:space-y-8">
                <a
                  href="tel:{{PHONE_DIGITS}}"
                  className="group block border-t border-[#C9A96E]/45 dark:border-[#C9A96E]/20 pt-5 sm:pt-6"
                >
                  <div className="text-[#C9A96E] text-[10px] tracking-[0.35em] uppercase mb-2">
                    Phone
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl text-[#2A1810] dark:text-white font-['Playfair_Display'] group-hover:text-[#C9A96E] dark:group-hover:text-[#C9A96E] transition-colors duration-300">
                    {'{{PHONE}}'}
                  </div>
                </a>
                <a
                  href="mailto:{{EMAIL}}"
                  className="group block border-t border-[#C9A96E]/45 dark:border-[#C9A96E]/20 pt-5 sm:pt-6"
                >
                  <div className="text-[#C9A96E] text-[10px] tracking-[0.35em] uppercase mb-2">
                    Email
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl text-[#2A1810] dark:text-white font-['Playfair_Display'] group-hover:text-[#C9A96E] dark:group-hover:text-[#C9A96E] transition-colors duration-300 break-all">
                    {'{{EMAIL}}'}
                  </div>
                </a>
                <div className="block border-t border-[#C9A96E]/45 dark:border-[#C9A96E]/20 pt-5 sm:pt-6">
                  <div className="text-[#C9A96E] text-[10px] tracking-[0.35em] uppercase mb-2">
                    Location
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl text-[#2A1810] dark:text-white font-['Playfair_Display']">
                    {'{{ADDRESS}}'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 sm:gap-8">
              <div className="bg-[#1F140C]/95 dark:bg-[#0D0D0D]/60 backdrop-blur-md border border-[#C9A96E]/35 dark:border-[#C9A96E]/50 px-6 py-8 lg:px-8 lg:py-10 w-full max-w-md text-center shadow-[0_30px_60px_-20px_rgba(31,20,12,0.35)] dark:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]">
                <img
                  src="/images/logo.png"
                  alt="{{BUSINESS_NAME}}"
                  className="w-full h-auto mx-auto"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md">
                <a
                  href="tel:{{PHONE_DIGITS}}"
                  className="flex-1 bg-[#C9A96E] text-[#1F140C] px-6 py-4 text-xs tracking-[0.22em] uppercase font-medium text-center hover:bg-[#D4AF6A] transition-colors duration-300"
                >
                  Call Now
                </a>
                <a
                  href="mailto:{{EMAIL}}"
                  className="flex-1 border border-[#C9A96E] text-[#C9A96E] px-6 py-4 text-xs tracking-[0.22em] uppercase text-center hover:bg-[#C9A96E] hover:text-[#1F140C] transition-all duration-300"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1F140C] dark:bg-[#080808] py-10 md:py-12 border-t border-[#C9A96E]/20 dark:border-[#C9A96E]/10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
          <div className="flex md:justify-start justify-center">
            <img
              src="/images/logo-icon.png"
              alt="{{BUSINESS_NAME}}"
              className="h-20 sm:h-24 md:h-32 lg:h-40 w-auto"
            />
          </div>
          <div className="text-center">
            <p className="text-white/50 text-[11px] tracking-[0.25em] uppercase mb-2">
              {'{{LICENSE_TEXT}}'}
            </p>
            <p className="text-white/35 text-xs">
              © {new Date().getFullYear()} {'{{BUSINESS_SHORT_NAME}}'} · {'{{LOCATION}}'}
            </p>
          </div>
          <div className="flex md:justify-end justify-center gap-6 sm:gap-8 text-sm">
            <a
              href="tel:{{PHONE_DIGITS}}"
              className="text-[#C9A96E] hover:text-[#D4AF6A] transition-colors duration-300"
            >
              {'{{PHONE}}'}
            </a>
            <a
              href="mailto:{{EMAIL}}"
              className="text-[#C9A96E] hover:text-[#D4AF6A] transition-colors duration-300"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative h-10 w-10 flex items-center justify-center border border-[#C9A96E]/70 text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#1F140C] transition-all duration-300"
    >
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark ? 'opacity-0 -rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
        }`}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-75'
        }`}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      </span>
    </button>
  )
}

function Stat({ number, label }) {
  return (
    <div className="text-right">
      <div className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#C9A96E] leading-none">
        {number}
      </div>
      <div className="text-[10px] tracking-[0.3em] uppercase text-white/60 mt-2">
        {label}
      </div>
    </div>
  )
}

function StatMobile({ number, label }) {
  return (
    <div className="text-center">
      <div className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#C9A96E] leading-none">
        {number}
      </div>
      <div className="text-[9px] tracking-[0.25em] uppercase text-white/60 mt-1.5">
        {label}
      </div>
    </div>
  )
}

function Pillar({ icon, title, body, border = false }) {
  return (
    <div
      className={`p-10 sm:p-12 lg:p-16 ${
        border
          ? 'border-b md:border-b-0 md:border-r border-[#C9A96E]/30 dark:border-[#C9A96E]/10'
          : ''
      }`}
    >
      <div className="text-[#C9A96E] text-3xl mb-5 sm:mb-6 font-['Playfair_Display'] leading-none">
        {icon}
      </div>
      <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl text-[#2A1810] dark:text-white mb-3 sm:mb-4 tracking-tight">
        {title}
      </h3>
      <p className="text-[#5C4633] dark:text-white/55 text-sm leading-[1.8] font-light">
        {body}
      </p>
    </div>
  )
}

function GalleryImg({ src, label, className = '' }) {
  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={label}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1F140C]/85 dark:from-[#0D0D0D]/85 via-[#1F140C]/10 dark:via-[#0D0D0D]/10 to-transparent" />
      <div className="absolute inset-0 ring-1 ring-inset ring-[#1F140C]/15 dark:ring-white/5" />
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 z-10 flex items-center gap-2 sm:gap-3 opacity-95 group-hover:opacity-100 transition-opacity duration-300">
        <span className="h-px w-5 sm:w-6 bg-[#C9A96E]" />
        <span className="text-[#C9A96E] text-[9px] sm:text-[10px] tracking-[0.3em] uppercase">
          {label}
        </span>
      </div>
    </div>
  )
}
