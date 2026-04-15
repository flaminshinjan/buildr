import { Sidebar } from "@/components/layout/sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 260, backgroundColor: "var(--bg-primary)" }}>
        <DashboardTopbar />
        <main style={{ padding: "32px 40px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
