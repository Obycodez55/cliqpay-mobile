import { View } from 'react-native';

import { useAppTheme } from '@/hooks/theme-provider';

export type PaginationDotsProps = {
  count: number;
  activeIndex: number;
};

const DOT_SIZE = 8;
const ACTIVE_DOT_WIDTH = 20;

export function PaginationDots({ count, activeIndex }: PaginationDotsProps) {
  const theme = useAppTheme();
  const activeColor = theme.mode === 'dark' ? theme.palette.violet[500] : theme.palette.violet[700];

  return (
    <View style={{ flexDirection: 'row', gap: theme.spacing[8], alignItems: 'center' }}>
      {Array.from({ length: count }).map((_, index) => {
        const active = index === activeIndex;
        return (
          <View
            key={index}
            style={{
              width: active ? ACTIVE_DOT_WIDTH : DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: DOT_SIZE / 2,
              backgroundColor: active ? activeColor : theme.palette.violet[300],
            }}
          />
        );
      })}
    </View>
  );
}
