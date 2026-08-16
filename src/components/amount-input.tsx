import { Text, TextInput, View } from 'react-native';

import { useAppTheme } from '@/hooks/theme-provider';

export type AmountInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  currencySymbol?: string;
  placeholder?: string;
};

const DECIMAL_AMOUNT_PATTERN = /^\d*\.?\d{0,2}$/;

export function AmountInput({ value, onChangeText, currencySymbol = '₦', placeholder = '0' }: AmountInputProps) {
  const theme = useAppTheme();

  const handleChangeText = (text: string) => {
    if (DECIMAL_AMOUNT_PATTERN.test(text)) {
      onChangeText(text);
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontSize: theme.typography.title.fontSize,
          lineHeight: theme.typography.display.lineHeight,
          fontWeight: theme.typography.display.fontWeight,
          marginRight: theme.spacing[4],
        }}
      >
        {currencySymbol}
      </Text>
      <TextInput
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType="decimal-pad"
        inputMode="decimal"
        style={{
          color: theme.colors.textPrimary,
          fontSize: theme.typography.display.fontSize,
          lineHeight: theme.typography.display.lineHeight,
          fontWeight: theme.typography.display.fontWeight,
          letterSpacing: theme.typography.display.letterSpacing,
          minWidth: theme.spacing[64],
          textAlign: 'center',
        }}
      />
    </View>
  );
}
