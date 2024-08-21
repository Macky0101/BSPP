import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useTheme } from '../SettingsPage/themeContext';
import AuthService from '../../services/infrastructure';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import SkeletonCard from './../suiviProjet/SkeletonCard';

const Infrastructure = () => {
  const { theme } = useTheme();
  const [infrastructureData, setInfrastructureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Fonction pour stocker les données localement
  const storeDataLocally = async (data) => {
    try {
      await AsyncStorage.setItem('infrastructureData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to store data:', error);
    }
  };

  // Fonction pour récupérer les données stockées localement
  const getLocalData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('infrastructureData');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Failed to retrieve data:', error);
    }
  };

  // Fonction pour charger les infrastructures
  const loadInfrastructureData = async () => {
    try {
      const data = await AuthService.getInfrastructure();
      // console.log(data);
      setInfrastructureData(data);
      storeDataLocally(data); // Stocker les nouvelles données
    } catch (error) {
      console.error('Failed to load infrastructure details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Vérifier la connectivité
      NetInfo.fetch().then(async (state) => {
        if (state.isConnected) {
          // Si connecté, récupérer les données en ligne
          await loadInfrastructureData();
        } else {
          // Sinon, récupérer les données stockées localement
          const localData = await getLocalData();
          if (localData) {
            setInfrastructureData(localData);
          } else {
            console.error('No local data available.');
          }
          setLoading(false);
        }
      });
    };

    fetchData();

    // Ajouter un rafraîchissement lors de chaque accès à la page
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const timeDiff = end.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysRemaining > 0 ? `${daysRemaining} jours restants` : '0 jours restants';
  };

  const getLastTauxAvancement = (suivis) => {
    if (suivis && suivis.length > 0) {
      const dernierSuivi = suivis[suivis.length - 1];
      return dernierSuivi.TauxAvancementTechnique || 0;
    }
    return 0;
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

  if (!infrastructureData.length) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: theme.colors.text }}>Échec du chargement des infrastructures du projet.</Text>
      </View>
    );
  }
  const getTextColor = (value) => {
    if (value >= 0 && value <= 30) {
      return 'red';
    } else if (value > 30 && value <= 75) {
      return 'orange';
    } else if (value > 75) {
      return 'green';
    }
    return theme.colors.text; // Couleur par défaut
  };
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
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.welcomeContainer}>
            <View style={styles.indicatorCardContainer}>
              {infrastructureData.map((infra) => (
                <Animatable.View
                  key={infra.id}
                  animation="fadeInUp"
                  duration={1000}
                  style={[styles.indicatorCard, { backgroundColor: theme.colors.card }]}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate('SuiviInfrastructure', { id: infra.id, codeInfrastructure: infra.CodeInfrastructure })}
                  >
                    <View style={styles.iconContainer}>
                      <View style={styles.logoContainer}>
                        <Image
                          source={infra.Logo ? { uri: infra.Logo } : require('../../assets/icon.png')} // Image par défaut si le logo n'est pas disponible
                          style={styles.logoImage}
                        />
                      </View>
                      <Text style={[styles.header, { color: theme.colors.primary }]}>{infra.NomInfrastructure}</Text>
                    </View>
                    <Text style={[styles.subtitle, { color: theme.colors.text }]}>{infra.CodeInfrastructure}</Text>
                    <View style={styles.content}>
                      <View style={styles.iconTextContainer}>
                        <MaterialCommunityIcons name="account" size={20} color={theme.colors.text} />
                        <Text style={{ color: theme.colors.text, marginLeft: 5 }}>Maître Ouvrage: {infra.MaitreOuvrage}</Text>
                      </View>
                      <View style={styles.iconTextContainer}>
                        <MaterialCommunityIcons name="factory" size={20} color={theme.colors.text} />
                        <Text style={{ color: theme.colors.text, marginLeft: 5 }}>Entreprise Responsable: {infra.EntrepriseResponsable}</Text>
                      </View>
                      <View style={styles.iconTextContainer}>
                        <MaterialCommunityIcons name="calendar-clock" size={20} color={theme.colors.text} />
                        <Text style={{ color: theme.colors.text, marginLeft: 5 }}>Date Fin: {infra.DateFin} <Text style={{ color: 'red' }}>({calculateDaysRemaining(infra.DateFin)})</Text></Text>
                      </View>


                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' , paddingBottom: 5}}>
                        <View>
                          <Text>Avancement Technique:</Text>
                        </View>
                        <View>
                        <Text style={{ color: getTextColor(getLastTauxAvancement(infra.suivis)) , fontWeight:'600'}}>{getLastTauxAvancement(infra.suivis)}%</Text>
                        </View>

                      </View>
                      
                      <ProgressBar
                        progress={isNaN(getLastTauxAvancement(infra.suivis)) ? 0 : getLastTauxAvancement(infra.suivis) / 100}
                        color={getProgressBarColor(getLastTauxAvancement(infra.suivis))}
                        style={{ height: 10, borderRadius: 5 }}
                      />
                    </View>
                  </TouchableOpacity>
                </Animatable.View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};

export default Infrastructure;
