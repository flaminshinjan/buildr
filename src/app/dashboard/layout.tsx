import { Sidebar } from "@/components/layout/sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { PageGuidePopup } from "@/components/layout/page-guide-popup";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 240, backgroundColor: "var(--bg-primary)" }}>
        <DashboardTopbar />
        <PageGuidePopup />
        <main style={{ padding: "32px 40px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
