import { AppSidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
