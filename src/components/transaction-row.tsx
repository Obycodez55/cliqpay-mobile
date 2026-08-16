import { Text, View } from 'react-native';

import { Avatar, type AvatarProps } from '@/components/avatar';
import { StatusBadge, type TransactionStatus } from '@/components/status-badge';
import { useAppTheme } from '@/hooks/theme-provider';

export type TransactionDirection = 'sent' | 'received';

export type TransactionRowProps = {
  counterpartyName: string;
  amount: number;
  direction: TransactionDirection;
  timestamp: string;
  status: TransactionStatus;
  avatar?: AvatarProps;
  currencySymbol?: string;
};

function formatAmount(amount: number, currencySymbol: string) {
  const formatted = Math.abs(amount).toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${currencySymbol}${formatted}`;
}

export function TransactionRow({
  counterpartyName,
  amount,
  direction,
  timestamp,
  status,
  avatar,
  currencySymbol = '₦',
}: TransactionRowProps) {
  const theme = useAppTheme();
  const isReceived = direction === 'received';

  const amountColor = isReceived ? theme.colors.success : theme.colors.textPrimary;
  const amountPrefix = isReceived ? '+' : '-';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing[12],
        gap: theme.spacing[12],
      }}
    >
      <Avatar {...avatar} size="medium" />

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: theme.typography.body.fontSize,
            lineHeight: theme.typography.body.lineHeight,
            fontWeight: '600',
            letterSpacing: theme.typography.body.letterSpacing,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {counterpartyName}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing[4], gap: theme.spacing[8] }}>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.caption.fontSize,
              lineHeight: theme.typography.caption.lineHeight,
              fontWeight: theme.typography.caption.fontWeight,
              letterSpacing: theme.typography.caption.letterSpacing,
            }}
            numberOfLines={1}
          >
            {timestamp}
          </Text>
          <StatusBadge status={status} />
        </View>
      </View>

      <Text
        style={{
          color: amountColor,
          fontSize: theme.typography.body.fontSize,
          lineHeight: theme.typography.body.lineHeight,
          fontWeight: '600',
          letterSpacing: theme.typography.body.letterSpacing,
          marginLeft: theme.spacing[8],
        }}
        numberOfLines={1}
      >
        {amountPrefix}
        {formatAmount(amount, currencySymbol)}
      </Text>
    </View>
  );
}
