import EmployeeGuard from '@/components/employee/EmployeeGuard'
import { EmployeeNav } from '@/components/employee/EmployeeNav'

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <EmployeeGuard>
      <div className="flex min-h-screen bg-slate-50">
        <EmployeeNav />
        <div className="flex-1 flex flex-col min-w-0 pt-14 pb-20 md:pt-0 md:pb-0">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </EmployeeGuard>
  )
}
