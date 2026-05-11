import { Timestamp, GeoPoint } from 'firebase/firestore'

export interface User {
  uid: string
  name: string
  phone: string
  email: string
  role: 'admin' | 'employee'
  photoURL: string
  isActive: boolean
  createdAt: Timestamp
}

export interface VehiclePrice {
  type: 'City Car' | 'Medium Car' | 'SUV' | 'Premium/ShowCar'
  price: number
  priceMax: number | null
}

export interface Service {
  id: string
  name: string
  description: string
  category: 'package' | 'additional'
  vehicleTypes: VehiclePrice[]
  isActive: boolean
  order: number
  updatedAt: Timestamp
}

export interface Task {
  id: string
  employeeId: string
  assignedBy: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in_progress' | 'done'
  deadline: Timestamp
  assignedDate: Timestamp
  completedAt: Timestamp | null
}

export interface Attendance {
  id: string
  employeeId: string
  date: string // YYYY-MM-DD
  checkInTime: Timestamp
  location: GeoPoint
  status: 'present' | 'late' | 'absent'
  note: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  thumbnail: string
  excerpt: string
  category: string
  status: 'draft' | 'published'
  authorId: string
  publishedAt: Timestamp
  createdAt: Timestamp
}

export interface Portfolio {
  id: string
  imageUrl: string
  beforeImageUrl: string | null
  category: 'daily' | 'showroom' | 'contest' | 'dealer'
  description: string
  order: number
  createdAt: Timestamp
}

export interface Testimonial {
  id: string
  customerName: string
  vehicleType: string
  rating: number
  comment: string
  isActive: boolean
  order: number
  createdAt: Timestamp
}
