import { AdminTable } from './admin-table'

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="rounded-xl border border-dashed bg-muted/40 p-3 text-sm text-muted-foreground">
        Trong bản thật, trang này chỉ mở cho tài khoản admin và dữ liệu được chặn ở
        tầng database (RLS). Bản demo không có đăng nhập nên ai cũng vào xem được —
        toàn bộ số liệu dưới đây là dữ liệu mẫu.
      </p>
      <AdminTable />
    </div>
  )
}
