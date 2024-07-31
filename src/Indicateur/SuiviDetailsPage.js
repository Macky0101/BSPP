import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useTheme } from '../SettingsPage/themeContext';
import styles from './styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import IndicateurService from '../../services/indicateursServices';
import { Modal, ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle } from 'react-native-modals';
import DateTimePicker from '@react-native-community/datetimepicker';

const SuiviDetailPage = ({ route }) => {
  const { theme } = useTheme();
  const { indicator } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
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

  const handleAddSuivi = async () => {
    setLoading(true);
    try {
      const response = await IndicateurService.addIndicatorSuivi(newIndicatorSuivi);
      if (response && response.status === 'success') {
        if (response.data) {
          setSuivis([...suivis, response.data]);
        } else {
          console.error('Les données retournées par l\'API sont invalides ou vides.');
        }
        setModalVisible(false);
        resetNewIndicatorSuivi();
      } else {
        console.error('La réponse de l\'API indique une erreur:', response.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du suivi', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuivi = async () => {
    setLoading(true);
    try {
      const response = await IndicateurService.updateIndicatorSuivi(newIndicatorSuivi);
      if (response && response.status === 'success') {
        setSuivis(suivis.map(suivi => suivi.id === newIndicatorSuivi.id ? response.data : suivi));
        setModalVisible(false);
        resetNewIndicatorSuivi();
      } else {
        console.error('La réponse de l\'API indique une erreur:', response.message);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du suivi', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuivi = async (id) => {
    setLoading(true);
    try {
      const response = await IndicateurService.deleteIndicatorSuivi(id);
      if (response && response.status === 'success') {
        setSuivis(suivis.filter(suivi => suivi.id !== id));
      } else {
        console.error('La réponse de l\'API indique une erreur:', response.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du suivi', error);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setNewIndicatorSuivi({
      ...newIndicatorSuivi,
      DateSuivi: currentDate.toISOString().split('T')[0] // Format YYYY-MM-DD
    });
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
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.welcomeContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                Indicator: {indicator.IntituleIndicateur}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 7 }}
              >
                <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Nouveau Suivi</Text>
                <MaterialCommunityIcons name="plus" style={[styles.IndicatorNav, { color: theme.colors.primary }]} />
              </TouchableOpacity>
            </View>
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
                <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Aucune donnée disponible</Text>
              </View>
            )}
          </View>
        </ScrollView>
        <Modal
          visible={modalVisible}
          onTouchOutside={() => setModalVisible(false)}
          modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
          modalTitle={<ModalTitle title={editing ? "Modifier Suivi de l'Indicateur" : "Ajouter Suivi de l'Indicateur"} />}
          style={styles.modal}
        >
          <ModalContent style={styles.modalContent}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                placeholder="Date Suivi"
                value={newIndicatorSuivi.DateSuivi}
                editable={false}
                style={styles.input}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            <TextInput
              placeholder="Realisation"
              value={newIndicatorSuivi.Realisation}
              onChangeText={(text) => setNewIndicatorSuivi({ ...newIndicatorSuivi, Realisation: text })}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Observations"
              value={newIndicatorSuivi.Observations}
              onChangeText={(text) => setNewIndicatorSuivi({ ...newIndicatorSuivi, Observations: text })}
              style={styles.input}
            />
            <ModalFooter>
              <ModalButton
                text="Annuler"
                onPress={() => {
                  setModalVisible(false);
                  resetNewIndicatorSuivi();
                }}
              />
              <ModalButton
                text={editing ? "Modifier Suivi" : "Ajouter Suivi"}
                onPress={editing ? handleEditSuivi : handleAddSuivi}
                disabled={loading}
              />
            </ModalFooter>
          </ModalContent>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
};

export default SuiviDetailPage;
