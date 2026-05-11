'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { getBlogById, updateBlog, generateSlug } from '@/lib/firestore/blogs'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Blog } from '@/types'

const CATEGORY_OPTIONS = [
  { value: '', label: 'Pilih kategori...' },
  { value: 'Tips Detailing', label: 'Tips Detailing' },
  { value: 'Promo', label: 'Promo' },
  { value: 'Edukasi', label: 'Edukasi' },
  { value: 'Berita', label: 'Berita' },
]

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [thumbnail, setThumbnail] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getBlogById(id).then((b) => {
      if (!b) { toast.error('Artikel tidak ditemukan'); router.push('/admin/blog'); return }
      setBlog(b)
      setTitle(b.title)
      setExcerpt(b.excerpt)
      setContent(b.content)
      setCategory(b.category)
      setStatus(b.status)
      setThumbnail(b.thumbnail)
    })
  }, [id, router])

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) { toast.error('Judul dan konten wajib diisi'); return }
    setSaving(true)
    try {
      await updateBlog(id, { title: title.trim(), content: content.trim(), excerpt: excerpt.trim(), thumbnail: thumbnail.trim(), category, status })
      toast.success('Artikel berhasil diperbarui!')
      router.push('/admin/blog')
    } catch {
      toast.error('Gagal memperbarui artikel')
    } finally {
      setSaving(false)
    }
  }

  if (!blog) return <div className="p-6 text-slate-400">Memuat...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog">
          <button className="p-2 rounded-xl hover:bg-slate-200 transition-colors" aria-label="Kembali"><ArrowLeft className="h-5 w-5 text-slate-600" /></button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Edit Artikel</h1>
          <p className="text-slate-500 text-sm truncate max-w-xs">{blog.title}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
            <Input label="Judul Artikel" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masukkan judul..." />
            <Textarea label="Excerpt / Ringkasan" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="Ringkasan singkat..." />
            <Textarea label="Konten (HTML)" value={content} onChange={(e) => setContent(e.target.value)} rows={16} placeholder="Konten artikel..." />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
            <h2 className="font-bold text-slate-700">Pengaturan</h2>
            <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')} options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]} />
            <Select label="Kategori" value={category} onChange={(e) => setCategory(e.target.value)} options={CATEGORY_OPTIONS} />
            <Input label="URL Thumbnail" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://..." />
            <div className="pt-2 flex flex-col gap-2">
              <Button fullWidth onClick={handleSave} loading={saving}>Simpan Perubahan</Button>
              <Link href="/admin/blog"><Button variant="ghost" fullWidth>Batal</Button></Link>
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs text-slate-500">
            <p>Slug: <span className="font-mono text-slate-700">/blog/{blog.slug}</span></p>
            <p className="mt-1">Dibuat: {blog.createdAt?.toDate?.()?.toLocaleDateString('id-ID') ?? '—'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
