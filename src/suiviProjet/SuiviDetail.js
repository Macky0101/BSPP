import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useTheme } from '../SettingsPage/themeContext';
import SuiviProjetService from '../../services/projetsServices';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';  // Pour les icônes
import * as Animatable from 'react-native-animatable';  // Pour les animations

const SuiviDetail = ({ route }) => {
  const { theme } = useTheme();
  const [suiviDetail, setSuiviDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const { suiviId } = route.params;

  const fetchSuiviDetail = async () => {
    setLoading(true);
    try {
      const response = await SuiviProjetService.getDetailSuivi(suiviId);
      setSuiviDetail(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des détails de suivi', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuiviDetail();
  }, [suiviId]);

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'EN COURS':
        return theme.colors.primary;
      case 'TERMINÉ':
        return 'green';
      case 'DANGER':
        return 'red';
      default:
        return theme.colors.text;
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!suiviDetail) {
    return (
      <View style={styles.errorContainer}>
         <Icon name="wifi-off" size={30} style={ { color: theme.colors.primary }} />
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
        Aucune connexion Internet.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animatable.View animation="fadeIn" duration={1000} style={styles.section}>
        <View style={styles.iconWithText}>
          <Icon name="calendar" size={24} color={theme.colors.primary} />
          <Text style={[styles.subheading, { color: theme.colors.primary, marginLeft: 8 }]}>
            Date de Suivi
          </Text>
        </View>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {suiviDetail.DateSuivi}
        </Text>
      </Animatable.View>

      <Animatable.View animation="fadeIn" duration={1200} style={styles.section}>
        <View style={styles.iconWithText}>
          <Icon name="progress-check" size={24} color={theme.colors.primary} />
          <Text style={[styles.subheading, { color: theme.colors.primary, marginLeft: 8 }]}>
            Niveau d'exécution
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{suiviDetail.NiveauExecution}%</Text>
        </View>
        <ProgressBar
          progress={suiviDetail.NiveauExecution / 100}
          color={theme.colors.primary}
          style={styles.progressBar}
        />
      </Animatable.View>

      <Animatable.View animation="fadeIn" duration={1400} style={styles.section}>
        <View style={styles.iconWithText}>
          <Icon name="chart-line" size={24} color={theme.colors.primary} />
          <Text style={[styles.subheading, { color: theme.colors.primary, marginLeft: 8 }]}>
            Taux d'avancement physique
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{suiviDetail.TauxAvancementPhysique}%</Text>
        </View>
        <ProgressBar
          progress={suiviDetail.TauxAvancementPhysique / 100}
          color={theme.colors.primary}
          style={styles.progressBar}
        />
      </Animatable.View>

      <Animatable.View animation="fadeIn" duration={1600} style={styles.section}>
        <View style={styles.iconWithText}>
          <Icon name="alert-circle-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.subheading, { color: theme.colors.primary, marginLeft: 8 }]}>
            Statut du projet
          </Text>
        </View>
        <Text style={[styles.value, { color: getStatusColor(suiviDetail.StatutProjet) }]}>
          {suiviDetail.StatutProjet.toUpperCase()}
        </Text>
      </Animatable.View>
      <Animatable.View animation="fadeIn" duration={1600} style={styles.section}>
        <View style={styles.iconWithText}>
          <Icon name="alert-circle-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.subheading, { color: theme.colors.primary, marginLeft: 8 }]}>
            Observations
          </Text>
        </View>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          <Text style={styles.value}>{suiviDetail.Observations || 'Aucune'}</Text>
        </Text>
      </Animatable.View>

      {suiviDetail.bailleurs && suiviDetail.bailleurs.length > 0 && (
        <Animatable.View animation="fadeInRight" duration={2000} style={styles.section}>
          <View style={styles.iconWithText}>
            <Icon name="bank-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.subheading, { color: theme.colors.primary, marginLeft: 8 }]}>
              Bailleurs
            </Text>
          </View>
          {suiviDetail.bailleurs.map((bailleur, index) => (
            <Text key={index} style={[styles.label, { color: theme.colors.text }]}>
              {bailleur.CodeBailleur}: <Text style={[styles.amount, { color: theme.colors.primary }]}>{bailleur.MontantDecaisser} GNF</Text>
            </Text>
          ))}
        </Animatable.View>
      )}

      {suiviDetail.contraintes && suiviDetail.contraintes.length > 0 && (
        <Animatable.View animation="fadeInLeft" duration={1800} style={styles.section}>
          <View style={styles.iconWithText}>
            <Icon name="alert-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.subheading, { color: theme.colors.primary, marginLeft: 8 }]}>
              Contraintes
            </Text>
          </View>
          {suiviDetail.contraintes.map((contrainte, index) => (
            <View key={index} style={[styles.label, { color: theme.colors.text }]}>
              <View style={[{ padding: 15, borderRadius: 5,  marginBottom: 5, },{backgroundColor: theme.colors.card, color: theme.colors.text}]}>
                <Text style={[{ padding: 7, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 5, },{backgroundColor: theme.colors.primary }]}> {contrainte.TypeConstrainte}</Text>
                <Text style={[{paddingBottom:5},{ color: theme.colors.text}]}>Contrainte:  {contrainte.IntituleConstrainte}</Text>
                <Text style={[{ color: theme.colors.text}]}>Mitigation:  {contrainte.Mitigation}</Text>
                <Text style={[{color:'red', textAlign:'right'}]}>délai:  {contrainte.Delai}</Text>
              </View>
            </View>
          ))}
        </Animatable.View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    flexDirection: 'column',
  },
  value: {
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default SuiviDetail;
