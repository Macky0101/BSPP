import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, Modal, Button, TouchableOpacity,Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProgressBar, MD3Colors, FAB } from 'react-native-paper';
import { useTheme } from '../SettingsPage/themeContext';
import AuthService from '../../services/authServices';
import SuiviProjetService from '../../services/projetsServices';
import AddSuiviForm from './AddSuiviForm';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SkeletonCard from './SkeletonCard';

const SuiviProjet = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
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
      // console.log(suivi);
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

  const [selectedSuivi, setSelectedSuivi] = useState(null);
  const toggleModalVisibility = (visible, suivi = null) => {
    if (suivi) {
      console.log("Modification du suivi:", suivi);
    } else {
      console.log("Ajout d'un nouveau suivi");
    }
    setSelectedSuivi(suivi);
    setModalVisible(visible);
  };
  

  const toggleObservation = (index) => {
    setExpandedObservation(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };
  const navigateToDetail = (suiviId) => {
    navigation.navigate('SuiviDetail', { suiviId });
  };

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

  if (!projetSuivi) {
    return (
      <View style={styles.errorContainer}>
         <Icon name="wifi-off" size={30} style={ { color: theme.colors.primary }} />
        <Text style={{ color: theme.colors.text }}>Aucune connexion Internet.</Text>
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'DANGER':
        return 'red';
      case 'TERMINER':
        return 'green';
      case 'EN COURS':
        return '#F3B530';
      default:
        return theme.colors.text;
    }
  };


  const handleDeleteSuivi = async (suiviId) => {
    try {
      await SuiviProjetService.deleteSuiviProjet(suiviId);
      fetchData();  // Refresh data after deletion
    } catch (error) {
      console.error('Erreur lors de la suppression du suivi', error);
    }
  };

  const confirmDelete = (suiviId) => {
    Alert.alert(
      "Confirmation de suppression",
      "Êtes-vous sûr de vouloir supprimer ce suivi ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", onPress: () => handleDeleteSuivi(suiviId) }
      ],
      { cancelable: true }
    );
  };

  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.Appb }}>
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
          <TouchableOpacity 
          key={index} 
          onPress={() => navigateToDetail(suivi.id)}
          onLongPress={() => confirmDelete(suivi.id)}
          >
            <View key={index} style={[styles.indicatorCard, { backgroundColor: theme.colors.card }]}>
              <View style={styles.cardContent}>
                <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                  Suivi du : {suivi.DateSuivi}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                    Niveau d'exécution :
                  </Text>
                  <Text style={[styles.indicatorLabel, { color: getTextColor(suivi.NiveauExecution) }]}>
                     {suivi.NiveauExecution} %
                  </Text>
                </View>

                <ProgressBar
                  progress={isNaN(suivi.NiveauExecution) ? 0 : suivi.NiveauExecution / 100}
                  color={getProgressBarColor(suivi.NiveauExecution)}
                  style={{ height: 10, borderRadius: 5 }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                    Taux d'avancement physique:
                  </Text>
                  <Text style={[styles.indicatorLabel, { color: getTextColor(suivi.TauxAvancementPhysique,) }]}>
                     {suivi.TauxAvancementPhysique} %
                  </Text>
                </View>
                <ProgressBar
                  progress={isNaN(suivi.TauxAvancementPhysique) ? 0 : suivi.TauxAvancementPhysique / 100}
                  color={getProgressBarColor(suivi.TauxAvancementPhysique)}
                  style={{ height: 10, borderRadius: 5 }}
                />
                <Text style={[styles.indicatorLabel, { color: getStatusColor(suivi.StatutProjet) }]}>
                  Statut du projet : {suivi.StatutProjet}
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

                <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                <View>
 <TouchableOpacity onPress={() => toggleModalVisibility(true, suivi)}>
                  <MaterialIcons name="edit" size={36} color={theme.colors.primary} />
                </TouchableOpacity>
                </View>
                <View>
                <MaterialIcons name="list" style={[styles.IndicatorNav, { color: theme.colors.primary }]} />

                </View>
              </View>
               

              </View>
              
            </View>

          </TouchableOpacity>
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
            <AddSuiviForm
              onSuccess={handleAddSuiviSuccess}
              onClose={() => toggleModalVisibility(false)}
              suivi={selectedSuivi} // Passez les données ici
            />
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default SuiviProjet;
