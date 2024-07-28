import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../SettingsPage/themeContext';
import AuthService from '../../services/indicateursServices';
import styles from './styles';
import { Modal, ModalFooter, ModalButton, ModalContent, ScaleAnimation, ModalTitle } from 'react-native-modals';
import { TextInput } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const IndicatorPage = () => {
  const { theme } = useTheme();
  const [indicatorData, setIndicatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [trackModalVisible, setTrackModalVisible] = useState(false);
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [newIndicator, setNewIndicator] = useState({
    IntituleIndicateur: '',
    CodeIndicateur: '',
    CibleFinProjet: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchIndicator = async () => {
      try {
        const data = await AuthService.getIndicator();
        setIndicatorData(data);
      } catch (error) {
        console.error('Failed to load indicator details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIndicator();
  }, []);

  useEffect(() => {
    if (selectedIndicator) {
      setNewIndicator({
        IntituleIndicateur: selectedIndicator.IntituleIndicateur,
        CodeIndicateur: selectedIndicator.CodeIndicateur,
        CibleFinProjet: selectedIndicator.CibleFinProjet.toString(),
      });
    }
  }, [selectedIndicator]);
  
  const handleLongPress = (indicator) => {
    setSelectedIndicator(indicator);
    setOptionModalVisible(true);
  };
  

  const resetNewIndicator = () => {
    setNewIndicator({
      IntituleIndicateur: '',
      CodeIndicateur: '',
      CibleFinProjet: ''
    });
    setErrorMessage('');
  };

  const toggleAddModal = () => {
    if (addModalVisible) {
      resetNewIndicator();
      setSelectedIndicator(null); // Réinitialiser l'indicateur sélectionné
    } else if (selectedIndicator) {
      setNewIndicator({
        IntituleIndicateur: selectedIndicator.IntituleIndicateur,
        CodeIndicateur: selectedIndicator.CodeIndicateur,
        CibleFinProjet: selectedIndicator.CibleFinProjet.toString(),
      });
      console.log('Modal d\'ajout ouvert avec les données:', newIndicator);
    }
    setAddModalVisible(!addModalVisible);
  };
  
  const handleCloseOptionModal = () => {
    resetNewIndicator(); // Réinitialise les données lorsque le modal d'options est fermé
    setOptionModalVisible(false);
  };
  

  const toggleTrackModal = () => {
    setTrackModalVisible(!trackModalVisible);
  };

  const handleAddIndicator = async () => {
    const indicatorExists = indicatorData.some(indicator => indicator.CodeIndicateur === newIndicator.CodeIndicateur);
    if (indicatorExists) {
      setErrorMessage("Le code de l'indicateur existe déjà. Veuillez entrer un code unique.");
      return;
    }
  
    try {
      const response = await AuthService.addIndicator(newIndicator);
      if (response && response.status === 'success') {
        setIndicatorData(prevData => [...prevData, response.data]);
        toggleAddModal();
        resetNewIndicator();
      }
    } catch (error) {
      console.error('Error adding indicator:', error);
    }
  };
  
  const handleUpdateIndicator = async () => {
    if (!selectedIndicator) return;
  
    const indicatorExists = indicatorData.some(indicator => indicator.CodeIndicateur === newIndicator.CodeIndicateur && indicator.id !== selectedIndicator.id);
    if (indicatorExists) {
      setErrorMessage("Le code de l'indicateur existe déjà. Veuillez entrer un code unique.");
      return;
    }
  
    try {
      const response = await AuthService.updateIndicator({
        ...newIndicator,
        id: selectedIndicator.id
      });
      if (response && response.status === 'success') {
        setIndicatorData(prevData => 
          prevData.map(ind => ind.id === selectedIndicator.id ? response.data : ind)
        );
        toggleAddModal();
        setOptionModalVisible(false);
        resetNewIndicator();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'indicateur :', error);
    }
  };
  
  

  const handleDeleteIndicator = async () => {
    try {
      const response = await AuthService.deleteIndicator(selectedIndicator.id);
      if (response && response.status === 'success') {
        setIndicatorData(indicatorData.filter(ind => ind.id !== selectedIndicator.id));
        setOptionModalVisible(false);
      }
    } catch (error) {
      console.error('Error deleting indicator:', error);
    }
  };

 

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.welcomeContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={[styles.welcomeText, { color: theme.colors.text }]}>Indicateurs</Text>
              </View>
              <TouchableOpacity onPress={toggleAddModal} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 7 }}>
                <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Nouveau Indicateur</Text>
                <MaterialCommunityIcons name="plus" style={[styles.IndicatorNav, { color: theme.colors.primary }]} />
              </TouchableOpacity>
            </View>
            <View style={styles.indicatorCardContainer}>
              {indicatorData && indicatorData.map((indicator) => (
                <TouchableOpacity key={indicator.CodeIndicateur} onLongPress={() => handleLongPress(indicator)}>
                  <View style={[styles.indicatorCard, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>{indicator.CodeIndicateur}: {indicator.IntituleIndicateur}</Text>
                    <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Cible: {indicator.CibleFinProjet}</Text>
                    <View style={styles.buttonContainer}>
                      <MaterialCommunityIcons onPress={toggleTrackModal} name="progress-check" style={[styles.IndicatorNav, { color: theme.colors.primary }]} />
                      <MaterialIcons name="list" style={[styles.IndicatorNav, { color: theme.colors.primary }]} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <Modal
          modalTitle={<ModalTitle title="Formulaire d'Ajout d'un indicateur" />}
          visible={addModalVisible}
          onPress={toggleAddModal}
          onTouchOutside={toggleAddModal}
          modalAnimation={
            new ScaleAnimation({
              initialValue: 0,
              useNativeDriver: true,
            })
          }
          modalStyle={{ zIndex: 9999 }}
          footer={
            <ModalFooter>
              <ModalButton
                text="CANCEL"
                onPress={toggleAddModal}
              />
              <ModalButton
                text="OK"
                onPress={selectedIndicator ? handleUpdateIndicator : handleAddIndicator}
              />
            </ModalFooter>
          }
        >
          <ModalContent style={{ paddingTop: 15 }}>
            <TextInput
              mode="outlined"
              label="Code de l'indicateur"
              placeholder="Saisir le code de l'indicateur"
              value={newIndicator.CodeIndicateur}
              onChangeText={(text) => setNewIndicator({ ...newIndicator, CodeIndicateur: text })}
              error={!!errorMessage}
              style={styles.input}
            />
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            <TextInput
              mode="outlined"
              label="Intitulé de l'indicateur"
              placeholder="Saisir l'intitulé de l'indicateur"
              value={newIndicator.IntituleIndicateur}
              onChangeText={(text) => setNewIndicator({ ...newIndicator, IntituleIndicateur: text })}
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="Cible à la Fin du Projet"
              placeholder="Saisir la cible à la fin du projet"
              value={newIndicator.CibleFinProjet}
              onChangeText={(text) => setNewIndicator({ ...newIndicator, CibleFinProjet: text })}
              keyboardType="numeric"
              style={styles.input}
            />
          </ModalContent>
        </Modal>

        <Modal
          modalTitle={<ModalTitle title="Formulaire de Suivi d'un indicateur" />}
          visible={trackModalVisible}
          onTouchOutside={toggleTrackModal}
          modalAnimation={
            new ScaleAnimation({
              initialValue: 0,
              useNativeDriver: true,
            })
          }
          modalStyle={{ zIndex: 9999 }}
          footer={
            <ModalFooter>
              <ModalButton
                text="CANCEL"
                onPress={toggleTrackModal}
              />
              <ModalButton
                text="OK"
                onPress={() => {
                  // Logique pour le formulaire de suivi
                  toggleTrackModal();
                }}
              />
            </ModalFooter>
          }
        >
          <ModalContent style={{ paddingTop: 15 }}>
            <Text>Contenu du formulaire de suivi à ajouter ici</Text>
          </ModalContent>
        </Modal>

        <Modal
  modalTitle={<ModalTitle title="Options de l'indicateur" />}
  visible={optionModalVisible}
  // onPress={toggleAddModal}
  onTouchOutside={handleCloseOptionModal}
  modalAnimation={
    new ScaleAnimation({
      initialValue: 0,
      useNativeDriver: true,
    })
  }
  modalStyle={{ zIndex: 9999 }}
  footer={
    <ModalFooter>
      <ModalButton
        text="CANCEL"
        onPress={handleCloseOptionModal}
      />
    </ModalFooter>
  }
>
  <ModalContent style={{ paddingTop: 15 }}>
    <TouchableOpacity style={styles.mesbutton} onPress={toggleAddModal}>
      <Text style={styles.optionText}>Modifier</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.mesbutton1} onPress={handleDeleteIndicator}>
      <Text style={styles.optionText}>Supprimer</Text>
    </TouchableOpacity>
  </ModalContent>
</Modal>


      </View>
    </SafeAreaProvider>
  );
};

export default IndicatorPage;
