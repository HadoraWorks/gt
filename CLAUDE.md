@AGENTS.md

# GT Autodetailing — CLAUDE.md

Ini adalah project **GT Autodetailing**: platform web terpadu yang berfungsi sebagai **Company Profile publik** sekaligus **sistem internal** (absensi karyawan + penugasan pekerjaan).

---

## Konteks Bisnis

- **Nama**: GT Autodetailing
- **Slogan**: "Ga Bening, Ga Pulang"
- **Industri**: Detailing kendaraan (mobil & motor) — 10+ tahun pengalaman
- **Lokasi**: Purwokerto, Jawa Tengah
- **Instagram**: @gtautodetailing
- **WhatsApp**: 081548222030 (wa.me/6281548222030)
- **Segmen**: Kendaraan harian, showroom, kontes, dealer

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | TailwindCSS — inline utility classes saja, tidak ada custom CSS file |
| Animation | Framer Motion (hanya di halaman publik) |
| Auth | Firebase Auth (Email/Password + Google OAuth) |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| Deployment | Vercel |
| Rich Text | Tiptap (editor blog admin) |
| Notifications | react-hot-toast |
| Language | TypeScript (strict mode) |

---

## Struktur Folder

```
/app
  /(public)
    page.tsx                  # Landing page company profile
    blog/[slug]/page.tsx      # Halaman detail artikel blog
  /(auth)
    login/page.tsx            # Halaman login
    setup-profile/page.tsx    # Onboarding profil post-login
  /admin
    page.tsx                  # Admin dashboard home
    blog/                     # CRUD blog
    services/                 # CRUD layanan & harga
    portfolio/                # Kelola foto portfolio
    testimonials/             # Kelola testimoni
    users/                    # User management
    tasks/                    # Task assignment & monitoring
    attendance/               # Monitor kehadiran karyawan
  /employee
    page.tsx                  # Employee dashboard home
    attendance/               # Absensi GPS
    tasks/                    # Daftar & checklist task

/components
  /public                     # Komponen section company profile
  /admin                      # Komponen UI admin dashboard
  /employee                   # Komponen UI employee dashboard
  /ui                         # Komponen reusable (Button, Card, Modal, Badge, dll)

/lib
  firebase.ts                 # Konfigurasi Firebase (auth, db, storage)
  /firestore                  # Helper functions per koleksi Firestore

/hooks                        # Custom React hooks (useAuth, useTasks, useAttendance, dll)
/types                        # TypeScript interfaces & type definitions
/middleware.ts                # Route protection berbasis role
```

Buat **satu file per komponen**. Komponen public dipecah per section agar mudah di-maintain.

---

## User Roles & Routing

Ada 3 jenis pengguna:

| Role | Route | Deskripsi |
|---|---|---|
| `public` | `/` | Pengunjung internet, tanpa login |
| `admin` | `/admin/*` | Pemilik / manajer GT Autodetailing |
| `employee` | `/employee/*` | Karyawan GT Autodetailing |

**Aturan routing (`middleware.ts`)**:
- `/admin/*` → redirect ke `/login` jika tidak login atau bukan admin
- `/employee/*` → redirect ke `/login` jika tidak login atau bukan employee
- Setelah login, cek field `role` di Firestore collection `users`
- Jika profil belum lengkap (nama / telepon kosong) → redirect ke `/setup-profile`

---

## Firestore Collections

### `users`
```ts
interface User {
  uid: string          // Firebase Auth UID (= document ID)
  name: string
  phone: string
  email: string
  role: 'admin' | 'employee'
  photoURL: string
  isActive: boolean
  createdAt: Timestamp
}
```

### `tasks`
```ts
interface Task {
  id: string
  employeeId: string   // UID employee yang ditugaskan
  assignedBy: string   // UID admin
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in_progress' | 'done'
  deadline: Timestamp
  assignedDate: Timestamp
  completedAt: Timestamp | null
}
```

