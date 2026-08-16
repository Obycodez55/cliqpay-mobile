import { useState } from 'react';
import { Text, TextInput as RNTextInput, View, type TextInputProps as RNTextInputProps } from 'react-native';

import { useAppTheme } from '@/hooks/theme-provider';

export type TextInputProps = Omit<RNTextInputProps, 'style' | 'onChangeText'> & {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  errorMessage?: string;
};

export function TextInput({ value, onChangeText, label, errorMessage, onFocus, onBlur, ...rest }: TextInputProps) {
  const theme = useAppTheme();
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(errorMessage);

  const focusColor = theme.mode === 'dark' ? theme.palette.violet[500] : theme.palette.violet[700];
  const borderColor = hasError ? theme.colors.error : focused ? focusColor : theme.colors.border;

  return (
    <View>
      {label ? (
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.caption.fontSize,
            lineHeight: theme.typography.caption.lineHeight,
            fontWeight: theme.typography.caption.fontWeight,
            letterSpacing: theme.typography.caption.letterSpacing,
            marginBottom: theme.spacing[4],
          }}
        >
          {label}
        </Text>
      ) : null}
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        placeholderTextColor={theme.colors.textSecondary}
        style={{
          borderWidth: 1,
          borderColor,
          borderRadius: theme.spacing[12],
          paddingVertical: theme.spacing[12],
          paddingHorizontal: theme.spacing[16],
          backgroundColor: theme.colors.surface,
          color: theme.colors.textPrimary,
          fontSize: theme.typography.body.fontSize,
          lineHeight: theme.typography.body.lineHeight,
          fontWeight: theme.typography.body.fontWeight,
          letterSpacing: theme.typography.body.letterSpacing,
        }}
        {...rest}
      />
      {errorMessage ? (
        <Text
          style={{
            color: theme.colors.error,
            fontSize: theme.typography.caption.fontSize,
            lineHeight: theme.typography.caption.lineHeight,
            fontWeight: theme.typography.caption.fontWeight,
            letterSpacing: theme.typography.caption.letterSpacing,
            marginTop: theme.spacing[4],
          }}
        >
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}
