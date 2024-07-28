// SuiviProjet.js
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ProgressBar, MD3Colors } from 'react-native-paper';
import styles from './styles';
import { useTheme } from '../SettingsPage/themeContext'; 
import React, { useEffect, useState } from 'react';
import AuthService from '../../services/authServices';

const SuiviProjet = () => {
  const { theme } = useTheme();
  const [projetSuivi , setProjetSuivi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProjetSuivi = async () => {
      try {
        const response = await AuthService.getProjectDetails();
        const suivi = response.suivis;
        setProjetSuivi(suivi);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données de suivi', error);
        setLoading(false);
      }
    };
    getProjetSuivi();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'DANGER':
        return 'red';
      case 'TERMINER':
        return 'green';
      case 'EN COURS':
        return 'yellow';
      default:
        return theme.colors.text;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.welcomeContainer}>
        <Text style={[styles.welcomeText, { color: theme.colors.text }]}>Suivi projet</Text>
      </View>
      <ScrollView>
        {projetSuivi.map((suivi, index) => (
          <View key={index} style={[styles.indicatorCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.cardContent}>
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                Date de suivi : {suivi.DateSuivi}
              </Text>
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                Niveau d'exécution :
              </Text>
              <ProgressBar 
                progress={suivi.NiveauExecution / 100} 
                color={MD3Colors.primary50} 
                style={styles.progressBar} 
              />
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                Taux d'avancement physique :
              </Text>
              <ProgressBar 
                progress={suivi.TauxAvancementPhysique / 100} 
                color={MD3Colors.secondary50} 
                style={styles.progressBar} 
              />
              <Text style={[styles.indicatorLabel, { color: getStatusColor(suivi.StatutProjet) }]}>
                Statut du projet : {suivi.StatutProjet}
              </Text>
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                Observations : {suivi.Observations ? suivi.Observations : 'Aucune'}
              </Text>
            </View>
            <MaterialIcons name="list" style={[styles.IndicatorNav, { color: theme.colors.primary }]} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default SuiviProjet;