### `attendance`
```ts
interface Attendance {
  id: string
  employeeId: string
  date: string         // format: 'YYYY-MM-DD'
  checkInTime: Timestamp
  location: GeoPoint
  status: 'present' | 'late' | 'absent'
  note: string
}
```

### `services`
```ts
interface VehiclePrice {
  type: 'City Car' | 'Medium Car' | 'SUV' | 'Premium/ShowCar'
  price: number
  priceMax: number | null  // null jika harga fixed, angka jika range
}

interface Service {
  id: string
  name: string
  description: string
  category: 'package' | 'additional'
  vehicleTypes: VehiclePrice[]
  isActive: boolean
  order: number
  updatedAt: Timestamp
}
```

### `blogs`
```ts
interface Blog {
  id: string
  title: string
  slug: string         // URL-friendly, auto-generate dari title
  content: string      // HTML dari Tiptap, di-sanitize dengan DOMPurify
  thumbnail: string    // URL Firebase Storage
  excerpt: string
  category: string
  status: 'draft' | 'published'
  authorId: string
  publishedAt: Timestamp
  createdAt: Timestamp
}
```

### `portfolio`
```ts
interface Portfolio {
  id: string
  imageUrl: string     // URL Firebase Storage
  beforeImageUrl: string | null
  category: 'daily' | 'showroom' | 'contest' | 'dealer'
  description: string
  order: number
  createdAt: Timestamp
}
```

### `testimonials`
```ts
interface Testimonial {
  id: string
  customerName: string
  vehicleType: string
  rating: number       // 1-5
  comment: string
  isActive: boolean
  order: number
  createdAt: Timestamp
}
```

---

## Design System

**Tema**: Minimalis — Putih + Biru.

```
Primary:     #1D4ED8  (blue-700)
Accent:      #1E40AF  (blue-800)
Background:  #FFFFFF
Text:        #1E293B  (slate-800)
Text muted:  #475569  (slate-600)
Border:      #CBD5E1  (slate-300)
Surface:     #F1F5F9  (slate-100)
```

**Prinsip styling**:
- TailwindCSS inline utility saja — tidak ada file CSS terpisah
- Mobile-first: selalu mulai dari mobile, gunakan `sm:`, `md:`, `lg:` untuk breakpoint lebih besar
- Komponen reusable di `/components/ui/` — jangan duplikasi styling
- `rounded-xl` untuk card, `rounded-full` untuk badge/chip
- `shadow-md` untuk card, `shadow-lg` untuk modal/dropdown

---

## Company Profile — Section Layout

Halaman publik adalah Single Page dengan smooth-scroll. Urutan section:

1. **Navbar** — sticky, logo, anchor links, tombol Login
2. **Hero** — headline + slogan + CTA WhatsApp + background foto detailing
3. **About** — narasi 10 tahun + statistik animated counter
4. **Layanan** — paket harga (data dari Firestore)
5. **Portfolio** — grid foto before/after dengan filter kategori + lightbox
6. **Testimoni** — marquee / carousel horizontal otomatis
7. **Blog** — 3 artikel terbaru (data dari Firestore)
8. **CTA & Kontak** — tombol WA + Instagram + informasi lokasi
9. **Footer** — navigasi, sosmed, copyright

Setiap section adalah file komponen terpisah di `/components/public/`.

**Animasi (Framer Motion)**:
- Hero: `fadeIn` + `slideUp` on mount, stagger antar elemen
- About stats: counter angka saat masuk viewport (gunakan `useInView`)
- Layanan, Portfolio, Blog: `staggerChildren` fade-in saat scroll ke viewport
- Testimoni: auto-scroll marquee
- Navbar: tambah `backdrop-blur` + `shadow` saat `scrollY > 50`
- Semua animasi harus respek `prefers-reduced-motion`

---

## Paket Layanan (Data Awal / Seed)

Ini data default yang perlu di-seed ke Firestore `services` saat setup awal:

**Paket 1 — Reguler Detail + Sealant Protection**
- City Car: Rp 800.000
- Medium Car: Rp 1.000.000
- SUV: Rp 1.500.000

