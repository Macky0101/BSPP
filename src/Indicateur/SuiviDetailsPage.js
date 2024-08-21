

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, Alert, Modal, StyleSheet } from 'react-native';
import { useTheme } from '../SettingsPage/themeContext';
import styles from './styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import IndicateurService from '../../services/indicateursServices';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SuiviDetailPage = ({ route }) => {
  const [inputHeight, setInputHeight] = useState(40);
  const { theme } = useTheme();
  const { indicator ,CibleFinProjet, IntituleIndicateur} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newIndicatorSuivi, setNewIndicatorSuivi] = useState({
    id: null,
    CodeIndicateur: indicator.CodeIndicateur,
    DateSuivi: '',
    Realisation: '',
    Observations: ''
  });
  const [suivis, setSuivis] = useState(indicator.suivis || []);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  useEffect(() => {
    checkIfTargetReached();
  }, [suivis]);

  const checkRealisationValue = () => {
    const realisation = parseFloat(newIndicatorSuivi.Realisation);
    const existingRealisationSum = suivis.reduce((sum, suivi) => sum + parseFloat(suivi.Realisation), 0);
    const totalRealisation = existingRealisationSum + realisation;
    const cible = indicator.CibleFinProjet;

    if (isNaN(realisation)) {
      Alert.alert('Erreur', 'Veuillez entrer une valeur numérique pour la réalisation.');
      return false;
    }

    if (totalRealisation > cible) {
      Alert.alert(
        'Erreur',
        `La réalisation totale ne doit pas dépasser la cible de fin de projet (${cible}).\nIl vous reste ${cible - existingRealisationSum} pour atteindre la cible.`
      );
      return false;
    }

    return true;
  };

  const checkIfTargetReached = () => {
    const totalRealisation = suivis.reduce((sum, suivi) => sum + parseFloat(suivi.Realisation), 0);
    if (totalRealisation >= indicator.CibleFinProjet) {
      setConfirmationModalVisible(true);
    }
  };

  const handleAddSuivi = async () => {
    if (!checkRealisationValue()) {
      return;
    }

    setLoading(true);
    try {
      const response = await IndicateurService.addIndicatorSuivi(newIndicatorSuivi);
      if (response && response.status === 'success') {
        if (response.data) {
          setSuivis([...suivis, response.data]);
        } else {
          console.error("Les données retournées par l'API sont invalides ou vides.");
        }
        setModalVisible(false);
        resetNewIndicatorSuivi();
      } else {
        console.error("La réponse de l'API indique une erreur:", response.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du suivi', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuivi = async () => {
    const adjustedSuivis = suivis.map(suivi => (
      suivi.id === newIndicatorSuivi.id ? { ...suivi, Realisation: '0' } : suivi
    ));
    const existingRealisationSum = adjustedSuivis.reduce((sum, suivi) => sum + parseFloat(suivi.Realisation), 0);
    const totalRealisation = existingRealisationSum + parseFloat(newIndicatorSuivi.Realisation);

    if (totalRealisation > indicator.CibleFinProjet) {
      Alert.alert(
        'Erreur',
        `La réalisation totale ne doit pas dépasser la cible de fin de projet (${indicator.CibleFinProjet}).\nIl vous reste ${indicator.CibleFinProjet - existingRealisationSum} pour atteindre la cible.`
      );
      return;
    }

    setLoading(true);
    try {
      const response = await IndicateurService.updateIndicatorSuivi(newIndicatorSuivi);
      if (response && response.status === 'success') {
        setSuivis(suivis.map(suivi => suivi.id === newIndicatorSuivi.id ? response.data : suivi));
        setModalVisible(false);
        resetNewIndicatorSuivi();
      } else {
        console.error("La réponse de l'API indique une erreur:", response.message);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du suivi', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuivi = async (id) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce suivi ? Cette action est irréversible.',
      [
        {
          text: 'Annuler',
          onPress: () => console.log('Suppression annulée'),
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await IndicateurService.deleteIndicatorSuivi(id);
              if (response && response.status === 'success') {
                setSuivis(suivis.filter(suivi => suivi.id !== id));
              } else {
                console.error("La réponse de l'API indique une erreur:", response.message);
              }
            } catch (error) {
              console.error('Erreur lors de la suppression du suivi', error);
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setNewIndicatorSuivi({
      ...newIndicatorSuivi,
      DateSuivi: currentDate.toISOString().split('T')[0]
    });
  };
  const handleDatePickerOpen = () => {
    const initialDate = newIndicatorSuivi.DateSuivi ? new Date(newIndicatorSuivi.DateSuivi) : new Date();
    setShowDatePicker(true);
    setDatePickerDate(initialDate);
  };

  const openEditModal = (suivi) => {
    setNewIndicatorSuivi({
      id: suivi.id,
      CodeIndicateur: suivi.CodeIndicateur,
      DateSuivi: suivi.DateSuivi,
      Realisation: suivi.Realisation.toString(),
      Observations: suivi.Observations
    });
    setEditing(true);
    setModalVisible(true);
  };

  const resetNewIndicatorSuivi = () => {
    setNewIndicatorSuivi({
      id: null,
      CodeIndicateur: indicator.CodeIndicateur,
      DateSuivi: '',
      Realisation: '',
      Observations: ''
    });
    setEditing(false);
  };

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
     <View style={{padding:10}}>
     <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                Indicateur: {indicator.IntituleIndicateur}
              </Text>
              {!confirmationModalVisible && (
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 7 }}
                >
                  <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Nouveau Suivi</Text>
                  <MaterialCommunityIcons name="plus" style={[styles.IndicatorNav, { color: theme.colors.primary }]} />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ marginTop: 15, padding: 10, borderWidth: 2, borderColor: theme.colors.primary, borderRadius: 10, backgroundColor: theme.colors.card }}>
    <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
      Valeur cible: {CibleFinProjet}
    </Text>
  </View>
     </View>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.welcomeContainer}>
           
            {suivis.length > 0 ? (
              suivis.map((suivi) => (
                <View
                  key={suivi.id}
                  style={[styles.indicatorCard, { backgroundColor: theme.colors.card }]}
                >
                  <TouchableOpacity
                    onPress={() => openEditModal(suivi)}
                    style={{ flex: 1 }}
                  >
                    <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Date: {suivi.DateSuivi}</Text>
                    <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Realisation: {suivi.Realisation}</Text>
                    <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Observations: {suivi.Observations}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteSuivi(suivi.id)}
                    style={{ position: 'absolute', top: -10, right: 10 }}
                  >
                    <MaterialCommunityIcons name="delete" size={24} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: 'bold' }}>Aucun suivi disponible</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Modal for Adding or Editing Suivi */}
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraScrollHeight={10} // Augmente la marge entre le clavier et le contenu
            contentContainerStyle={styles.inner}
        >
                  <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                {editing ? 'Modifier le Suivi' : 'Ajouter un Nouveau Suivi'}
              </Text>
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                Date Suivi
              </Text>
              <TouchableOpacity
                onPress={handleDatePickerOpen}
                style={styles.datePicker}
              >
                <Text style={{ color: theme.colors.text }}>
                  {newIndicatorSuivi.DateSuivi || 'Choisir une date'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={datePickerDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                Realisation
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
                value={newIndicatorSuivi.Realisation}
                onChangeText={(text) => setNewIndicatorSuivi({ ...newIndicatorSuivi, Realisation: text })}
                keyboardType="numeric"
              />
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                Observations
              </Text>
              <TextInput
                style={[styles.Observation, { backgroundColor: theme.colors.card, color: theme.colors.text }, { height: inputHeight }]}
                value={newIndicatorSuivi.Observations}
                onChangeText={(text) => setNewIndicatorSuivi({ ...newIndicatorSuivi, Observations: text })}
                multiline
                numberOfLines={4}
                onContentSizeChange={(event) =>
                  setInputHeight(event.nativeEvent.contentSize.height)
                }
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.colors.background }]}
                  onPress={editing ? handleEditSuivi : handleAddSuivi}
                >
                  <Text style={[styles.buttonText,{color: theme.colors.text}]}>{editing ? 'Modifier' : 'Ajouter'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#e74c3c' }]}
                  onPress={() => {
                    resetNewIndicatorSuivi();
                    setModalVisible(false)
                  }}
                >
                  <Text style={styles.buttonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        </KeyboardAwareScrollView>


        {/* Confirmation Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={confirmationModalVisible}
          onRequestClose={() => setConfirmationModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.card, height: '50%' }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Objectif Atteint!
              </Text>
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                Félicitations! Vous avez atteint la valeur cible de fin de projet.
              </Text>
              <MaterialCommunityIcons name="check-circle-outline" size={60} color={theme.colors.primary} style={{ alignSelf: 'center', marginVertical: 20 }} />
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setConfirmationModalVisible(false)}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
};


export default SuiviDetailPage;