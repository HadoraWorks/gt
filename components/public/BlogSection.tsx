'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { CalendarDays, ArrowRight } from 'lucide-react'
import type { Blog } from '@/types'

function BlogCard({ post, index }: { post: Blog; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const date = post.publishedAt?.toDate?.()
    ? post.publishedAt.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  return (
    <motion.article
      ref={ref}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-100 overflow-hidden transition-shadow"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-48 bg-slate-200 overflow-hidden">
          {post.thumbnail ? (
            <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
              <span className="text-blue-300 text-5xl font-black">GT</span>
            </div>
          )}
          {post.category && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-blue-700/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">{post.category}</span>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
            <CalendarDays className="h-3.5 w-3.5" />{date}
          </div>
          <h3 className="font-bold text-slate-800 text-lg leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">{post.title}</h3>
          {post.excerpt && <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>}
          <span className="inline-flex items-center gap-1 text-blue-700 font-semibold text-sm group-hover:gap-2 transition-all">
            Baca Selengkapnya <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}

export function BlogSection({ posts }: { posts: Blog[] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="blog" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-3">Blog</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800">Tips & Info Detailing</h2>
          </div>
          <Link href="/blog" className="flex items-center gap-2 text-blue-700 font-semibold hover:underline shrink-0">
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
        {posts.length === 0 ? (
          <div className="text-center text-slate-400 py-12">Belum ada artikel blog.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
          </div>
        )}
      </div>
    </section>
  )
}