**Paket 2 — Eksterior Detail + Nano Ceramic Coating**
- City Car: Rp 2.000.000 – Rp 2.300.000
- Medium Car: Rp 2.500.000 – Rp 2.800.000
- SUV: Rp 3.000.000 – Rp 3.500.000
- Premium/ShowCar: By Negotiation

**Additional Services**
- Interior Cleaning: Rp 500.000
- Engine Cleaning: Rp 400.000
- Maintenance Coating: Rp 600.000
- Extra Nano Ceramic: Rp 300.000

---

## Fitur Kritis & Aturan Bisnis

### Absensi GPS (Employee)
- Validasi lokasi menggunakan `navigator.geolocation`
- Radius check-in: **100 meter** dari koordinat kantor GT Autodetailing Purwokerto
- Koordinat kantor disimpan di environment variable atau Firestore config
- Jika di luar radius → tampilkan pesan error, tolak check-in
- Hanya 1 check-in per hari per employee
- Status: `present` jika check-in sebelum batas jam, `late` jika setelahnya

### Task Priority Order (Employee)
Tampilkan task dengan urutan:
1. Priority: `high` → `medium` → `low`
2. Kemudian by `deadline` ascending (paling dekat duluan)

### Status Task Flow
```
todo → in_progress → done
```
Employee hanya bisa maju (tidak bisa mundur). Admin bisa override status apapun.

### Auth Flow
1. Login (Email/Password atau Google OAuth)
2. Cek Firestore `users/{uid}` — apakah dokumen ada dan `name` + `phone` terisi?
3. Jika belum → redirect `/setup-profile`
4. Jika sudah → redirect ke `/admin` atau `/employee` sesuai `role`
5. User baru default role = `employee` — Admin yang ubah ke `admin` via User Management

### Blog Slug
Auto-generate dari title saat membuat artikel baru:
```ts
const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
```
Tambahkan suffix timestamp jika slug sudah ada.

---

## Konvensi Kode

- **TypeScript strict** — tidak ada `any`, gunakan type yang proper
- **Komponen**: function component + hooks, tidak ada class component
- **Naming**: `PascalCase` untuk komponen, `camelCase` untuk fungsi/variabel, `SCREAMING_SNAKE_CASE` untuk konstanta env
- **Firestore helpers**: buat fungsi terpisah di `/lib/firestore/[collection].ts` — jangan query Firestore langsung di komponen
- **Error handling**: semua operasi async harus punya try/catch dengan error state yang ditampilkan ke user via toast
- **Loading state**: gunakan skeleton loader (bukan spinner saja) untuk data fetching
- **Env vars**: semua config Firebase di `.env.local`, prefix `NEXT_PUBLIC_` hanya untuk yang aman di client

---

## Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_OFFICE_LAT=          # Latitude kantor GT Autodetailing
NEXT_PUBLIC_OFFICE_LNG=          # Longitude kantor GT Autodetailing
NEXT_PUBLIC_CHECKIN_RADIUS_M=100 # Radius check-in dalam meter
NEXT_PUBLIC_LATE_CHECKIN_HOUR=9  # Jam batas check-in (09:00 = terlambat)
```

---

## Hal yang Perlu Diingat

- **Jangan** buat file CSS terpisah — styling cukup dengan Tailwind inline
- **Jangan** query Firestore langsung di dalam JSX/TSX komponen — selalu lewat helper di `/lib/firestore/`
- **Jangan** simpan role user di localStorage — selalu ambil dari Firestore saat session aktif
- **Selalu** sanitize konten HTML blog dengan DOMPurify sebelum disimpan dan sebelum di-render
- **Selalu** validasi GPS di client sebelum kirim data absensi ke Firestore
- Data layanan di halaman publik diambil dari Firestore — bukan hardcoded — agar Admin bisa update tanpa deploy ulang
- Gunakan Next.js `ISR` (revalidate) untuk halaman blog publik, bukan full SSR, agar tidak membebani Firestore reads