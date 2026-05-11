import { notFound } from 'next/navigation'
import { getBlogBySlug, getPublishedBlogs } from '@/lib/firestore/blogs'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/CTASection'
import { CalendarDays, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateStaticParams() {
  const blogs = await getPublishedBlogs(50).catch(() => [])
  return blogs.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug).catch(() => null)
  if (!blog) return { title: 'Artikel Tidak Ditemukan' }
  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: { title: blog.title, description: blog.excerpt, images: blog.thumbnail ? [blog.thumbnail] : [] },
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug).catch(() => null)
  if (!blog || blog.status !== 'published') notFound()

  const publishedDate = blog.publishedAt?.toDate?.()?.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  }) ?? '—'

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 bg-white">
        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <Link href="/#blog" className="inline-flex items-center gap-2 text-blue-700 font-semibold text-sm mb-6 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Blog
          </Link>

          {/* Category + Date */}
          <div className="flex items-center gap-3 mb-4">
            {blog.category && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">{blog.category}</span>
            )}
            <span className="flex items-center gap-1.5 text-slate-400 text-sm">
              <CalendarDays className="h-4 w-4" /> {publishedDate}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 leading-tight mb-4">{blog.title}</h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-lg text-slate-500 leading-relaxed mb-8 border-l-4 border-blue-300 pl-4 italic">{blog.excerpt}</p>
          )}

          {/* Thumbnail */}
          {blog.thumbnail && (
            <div className="relative w-full rounded-2xl overflow-hidden mb-8 bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={blog.thumbnail} alt={blog.title} className="w-full h-auto max-h-96 object-cover" />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-slate prose-lg max-w-none
              prose-headings:font-black prose-a:text-blue-700
              prose-img:rounded-2xl prose-pre:bg-slate-900"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </main>
      <Footer />
    </>
  )
}
