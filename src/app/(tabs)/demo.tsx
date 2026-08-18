import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { AmountInput } from '@/components/amount-input';
import { Avatar, AvatarStack } from '@/components/avatar';
import { BottomSheet } from '@/components/bottom-sheet';
import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
import { TextInput } from '@/components/text-input';
import { Toast } from '@/components/toast';
import { TransactionRow } from '@/components/transaction-row';
import { BottomTabInset } from '@/constants/theme';
import { useAppTheme } from '@/hooks/theme-provider';

// Throwaway Phase 0 verification screen — exercises every core component together in the
// Simulator (issue #6). Not a real product screen; reachable only by direct navigation.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useAppTheme();
  return (
    <View style={{ gap: theme.spacing[12] }}>
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontSize: theme.typography.heading.fontSize,
          lineHeight: theme.typography.heading.lineHeight,
          fontWeight: theme.typography.heading.fontWeight,
          letterSpacing: theme.typography.heading.letterSpacing,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function DemoScreen() {
  const theme = useAppTheme();
  const [amount, setAmount] = useState('12,500.00');
  const [plainValue, setPlainValue] = useState('');
  const [errorValue, setErrorValue] = useState('not-an-email');
  const [sheetVisible, setSheetVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.canvas }} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ padding: theme.spacing[16], gap: theme.spacing[32] }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: theme.typography.title.fontSize,
            lineHeight: theme.typography.title.lineHeight,
            fontWeight: theme.typography.title.fontWeight,
            letterSpacing: theme.typography.title.letterSpacing,
          }}
        >
          Phase 0 component demo
        </Text>

        <Section title="Button">
          <View style={{ gap: theme.spacing[12] }}>
            <Button label="Primary" variant="primary" onPress={() => {}} />
            <Button label="Secondary" variant="secondary" onPress={() => {}} />
            <Button label="Disabled" variant="primary" disabled onPress={() => {}} />
          </View>
        </Section>

        <Section title="Text input">
          <View style={{ gap: theme.spacing[16] }}>
            <TextInput label="Default (tap to focus)" value={plainValue} onChangeText={setPlainValue} placeholder="Type here" />
            <TextInput
              label="With error"
              value={errorValue}
              onChangeText={setErrorValue}
              errorMessage="Enter a valid email address"
            />
          </View>
        </Section>

        <Section title="Amount input">
          <AmountInput value={amount} onChangeText={setAmount} />
        </Section>

        <Section title="Avatar">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[24] }}>
            <Avatar size="large" />
            <Avatar size="large" initials="Obykoya" />
            <AvatarStack
              size="large"
              max={3}
              avatars={[
                { initials: 'AO' },
                { initials: 'BK' },
                { initials: 'CD' },
                { initials: 'EF' },
                { initials: 'GH' },
              ]}
            />
          </View>
        </Section>

        <Section title="Status badge">
          <View style={{ flexDirection: 'row', gap: theme.spacing[12] }}>
            <StatusBadge status="pending" />
            <StatusBadge status="successful" />
            <StatusBadge status="failed" />
          </View>
        </Section>

        <Section title="Transaction row">
          <View style={{ backgroundColor: theme.colors.surface, borderRadius: theme.spacing[16], paddingHorizontal: theme.spacing[16] }}>
            <TransactionRow
              counterpartyName="Chidinma Okonkwo-Adebayo-Williams"
              amount={45000}
              direction="sent"
              timestamp="Today, 10:42 AM"
              status="successful"
              avatar={{ initials: 'CO' }}
            />
            <TransactionRow
              counterpartyName="Tunde Bakare"
              amount={8500}
              direction="received"
              timestamp="Yesterday, 4:15 PM"
              status="successful"
              avatar={{ initials: 'TB' }}
            />
            <TransactionRow
              counterpartyName="Femi Adeyemi"
              amount={2000}
              direction="sent"
              timestamp="Mon, 9:03 AM"
              status="pending"
              avatar={{ initials: 'FA' }}
            />
          </View>
        </Section>

        <Section title="Bottom sheet">
          <Button label="Open bottom sheet" variant="secondary" onPress={() => setSheetVisible(true)} />
        </Section>

        <Section title="Toast">
          <Button
            label="Trigger toast"
            variant="secondary"
            onPress={() => {
              setToastVisible(true);
            }}
          />
        </Section>

        <Section title="Empty state">
          <EmptyState
            icon={<SymbolView name={{ ios: 'tray', android: 'inbox', web: 'inbox' }} size={32} tintColor={theme.colors.textSecondary} />}
            title="No transactions yet"
            subtitle="Money you send or receive will show up here."
          />
        </Section>
      </ScrollView>

      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)}>
        <View style={{ gap: theme.spacing[16], paddingBottom: theme.spacing[8] }}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontSize: theme.typography.heading.fontSize,
              lineHeight: theme.typography.heading.lineHeight,
              fontWeight: theme.typography.heading.fontWeight,
            }}
          >
            Sample sheet content
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.body.fontSize,
              lineHeight: theme.typography.body.lineHeight,
            }}
          >
            Drag this down to dismiss, or tap the button below.
          </Text>
          <Button label="Close" variant="primary" onPress={() => setSheetVisible(false)} />
        </View>
      </BottomSheet>

      {/* NativeTabs' floating tab bar isn't accounted for by Toast's own `bottom` offset (it
          overlays outside this screen's flex layout) — this wrapper gives Toast a new absolute
          containing block shifted up by the scaffold's existing BottomTabInset, matching how
          index.tsx already handles the same tab-bar overlap. Only needed because this demo is a
          tab route; a real screen using Toast wouldn't need this wrapper unless it's also a
          direct tab route. */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: BottomTabInset }}>
        <Toast visible={toastVisible} message="Transfer sent successfully" onDismiss={() => setToastVisible(false)} />
      </View>
    </SafeAreaView>
  );
}
