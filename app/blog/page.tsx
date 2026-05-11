import { getPublishedBlogs } from '@/lib/firestore/blogs'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/CTASection'
import Link from 'next/link'
import Image from 'next/image'
import { CalendarDays, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog & Tips Detailing — GT Autodetailing',
  description: 'Temukan tips perawatan kendaraan, edukasi detailing, dan promo terbaru dari GT Autodetailing Purwokerto.',
}

export const revalidate = 60

export default async function BlogListPage() {
  const blogs = await getPublishedBlogs(100).catch(() => [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-slate-800 mb-4">Blog & Edukasi</h1>
            <p className="text-slate-500 max-w-xl mx-auto">
              Pelajari cara merawat kendaraan Anda agar tetap bening dan terlindungi dengan tips dari tenaga profesional kami.
            </p>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              Belum ada artikel yang diterbitkan.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => {
                const date = post.publishedAt?.toDate?.()
                  ? post.publishedAt.toDate().toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })
                  : '—'

                return (
                  <article key={post.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-200 overflow-hidden transition-all duration-300">
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative h-56 bg-slate-200 overflow-hidden">
                        {post.thumbnail ? (
                          <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
                            <span className="text-blue-300 text-6xl font-black">GT</span>
                          </div>
                        )}
                        {post.category && (
                          <span className="absolute top-4 left-4 px-3 py-1 bg-blue-700/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                            {post.category}
                          </span>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {date}
                        </div>
                        <h2 className="font-bold text-slate-800 text-xl leading-snug mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6">
                            {post.excerpt}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-2 text-blue-700 font-bold text-sm">
                          Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
