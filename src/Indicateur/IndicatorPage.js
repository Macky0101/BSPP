import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons,EvilIcons } from '@expo/vector-icons';
import { useTheme } from '../SettingsPage/themeContext';
import AuthService from '../../services/indicateursServices';
import styles from './styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Modal, ModalContent } from 'react-native-modals';
import SkeletonCard from './../suiviProjet/SkeletonCard';
import CustomText from '../../NumberText';
import { ProgressBar, MD3Colors } from 'react-native-paper';

const IndicatorPage = () => {
  const { theme } = useTheme();
  const [indicatorData, setIndicatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchIndicator = async () => {
      try {
        const data = await AuthService.getIndicator();
        setIndicatorData(data);
        // console.log(data);
        // Calculer le taux de réalisation pour chaque indicator
        const indicateursAvecTaux = data.map(indicator => {
          const totalRealisation = indicator.suivis.reduce((sum, suivi) => {
            return sum + parseFloat(suivi.Realisation);
          }, 0);

          const tauxRealisation = Math.min((totalRealisation / parseFloat(indicator.CibleFinProjet)) * 100, 100);

          return {
            ...indicator,
            tauxRealisation: tauxRealisation.toFixed(2) // Arrondi à deux décimales
          };
        });

        setIndicatorData(indicateursAvecTaux);
      } catch (error) {
        console.error('Failed to load indicator details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIndicator();
  }, []);

  const getProgressBarColor = (value) => {
    if (value >= 0 && value <= 30) {
      return 'red';
    } else if (value > 30 && value <= 75) {
      return 'orange';
    } else if (value > 75) {
      return 'green';
    }
    return theme.colors.primary; // Couleur par défaut
  };
  // if (loading) {
  //   return (
  //     <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
  //       <ActivityIndicator size="large" color={theme.colors.primary} />
  //     </View>
  //   );
  // }
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  if (!indicatorData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: theme.colors.text }}>Échec du chargement des indicateurs du projet.</Text>
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.welcomeContainer}>
            <View style={styles.indicatorCardContainer}>
              {indicatorData && indicatorData.map((indicator) => (
                <TouchableOpacity
                  key={indicator.CodeIndicateur}
                  onPress={() => {
                    console.log('donne', indicator)
                    navigation.navigate('SuiviDetailPage', {
                      indicator,
                      CibleFinProjet: indicator.CibleFinProjet,
                      IntituleIndicateur: indicator.IntituleIndicateur
                    })
                  }}
                >
                  <View style={[styles.indicatorCard, { backgroundColor: theme.colors.card }]}>
                    <View style={[{ padding: 7, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 5 }, { backgroundColor: theme.colors.primary, color: theme.colors.text }]}>
                      <Text >
                        {indicator.CodeIndicateur}: {indicator.IntituleIndicateur}
                      </Text>
                    </View>


                    <View style={styles.buttonContainer}>
                      <View>
                      <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                        Valeur cible: <Text style={{ fontWeight: 700, fontSize: 16 }}>{indicator.CibleFinProjet}</Text>
                      </Text>
                      </View>
                      <View>
                        <Text style={[{ color: theme.colors.text }]}>Taux de réalisation : <CustomText style={[{ color: 'red', fontSize: 16 }]}> {indicator.tauxRealisation}% </CustomText></Text>
                        <ProgressBar
                          progress={isNaN(indicator.tauxRealisation) ? 0 : indicator.tauxRealisation / 100}
                          color={getProgressBarColor(indicator.tauxRealisation)}
                          style={{ height: 10, borderRadius: 5 }}
                        />

                      </View>
                    <EvilIcons name="arrow-right"  style={[styles.IndicatorNav, { color: theme.colors.primary }]}/>
                      {/* <MaterialIcons name="arrow-right" style={[styles.IndicatorNav, { color: theme.colors.primary }]} /> */}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};

export default IndicatorPage;
