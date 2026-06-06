import { AppHeader } from "@/components/layout/sidebar";
import { VoiceCheckIn } from "@/components/voice/voice-check-in";

export default function VoiceCheckInPage() {
  return (
    <div>
      <AppHeader
        title="Scheduled Voice Check-In"
        subtitle="Voice-only wellness check powered by pitch, tone, and safety analysis"
      />
      <VoiceCheckIn />
    </div>
  );
}
