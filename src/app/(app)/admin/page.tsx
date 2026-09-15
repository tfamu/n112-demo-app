import { AdminTable } from './admin-table'

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">管理</h1>
      <p className="rounded-xl border border-dashed bg-muted/40 p-3 text-sm text-muted-foreground">
        本番ではこのページは管理者アカウントのみに開かれ、データ自体も
        データベース側（RLS）で保護されています。デモにはログインがないため
        誰でも閲覧でき、以下の数値はすべてダミーデータです。
      </p>
      <AdminTable />
    </div>
  )
}
