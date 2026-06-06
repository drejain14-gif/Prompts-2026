import { AppSidebar } from "@/components/layout/sidebar";
import { CheckInNotificationProvider } from "@/components/notifications/check-in-notification-provider";
import { SkipLink } from "@/components/accessibility/skip-link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CheckInNotificationProvider>
      <SkipLink />
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <main id="main-content" className="lg:pl-64" tabIndex={-1}>
          <div className="mx-auto max-w-6xl px-4 py-8 pt-16 lg:pt-8">
            {children}
          </div>
        </main>
      </div>
    </CheckInNotificationProvider>
  );
}
