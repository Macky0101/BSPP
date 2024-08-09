import React, { useEffect, useState,useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, Modal, Button, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ProgressBar, MD3Colors, FAB } from 'react-native-paper';
import { useTheme } from '../SettingsPage/themeContext'; 
import AuthService from '../../services/authServices';
import AddSuiviForm from './AddSuiviForm';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar, Divider } from 'react-native-paper';

const SuiviProjet = () => {
  const { theme } = useTheme();
  const [projetSuivi, setProjetSuivi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedObservation, setExpandedObservation] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AuthService.getProjectDetails();
      const suivi = response.suivis;
      setProjetSuivi(suivi);
    } catch (error) {
      console.error('Erreur lors du chargement des données de suivi', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );



  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleAddSuiviSuccess = () => {
    setModalVisible(false);
    fetchData();
  };

  const toggleObservation = (index) => {
    setExpandedObservation(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  if (!projetSuivi) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: theme.colors.text }}>Échec du chargement des suivis du projet.</Text>
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
      <Appbar.Header style={{backgroundColor: theme.colors.Appb}}>
        {/* <View style={styles.welcomeContainer}> */}
        <Text style={[styles.welcomeText, { color: theme.colors.text }]}>Suivi projet</Text>
      {/* </View> */}
      </Appbar.Header>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {projetSuivi.map((suivi, index) => (
          <View key={index} style={[styles.indicatorCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.cardContent}>
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                Date de suivi* : {suivi.DateSuivi}
              </Text>
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                Niveau d'exécution* :
              </Text>
              <ProgressBar 
                progress={suivi.NiveauExecution / 100} 
                color={MD3Colors.primary50} 
                style={styles.progressBar} 
              />
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                Taux d'avancement physique*:
              </Text>
              <ProgressBar 
                progress={suivi.TauxAvancementPhysique / 100} 
                color={MD3Colors.secondary50} 
                style={styles.progressBar} 
              />
              <Text style={[styles.indicatorLabel, { color: getStatusColor(suivi.StatutProjet) }]}>
                Statut du projet* : {suivi.StatutProjet}
              </Text>
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                Observations : 
                {suivi.Observations ? 
                  (expandedObservation[index] || suivi.Observations.length <= 100 
                    ? suivi.Observations 
                    : `${suivi.Observations.slice(0, 100)}...`) 
                  : 'Aucune'}
              </Text>
              {suivi.Observations && suivi.Observations.length > 100 && (
                <TouchableOpacity onPress={() => toggleObservation(index)}>
                  <Text style={[styles.showMoreText, { color: theme.colors.primary }]}>
                    {expandedObservation[index] ? 'Voir moins' : 'Voir plus'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <MaterialIcons name="list" style={[styles.IndicatorNav, { color: theme.colors.primary }]} />
          </View>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setModalVisible(true)}
      />
      
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
        animationType="slide"
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.modalBackground }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            {/* <AddSuiviForm onSuccess={handleAddSuiviSuccess} /> */}
            <AddSuiviForm onSuccess={handleAddSuiviSuccess} onClose={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SuiviProjet;
