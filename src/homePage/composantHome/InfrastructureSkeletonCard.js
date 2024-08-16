import React from 'react';
import { View, Text ,StyleSheet} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './../../SettingsPage/themeContext';
// import styles from './../styles'; // Assurez-vous d'ajouter les styles nécessaires
import ContentLoader, { Rect } from 'react-content-loader/native';

const InfrastructureSkeletonCard = () => {
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
    // <View style={styles.skeletonCard}>
    //   <LinearGradient
    //     colors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
    //     style={styles.skeletonGradient}
    //   >
    //     <View style={styles.skeletonHeader}>
    //       <View style={styles.skeletonCircle} />
    //       <View style={styles.skeletonTitle} />
    //     </View>
    //     <View style={styles.skeletonBody}>
    //       <View style={styles.skeletonLine} />
    //       <View style={styles.skeletonLine} />
    //       <View style={styles.skeletonLine} />
    //     </View>
    //   </LinearGradient>
    // </View>
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
export default InfrastructureSkeletonCard;
