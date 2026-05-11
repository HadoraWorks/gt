import type { Metadata } from 'next'
import { Navbar } from '@/components/public/Navbar'
import { HeroSection } from '@/components/public/HeroSection'
import { AboutSection } from '@/components/public/AboutSection'
import { ServicesSection } from '@/components/public/ServicesSection'
import { PortfolioSection } from '@/components/public/PortfolioSection'
import { TestimoniSection } from '@/components/public/TestimoniSection'
import { BlogSection } from '@/components/public/BlogSection'
import { CTASection, Footer } from '@/components/public/CTASection'
import { getActiveServices } from '@/lib/firestore/services'
import { getPortfolio } from '@/lib/firestore/portfolio'
import { getActiveTestimonials } from '@/lib/firestore/testimonials'
import { getPublishedBlogs } from '@/lib/firestore/blogs'

export const metadata: Metadata = {
  title: 'GT Autodetailing — Ga Bening, Ga Pulang',
  description: 'Spesialis detailing kendaraan bermotor di Purwokerto, Jawa Tengah. 10+ tahun pengalaman. Nano ceramic coating, sealant protection, interior cleaning.',
  alternates: { canonical: 'https://gtautodetailing.com' },
}

export const revalidate = 60

export default async function HomePage() {
  const [services, portfolio, testimonials, blogs] = await Promise.all([
    getActiveServices().catch(() => []),
    getPortfolio().catch(() => []),
    getActiveTestimonials().catch(() => []),
    getPublishedBlogs(3).catch(() => []),
  ])

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection services={services} />
        <PortfolioSection items={portfolio} />
        <TestimoniSection testimonials={testimonials} />
        <BlogSection posts={blogs} />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
