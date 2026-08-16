import { Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/theme-provider';

export type TransactionStatus = 'pending' | 'successful' | 'failed';

export type StatusBadgeProps = {
  status: TransactionStatus;
  label?: string;
};

const DEFAULT_LABELS: Record<TransactionStatus, string> = {
  pending: 'Pending',
  successful: 'Successful',
  failed: 'Failed',
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const theme = useAppTheme();

  const colorsByStatus: Record<TransactionStatus, { text: string; background: string }> = {
    pending: { text: theme.colors.warning, background: theme.colors.warningTint },
    successful: { text: theme.colors.success, background: theme.colors.successTint },
    failed: { text: theme.colors.error, background: theme.colors.errorTint },
  };

  const { text, background } = colorsByStatus[status];

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: background,
        borderRadius: theme.spacing[8],
        paddingVertical: theme.spacing[4],
        paddingHorizontal: theme.spacing[8],
      }}
    >
      <Text
        style={{
          color: text,
          fontSize: theme.typography.label.fontSize,
          lineHeight: theme.typography.label.lineHeight,
          fontWeight: theme.typography.label.fontWeight,
          letterSpacing: theme.typography.label.letterSpacing,
        }}
        numberOfLines={1}
      >
        {label ?? DEFAULT_LABELS[status]}
      </Text>
    </View>
  );
}
