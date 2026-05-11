'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { createBlog, generateSlug } from '@/lib/firestore/blogs'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const CATEGORY_OPTIONS = [
  { value: '', label: 'Pilih kategori...' },
  { value: 'Tips Detailing', label: 'Tips Detailing' },
  { value: 'Promo', label: 'Promo' },
  { value: 'Edukasi', label: 'Edukasi' },
  { value: 'Berita', label: 'Berita' },
]

export default function NewBlogPage() {
  const router = useRouter()
  const { appUser } = useAuth()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [thumbnail, setThumbnail] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Judul dan konten wajib diisi')
      return
    }
    if (!appUser) return
    setSaving(true)
    try {
      const slug = generateSlug(title) + '-' + Date.now()
      await createBlog({
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt: excerpt.trim(),
        thumbnail: thumbnail.trim(),
        category,
        status,
        authorId: appUser.uid,
      })
      toast.success('Artikel berhasil disimpan!')
      router.push('/admin/blog')
    } catch {
      toast.error('Gagal menyimpan artikel')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog">
          <button className="p-2 rounded-xl hover:bg-slate-200 transition-colors" aria-label="Kembali">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Artikel Baru</h1>
          <p className="text-slate-500 text-sm">Buat artikel blog baru</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
            <Input label="Judul Artikel" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masukkan judul artikel..." />
            <Textarea label="Excerpt / Ringkasan" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="Ringkasan singkat artikel..." />
            <Textarea label="Konten (HTML/Markdown)" value={content} onChange={(e) => setContent(e.target.value)} rows={16} placeholder="Tulis konten artikel di sini..." />
          </div>
        </div>

        {/* Settings */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
            <h2 className="font-bold text-slate-700">Pengaturan</h2>
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]}
            />
            <Select
              label="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={CATEGORY_OPTIONS}
            />
            <Input label="URL Thumbnail" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://..." />
            <div className="pt-2 flex flex-col gap-2">
              <Button fullWidth onClick={handleSave} loading={saving}>
                {status === 'published' ? 'Publish Artikel' : 'Simpan Draft'}
              </Button>
              <Link href="/admin/blog">
                <Button variant="ghost" fullWidth>Batal</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
