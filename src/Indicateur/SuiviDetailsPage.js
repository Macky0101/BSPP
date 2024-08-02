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













import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, Alert, Modal, StyleSheet } from 'react-native';
import { useTheme } from '../SettingsPage/themeContext';
import styles from './styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import IndicateurService from '../../services/indicateursServices';
import DateTimePicker from '@react-native-community/datetimepicker';

const SuiviDetailPage = ({ route }) => {
  const { theme } = useTheme();
  const { indicator } = route.params;
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
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.welcomeContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
                style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
                value={newIndicatorSuivi.Observations}
                onChangeText={(text) => setNewIndicatorSuivi({ ...newIndicatorSuivi, Observations: text })}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                  onPress={editing ? handleEditSuivi : handleAddSuivi}
                >
                  <Text style={styles.buttonText}>{editing ? 'Modifier' : 'Ajouter'}</Text>
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
                Félicitations! Vous avez atteint la cible de fin de projet.
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
