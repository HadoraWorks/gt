'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { getAllBlogs, deleteBlog, updateBlog } from '@/lib/firestore/blogs'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ConfirmModal } from '@/components/ui/Modal'
import { SkeletonTable } from '@/components/ui/Skeleton'
import type { Blog } from '@/types'

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      setBlogs(await getAllBlogs())
    } catch {
      toast.error('Gagal memuat blog')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteBlog(deleteId)
      toast.success('Artikel berhasil dihapus')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Gagal menghapus artikel')
    } finally {
      setDeleting(false)
    }
  }

  const toggleStatus = async (blog: Blog) => {
    try {
      await updateBlog(blog.id, { status: blog.status === 'published' ? 'draft' : 'published' })
      toast.success(blog.status === 'published' ? 'Artikel dijadikan draft' : 'Artikel dipublish')
      load()
    } catch {
      toast.error('Gagal mengubah status')
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Blog</h1>
          <p className="text-slate-500 text-sm">Kelola artikel blog GT Autodetailing</p>
        </div>
        <Link href="/admin/blog/new">
          <Button><Plus className="h-4 w-4" /> Artikel Baru</Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={5} /></div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="mb-3">Belum ada artikel.</p>
            <Link href="/admin/blog/new"><Button size="sm">Buat Artikel Pertama</Button></Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Artikel</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Kategori</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Tanggal</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {blog.thumbnail ? (
                          <div className="relative w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                            <Image src={blog.thumbnail} alt={blog.title} fill className="object-cover" sizes="48px" />
                          </div>
                        ) : (
                          <div className="w-12 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <span className="text-blue-300 font-black text-xs">GT</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1">{blog.title}</p>
                          <p className="text-slate-400 text-xs">/blog/{blog.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{blog.category || '—'}</td>
                    <td className="px-5 py-4">
                      <Badge variant={blog.status === 'published' ? 'green' : 'gray'}>
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {blog.createdAt?.toDate?.()?.toLocaleDateString('id-ID') ?? '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleStatus(blog)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                          title={blog.status === 'published' ? 'Jadikan Draft' : 'Publish'}
                          aria-label={blog.status === 'published' ? 'Jadikan draft' : 'Publish artikel'}
                        >
                          {blog.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <Link href={`/admin/blog/${blog.id}/edit`}>
                          <button className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" aria-label="Edit artikel">
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteId(blog.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          aria-label="Hapus artikel"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Hapus Artikel"
        message="Artikel yang dihapus tidak bisa dipulihkan. Lanjutkan?"
        loading={deleting}
      />
    </div>
  )
}
