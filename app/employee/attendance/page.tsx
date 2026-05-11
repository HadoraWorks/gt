'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { useAttendance } from '@/hooks/useAttendance'
import { checkIn, calculateDistanceMeters } from '@/lib/firestore/attendance'
import { attendanceBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MapPin, Clock, Calendar, AlertTriangle, CheckCircle2, Navigation } from 'lucide-react'

const OFFICE_LAT = Number(process.env.NEXT_PUBLIC_OFFICE_LAT ?? -7.4210)
const OFFICE_LNG = Number(process.env.NEXT_PUBLIC_OFFICE_LNG ?? 109.2352)
const RADIUS_M = Number(process.env.NEXT_PUBLIC_CHECKIN_RADIUS_M ?? 100)

export default function EmployeeAttendancePage() {
  const { appUser } = useAuth()
  const { today, records, loading } = useAttendance(appUser?.uid ?? null)
  const [checking, setChecking] = useState(false)
  const [locating, setLocating] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [distance, setDistance] = useState<number | null>(null)

  const handleLocate = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setUserLocation({ lat, lng })
        const dist = calculateDistanceMeters(lat, lng, OFFICE_LAT, OFFICE_LNG)
        setDistance(Math.round(dist))
        setLocating(false)
      },
      (err) => {
        toast.error('Tidak dapat mengakses lokasi. Pastikan GPS aktif.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleCheckIn = async () => {
    if (!appUser) return
    if (!userLocation) { toast.error('Ambil lokasi terlebih dahulu'); return }

    const dist = calculateDistanceMeters(userLocation.lat, userLocation.lng, OFFICE_LAT, OFFICE_LNG)
    if (dist > RADIUS_M) {
      toast.error(`Anda berada ${Math.round(dist)}m dari kantor. Radius maksimal ${RADIUS_M}m.`)
      return
    }

    setChecking(true)
    try {
      await checkIn(appUser.uid, userLocation.lat, userLocation.lng)
      toast.success('Check-in berhasil! ✅')
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('already')) toast.error('Anda sudah absen hari ini')
      else toast.error('Gagal check-in. Coba lagi.')
    } finally {
      setChecking(false)
    }
  }

  const isWithinRadius = distance !== null && distance <= RADIUS_M

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-black text-slate-800">Absensi</h1>
        <p className="text-slate-500 text-sm">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Check-in Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-5">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" /> Status Hari Ini
        </h2>

        {loading ? (
          <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
        ) : today ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <div className="text-center">
              <p className="font-black text-slate-800 text-lg">Sudah Check-In</p>
              <p className="text-slate-500 text-sm">
                {today.checkInTime?.toDate?.()?.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <div className="mt-2">{attendanceBadge(today.status)}</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className={`p-4 rounded-xl ${
              userLocation === null ? 'bg-slate-50 border border-slate-200'
              : isWithinRadius ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                <MapPin className={`h-5 w-5 shrink-0 ${
                  userLocation === null ? 'text-slate-400'
                  : isWithinRadius ? 'text-green-600'
                  : 'text-red-500'
                }`} />
                <div>
                  {userLocation === null ? (
                    <p className="text-slate-600 text-sm">Belum mengambil lokasi</p>
                  ) : isWithinRadius ? (
                    <>
                      <p className="text-green-700 font-semibold text-sm">Dalam radius kantor ✓</p>
                      <p className="text-green-600 text-xs">{distance}m dari kantor (maks. {RADIUS_M}m)</p>
                    </>
                  ) : (
                    <>
                      <p className="text-red-700 font-semibold text-sm flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> Di luar radius kantor</p>
                      <p className="text-red-600 text-xs">{distance}m dari kantor (maks. {RADIUS_M}m)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleLocate} loading={locating} fullWidth>
                <Navigation className="h-4 w-4" /> Ambil Lokasi
              </Button>
              <Button onClick={handleCheckIn} loading={checking} disabled={!userLocation || !isWithinRadius} fullWidth>
                <Clock className="h-4 w-4" /> Check In
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h2 className="font-bold text-slate-800 mb-4">Riwayat Absensi</h2>
        {loading ? (
          <div className="flex flex-col gap-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}</div>
        ) : records.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">Belum ada riwayat absensi.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {records.slice(0, 15).map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${r.status === 'present' ? 'bg-green-500' : r.status === 'late' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="text-slate-700 text-sm font-medium">{r.date}</p>
                    <p className="text-slate-400 text-xs">
                      {r.checkInTime?.toDate?.()?.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) ?? '—'}
                    </p>
                  </div>
                </div>
                {attendanceBadge(r.status)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
