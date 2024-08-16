import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../SettingsPage/themeContext';
import ContentLoader, { Rect } from 'react-content-loader/native';

const SkeletonCard = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <ContentLoader
        speed={1}
        width={300}
        height={160}
        backgroundColor={theme.colors.backgroundSkeleton}
        foregroundColor={theme.colors.foregroundSkeleton}
        style={styles.contentLoader}
      >
        <Rect x="0" y="0" rx="5" ry="5" width="300" height="20" />
        <Rect x="0" y="30" rx="5" ry="5" width="200" height="20" />
        <Rect x="0" y="60" rx="5" ry="5" width="250" height="20" />
        <Rect x="0" y="90" rx="5" ry="5" width="300" height="20" />
        <Rect x="0" y="120" rx="5" ry="5" width="150" height="20" />
      </ContentLoader>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 3, // Ajoute une ombre pour donner un effet de profondeur
  },
  contentLoader: {
    width: '100%',
    height: '100%',
  },
});

export default SkeletonCard;
