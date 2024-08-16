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
  
  

  // const handleDeleteIndicator = async () => {
  //   try {
  //     const response = await AuthService.deleteIndicator(selectedIndicator.id);
  //     if (response && response.status === 'success') {
  //       setIndicatorData(indicatorData.filter(ind => ind.id !== selectedIndicator.id));
  //       setOptionModalVisible(false);
  //     }
  //   } catch (error) {
  //     console.error('Error deleting indicator:', error);
  //   }
  // };

 

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
                {/* <Text style={[styles.welcomeText, { color: theme.colors.text }]}>Indicateurs</Text> */}
              </View>
              {/* <TouchableOpacity onPress={toggleAddModal} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 7 }}> */}
              <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 7 }}>
                {/* <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Nouveau Indicateur</Text> */}
                {/* <MaterialCommunityIcons name="plus" style={[styles.IndicatorNav, { color: theme.colors.primary }]} /> */}
              </TouchableOpacity>
            </View>
            <View style={styles.indicatorCardContainer}>
              {indicatorData && indicatorData.map((indicator) => (
                // <TouchableOpacity key={indicator.CodeIndicateur} onLongPress={() => handleLongPress(indicator)}>
                <TouchableOpacity key={indicator.CodeIndicateur}>
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
    {/* <TouchableOpacity style={styles.mesbutton1} onPress={handleDeleteIndicator}> */}
    <TouchableOpacity style={styles.mesbutton1}>
      <Text style={styles.optionText}>Supprimer</Text>
    </TouchableOpacity>
  </ModalContent>
</Modal>


      </View>
    </SafeAreaProvider>
  );
};

export default IndicatorPage;







// import React, { useState } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
// import { useTheme } from '../SettingsPage/themeContext';
// import styles from './styles';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import IndicateurService from '../../services/indicateursServices';
// import { Modal, ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle } from 'react-native-modals';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const SuiviDetailPage = ({ route }) => {
//   const { theme } = useTheme();
//   const { indicator } = route.params;
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [newIndicatorSuivi, setNewIndicatorSuivi] = useState({
//     id: null,
//     CodeIndicateur: indicator.CodeIndicateur,
//     DateSuivi: '',
//     Realisation: '',
//     Observations: ''
//   });
//   const [suivis, setSuivis] = useState(indicator.suivis || []);
//   const [loading, setLoading] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const checkRealisationValue = () => {
//     const realisation = parseFloat(newIndicatorSuivi.Realisation);
//     const cible = indicator.CibleFinProjet;

//     if (isNaN(realisation)) {
//       Alert.alert('Erreur', 'Veuillez entrer une valeur numérique pour la réalisation.');
//       return false;
//     }

//     if (realisation > cible) {
//       Alert.alert(
//         'Erreur',
//         `La réalisation ne doit pas dépasser la cible de fin de projet (${cible}).\nIl vous reste ${cible - realisation} pour atteindre la cible.`
//       );
//       return false;
//     }

//     return true;
//   };

//   const handleAddSuivi = async () => {
//     if (!checkRealisationValue()) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await IndicateurService.addIndicatorSuivi(newIndicatorSuivi);
//       if (response && response.status === 'success') {
//         if (response.data) {
//           setSuivis([...suivis, response.data]);
//         } else {
//           console.error("Les données retournées par l'API sont invalides ou vides.");
//         }
//         setModalVisible(false);
//         resetNewIndicatorSuivi();
//       } else {
//         console.error("La réponse de l'API indique une erreur:", response.message);
//       }
//     } catch (error) {
//       console.error('Erreur lors de l\'ajout du suivi', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditSuivi = async () => {
//     if (!checkRealisationValue()) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await IndicateurService.updateIndicatorSuivi(newIndicatorSuivi);
//       if (response && response.status === 'success') {
//         setSuivis(suivis.map(suivi => suivi.id === newIndicatorSuivi.id ? response.data : suivi));
//         setModalVisible(false);
//         resetNewIndicatorSuivi();
//       } else {
//         console.error("La réponse de l'API indique une erreur:", response.message);
//       }
//     } catch (error) {
//       console.error('Erreur lors de la modification du suivi', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteSuivi = async (id) => {
//     setLoading(true);
//     try {
//       const response = await IndicateurService.deleteIndicatorSuivi(id);
//       if (response && response.status === 'success') {
//         setSuivis(suivis.filter(suivi => suivi.id !== id));
//       } else {
//         console.error("La réponse de l'API indique une erreur:", response.message);
//       }
//     } catch (error) {
//       console.error('Erreur lors de la suppression du suivi', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || new Date();
//     setShowDatePicker(Platform.OS === 'ios');
//     setNewIndicatorSuivi({
//       ...newIndicatorSuivi,
//       DateSuivi: currentDate.toISOString().split('T')[0] // Format YYYY-MM-DD
//     });
//   };

//   const openEditModal = (suivi) => {
//     setNewIndicatorSuivi({
//       id: suivi.id,
//       CodeIndicateur: suivi.CodeIndicateur,
//       DateSuivi: suivi.DateSuivi,
//       Realisation: suivi.Realisation.toString(),
//       Observations: suivi.Observations
//     });
//     setEditing(true);
//     setModalVisible(true);
//   };

//   const resetNewIndicatorSuivi = () => {
//     setNewIndicatorSuivi({
//       id: null,
//       CodeIndicateur: indicator.CodeIndicateur,
//       DateSuivi: '',
//       Realisation: '',
//       Observations: ''
//     });
//     setEditing(false);
//   };

//   return (
//     <SafeAreaProvider>
//       <View style={{ flex: 1 }}>
//         <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
//           <View style={styles.welcomeContainer}>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//               <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
//                 Indicator: {indicator.IntituleIndicateur}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setModalVisible(true)}
//                 style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 7 }}
//               >
//                 <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Nouveau Suivi</Text>
//                 <MaterialCommunityIcons name="plus" style={[styles.IndicatorNav, { color: theme.colors.primary }]} />
//               </TouchableOpacity>
//             </View>
//             {suivis.length > 0 ? (
//               suivis.map((suivi) => (
//                 <View
//                   key={suivi.id}
//                   style={[styles.indicatorCard, { backgroundColor: theme.colors.card }]}
//                 >
//                   <TouchableOpacity
//                     onPress={() => openEditModal(suivi)}
//                     style={{ flex: 1 }}
//                   >
//                     <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Date: {suivi.DateSuivi}</Text>
//                     <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Realisation: {suivi.Realisation}</Text>
//                     <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Observations: {suivi.Observations}</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => handleDeleteSuivi(suivi.id)}
//                     style={{ position: 'absolute', top: -10, right: 10 }}
//                   >
//                     <MaterialCommunityIcons name="delete" size={24} color={theme.colors.primary} />
//                   </TouchableOpacity>
//                 </View>
//               ))
//             ) : (
//               <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
//                 <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Aucune donnée disponible</Text>
//               </View>
//             )}
//           </View>
//         </ScrollView>
//         <Modal
//           visible={modalVisible}
//           onTouchOutside={() => setModalVisible(false)}
//           modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
//           modalTitle={<ModalTitle title={editing ? "Modifier Suivi de l'Indicateur" : "Ajouter Suivi de l'Indicateur"} />}
//         >
//           <ModalContent style={styles.modalContent}>
//           <View style={{flexDirection: 'row', }}>
//           <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//               <TextInput
//                 placeholder="Date Suivi"
//                 value={newIndicatorSuivi.DateSuivi}
//                 editable={false}
//                 style={styles.input}
//               />
//             </TouchableOpacity>
//             {showDatePicker && (
//               <DateTimePicker
//                 value={new Date()}
//                 mode="date"
//                 display="default"
//                 onChange={onDateChange}
//               />
//             )}
//             <TextInput
//               placeholder="Realisation"
//               value={newIndicatorSuivi.Realisation}
//               onChangeText={(text) => setNewIndicatorSuivi({ ...newIndicatorSuivi, Realisation: text })}
//               style={styles.input}
//               keyboardType="numeric"
//             />
//           </View>
//             <TextInput
//               placeholder="Observations"
//               value={newIndicatorSuivi.Observations}
//               onChangeText={(text) => setNewIndicatorSuivi({ ...newIndicatorSuivi, Observations: text })}
//               style={styles.input}
//               // multiline
//             />
//           </ModalContent>
//           <ModalFooter>
//             <ModalButton
//               text="ANNULER"
//               onPress={() => setModalVisible(false)}
//             />
//             <ModalButton
//               text={editing ? "ENREGISTRER" : "AJOUTER"}
//               onPress={editing ? handleEditSuivi : handleAddSuivi}
//               loading={loading}
//             />
//           </ModalFooter>
//         </Modal>
//       </View>
//     </SafeAreaProvider>
//   );
// };

// export default SuiviDetailPage;





// import React, { useState } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, Alert, Modal } from 'react-native';
// import { useTheme } from '../SettingsPage/themeContext';
// import styles from './styles';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import IndicateurService from '../../services/indicateursServices';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const SuiviDetailPage = ({ route }) => {
//   const { theme } = useTheme();
//   const { indicator } = route.params;
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [newIndicatorSuivi, setNewIndicatorSuivi] = useState({
//     id: null,
//     CodeIndicateur: indicator.CodeIndicateur,
//     DateSuivi: '',
//     Realisation: '',
//     Observations: ''
//   });
//   const [suivis, setSuivis] = useState(indicator.suivis || []);
//   const [loading, setLoading] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const checkRealisationValue = () => {
//     const realisation = parseFloat(newIndicatorSuivi.Realisation);
//     const existingRealisationSum = suivis.reduce((sum, suivi) => sum + parseFloat(suivi.Realisation), 0);
//     const totalRealisation = existingRealisationSum + realisation;
//     const cible = indicator.CibleFinProjet;

//     if (isNaN(realisation)) {
//       Alert.alert('Erreur', 'Veuillez entrer une valeur numérique pour la réalisation.');
//       return false;
//     }

//     if (totalRealisation > cible) {
//       Alert.alert(
//         'Erreur',
//         `La réalisation totale ne doit pas dépasser la cible de fin de projet (${cible}).\nIl vous reste ${cible - existingRealisationSum} pour atteindre la cible.`
//       );
//       return false;
//     }

//     return true;
//   };
//   const totalRealisation = suivis.reduce((sum, suivi) => sum + parseFloat(suivi.Realisation), 0);
//   const hasReachedTarget = totalRealisation >= indicator.CibleFinProjet;
//   const handleAddSuivi = async () => {
//     if (!checkRealisationValue()) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await IndicateurService.addIndicatorSuivi(newIndicatorSuivi);
//       if (response && response.status === 'success') {
//         if (response.data) {
//           setSuivis([...suivis, response.data]);
//         } else {
//           console.error("Les données retournées par l'API sont invalides ou vides.");
//         }
//         setModalVisible(false);
//         resetNewIndicatorSuivi();
//       } else {
//         console.error("La réponse de l'API indique une erreur:", response.message);
//       }
//     } catch (error) {
//       console.error('Erreur lors de l\'ajout du suivi', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditSuivi = async () => {
//     const editingRealisation = suivis.find(suivi => suivi.id === newIndicatorSuivi.id).Realisation;
//     const adjustedSuivis = suivis.map(suivi => (
//       suivi.id === newIndicatorSuivi.id ? { ...suivi, Realisation: '0' } : suivi
//     ));
//     const existingRealisationSum = adjustedSuivis.reduce((sum, suivi) => sum + parseFloat(suivi.Realisation), 0);
//     const totalRealisation = existingRealisationSum + parseFloat(newIndicatorSuivi.Realisation);

//     if (totalRealisation > indicator.CibleFinProjet) {
//       Alert.alert(
//         'Erreur',
//         `La réalisation totale ne doit pas dépasser la cible de fin de projet (${indicator.CibleFinProjet}).\nIl vous reste ${indicator.CibleFinProjet - existingRealisationSum} pour atteindre la cible.`
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await IndicateurService.updateIndicatorSuivi(newIndicatorSuivi);
//       if (response && response.status === 'success') {
//         setSuivis(suivis.map(suivi => suivi.id === newIndicatorSuivi.id ? response.data : suivi));
//         setModalVisible(false);
//         resetNewIndicatorSuivi();
//       } else {
//         console.error("La réponse de l'API indique une erreur:", response.message);
//       }
//     } catch (error) {
//       console.error('Erreur lors de la modification du suivi', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteSuivi = async (id) => {
//     Alert.alert(
//       'Confirmer la suppression',
//       'Êtes-vous sûr de vouloir supprimer ce suivi ? Cette action est irréversible.',
//       [
//         {
//           text: 'Annuler',
//           onPress: () => console.log('Suppression annulée'),
//           style: 'cancel',
//         },
//         {
//           text: 'Supprimer',
//           onPress: async () => {
//             setLoading(true);
//             try {
//               const response = await IndicateurService.deleteIndicatorSuivi(id);
//               if (response && response.status === 'success') {
//                 setSuivis(suivis.filter(suivi => suivi.id !== id));
//               } else {
//                 console.error("La réponse de l'API indique une erreur:", response.message);
//               }
//             } catch (error) {
//               console.error('Erreur lors de la suppression du suivi', error);
//             } finally {
//               setLoading(false);
//             }
//           },
//           style: 'destructive',
//         },
//       ],
//       { cancelable: true }
//     );
//   };


//   const onDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || new Date();
//     setShowDatePicker(Platform.OS === 'ios');
//     setNewIndicatorSuivi({
//       ...newIndicatorSuivi,
//       DateSuivi: currentDate.toISOString().split('T')[0]
//     });
//   };

//   const openEditModal = (suivi) => {
//     setNewIndicatorSuivi({
//       id: suivi.id,
//       CodeIndicateur: suivi.CodeIndicateur,
//       DateSuivi: suivi.DateSuivi,
//       Realisation: suivi.Realisation.toString(),
//       Observations: suivi.Observations
//     });
//     setEditing(true);
//     setModalVisible(true);
//   };

//   const resetNewIndicatorSuivi = () => {
//     setNewIndicatorSuivi({
//       id: null,
//       CodeIndicateur: indicator.CodeIndicateur,
//       DateSuivi: '',
//       Realisation: '',
//       Observations: ''
//     });
//     setEditing(false);
//   };

//   return (
//     <SafeAreaProvider>
//       <View style={{ flex: 1 }}>
//         <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
//           <View style={styles.welcomeContainer}>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//               <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
//                 Indicateur: {indicator.IntituleIndicateur}
//               </Text>
//                {!hasReachedTarget && (
//                 <TouchableOpacity
//                   onPress={() => setModalVisible(true)}
//                   style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 7 }}
//                 >
//                   <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Nouveau Suivi</Text>
//                   <MaterialCommunityIcons name="plus" style={[styles.IndicatorNav, { color: theme.colors.primary }]} />
//                 </TouchableOpacity>
//               )}
//             </View>
//             {suivis.length > 0 ? (
//               suivis.map((suivi) => (
//                 <View
//                   key={suivi.id}
//                   style={[styles.indicatorCard, { backgroundColor: theme.colors.card }]}
//                 >
//                   <TouchableOpacity
//                     onPress={() => openEditModal(suivi)}
//                     style={{ flex: 1 }}
//                   >
//                     <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Date: {suivi.DateSuivi}</Text>
//                     <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Realisation: {suivi.Realisation}</Text>
//                     <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Observations: {suivi.Observations}</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => handleDeleteSuivi(suivi.id)}
//                     style={{ position: 'absolute', top: -10, right: 10 }}
//                   >
//                     <MaterialCommunityIcons name="delete" size={24} color={theme.colors.primary} />
//                   </TouchableOpacity>
//                 </View>
//               ))
//             ) : (
//               <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
//                 <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Aucune donnée disponible</Text>
//               </View>
//             )}
//           </View>
//         </ScrollView>

//         <Modal
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//           transparent={true}
//           animationType="slide"
//         >
//           <View style={styles.modalOverlay}>
//             <View style={[styles.modalContainer, { backgroundColor: theme.colors.card }]}>
//               <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
//                 {editing ? "Modifier Suivi de l'Indicateur" : "Ajouter Suivi de l'Indicateur"}
//               </Text>

//               <View style={styles.modalContent}>
//                 <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Date Suivi:</Text>
//                 <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//                   <TextInput
//                     style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
//                     value={newIndicatorSuivi.DateSuivi}
//                     placeholder="YYYY-MM-DD"
//                     placeholderTextColor={theme.colors.placeholder}
//                     editable={false}
//                   />
//                 </TouchableOpacity>

//                 <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Réalisation:</Text>
//                 <TextInput
//                   style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
//                   value={newIndicatorSuivi.Realisation}
//                   onChangeText={(text) => setNewIndicatorSuivi({ ...newIndicatorSuivi, Realisation: text })}
//                   placeholder="Enter Réalisation"
//                   placeholderTextColor={theme.colors.placeholder}
//                   keyboardType="numeric"
//                 />

//                 <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Observations:</Text>
//                 <TextInput
//                   style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
//                   value={newIndicatorSuivi.Observations}
//                   onChangeText={(text) => setNewIndicatorSuivi({ ...newIndicatorSuivi, Observations: text })}
//                   placeholder="Enter Observations"
//                   placeholderTextColor={theme.colors.placeholder}
//                 />
//               </View>

//               {showDatePicker && (
//                 <DateTimePicker
//                   value={new Date(newIndicatorSuivi.DateSuivi || Date.now())}
//                   mode="date"
//                   display="default"
//                   onChange={onDateChange}
//                 />
//               )}

//               <View style={styles.modalActions}>
//                 <TouchableOpacity
//                   onPress={() =>{
//                   resetNewIndicatorSuivi();
//                   setModalVisible(false)}
//                   } 
//                   style={[styles.button, styles.cancelButton, { backgroundColor: theme.colors.background }]}

//                 >
//                   <Text style={[styles.buttonText, { color: theme.colors.primary }]}>Annuler</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={editing ? handleEditSuivi : handleAddSuivi}
//                   style={[styles.button, styles.submitButton, { backgroundColor: theme.colors.primary }]}
//                 >
//                   <Text style={[styles.buttonText, { color: theme.colors.text }]}>
//                     {editing ? 'Modifier' : 'Ajouter'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </SafeAreaProvider>
//   );
// };

// export default SuiviDetailPage;











