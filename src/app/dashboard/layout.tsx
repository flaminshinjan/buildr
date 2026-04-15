import { Sidebar } from "@/components/layout/sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 260 }}>
        <DashboardTopbar />
        <main style={{ padding: "24px 32px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
