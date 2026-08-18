import AppTabs from '@/components/app-tabs';

// Moved here from the app root (Phase 1 issue #7) so `src/app/_layout.tsx` can wrap onboarding
// and auth routes in a Stack alongside this tab group — see the note on app-tabs.tsx's `demo`
// Trigger, which already flagged this as necessary before non-tab routes could be reachable.
export default function TabsLayout() {
  return <AppTabs />;
}
