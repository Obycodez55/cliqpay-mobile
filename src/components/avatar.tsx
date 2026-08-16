import { Image, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppTheme } from '@/hooks/theme-provider';

export type AvatarSize = 'small' | 'medium' | 'large';

export type AvatarProps = {
  imageUri?: string;
  initials?: string;
  size?: AvatarSize;
};

const AVATAR_SIZES: Record<AvatarSize, number> = { small: 28, medium: 40, large: 56 };

function getInitialsFontSize(size: number) {
  return Math.round(size * 0.4);
}

export function Avatar({ imageUri, initials, size = 'medium' }: AvatarProps) {
  const theme = useAppTheme();
  const dimension = AVATAR_SIZES[size];
  const trimmedInitials = initials?.trim();

  const containerStyle = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
    overflow: 'hidden' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  if (imageUri) {
    return <Image source={{ uri: imageUri }} style={containerStyle} />;
  }

  if (trimmedInitials) {
    return (
      <View style={[containerStyle, { backgroundColor: theme.palette.violet[100] }]}>
        <Text
          style={{
            color: theme.mode === 'dark' ? theme.palette.violet[50] : theme.palette.violet[700],
            fontSize: getInitialsFontSize(dimension),
            fontWeight: '600',
          }}
          numberOfLines={1}
        >
          {trimmedInitials.slice(0, 2).toUpperCase()}
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[theme.palette.violet[500], theme.palette.violet[700]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={containerStyle}
    />
  );
}

export type AvatarStackProps = {
  avatars: AvatarProps[];
  size?: AvatarSize;
  max?: number;
};

export function AvatarStack({ avatars, size = 'small', max = 4 }: AvatarStackProps) {
  const theme = useAppTheme();
  const dimension = AVATAR_SIZES[size];
  const overlap = Math.round(dimension * 0.3);
  const visible = avatars.slice(0, max);
  const overflowCount = avatars.length - visible.length;

  return (
    <View style={{ flexDirection: 'row' }}>
      {visible.map((avatar, index) => (
        <View
          key={index}
          style={{
            marginLeft: index === 0 ? 0 : -overlap,
            borderRadius: dimension / 2,
            borderWidth: 2,
            borderColor: theme.colors.surface,
          }}
        >
          <Avatar {...avatar} size={size} />
        </View>
      ))}
      {overflowCount > 0 ? (
        <View
          style={{
            marginLeft: -overlap,
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
            borderWidth: 2,
            borderColor: theme.colors.surface,
            backgroundColor: theme.colors.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: getInitialsFontSize(dimension) * 0.85,
              fontWeight: '600',
            }}
            numberOfLines={1}
          >
            +{overflowCount}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
