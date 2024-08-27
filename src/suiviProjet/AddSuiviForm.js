import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity, Platform, Modal, FlatList } from 'react-native';
import SuiviProjetService from '../../services/projetsServices';
import { useTheme } from '../SettingsPage/themeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import { Chip } from 'react-native-paper';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';


const labels = ["Progrès", "Contraintes", "Bailleurs de fonds"];
const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fe7013',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#fe7013',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#fe7013'
};

const AddSuiviForm = ({ onSuccess, onClose, suivi }) => {
  const [filteredBailleurs, setFilteredBailleurs] = useState([]);
  const [bailleurs, setBailleurs] = useState([]);
  const [selectedBailleur, setSelectedBailleur] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bailleurss, setbailleurs] = useState([]);
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await SuiviProjetService.getProjectDetails();
        if (response && response) {
          // console.log('bailleurs projet', response);
          setBailleurs(response);
        }
      } catch (error) {
        console.error('error lors de la recuperation des bailleurs', error);
      }
    };

    fetchProjectDetails();
  }, []);

  useEffect(() => {
    const filtered = bailleurs.filter(bailleur =>
      bailleur.CodeBailleur.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBailleurs(filtered);
  }, [searchTerm, bailleurs]);

  const handleSelectFunder = (code) => {
    setCurrentFunder(prev => ({ ...prev, CodeBailleur: code }));
    closeModal();
  };

  const renderFunderItem = ({ item }) => (
    <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectFunder(item.CodeBailleur)}>
      <Text style={styles.modalItemText}>{item.CodeBailleur}</Text>
    </TouchableOpacity>
  );

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const { theme } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [formData, setFormData] = useState({
    DateSuivi: '',
    NiveauExecution: '',
    TauxAvancementPhysique: '',
    StatutProjet: '',
    Observations: '',
    contraintes: [], // Array of constraints
    bailleurs: [], // Array of funders
  });
  const [currentConstraint, setCurrentConstraint] = useState({ IntituleConstrainte: '', TypeConstrainte: '', Mitigation: '', Delai: '' });
  const [currentFunder, setCurrentFunder] = useState({ CodeBailleur: '', MontantDecaisser: '' });
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [editingConstraintIndex, setEditingConstraintIndex] = useState(null);
  const [editingFunderIndex, setEditingFunderIndex] = useState(null);
  const [isEditingMode, setIsEditingMode] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };
  const handleDeleteConstraint = (index) => {
    const updatedConstraints = formData.contraintes.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, contraintes: updatedConstraints }));
  };

  const handleDeleteFunder = (index) => {
    const updatedFunders = formData.bailleurs.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, bailleurs: updatedFunders }));
  };


  const validateStep = () => {
    let newErrors = {};
    if (currentPosition === 0) {
      if (!formData.DateSuivi) newErrors.DateSuivi = 'La date de suivi est obligatoire';
      if (!formData.NiveauExecution) newErrors.NiveauExecution = 'Le niveau d\'exécution est obligatoire';
      if (!formData.TauxAvancementPhysique) newErrors.TauxAvancementPhysique = 'Le taux d\'avancement physique est obligatoire';
      if (!formData.StatutProjet) newErrors.StatutProjet = 'Le statut du projet est obligatoire';
    } else if (currentPosition === 1) {
      // if (!currentConstraint.IntituleConstrainte) newErrors.IntituleConstrainte = 'L\'intitulé de contrainte est obligatoire';
      // if (!currentConstraint.TypeConstrainte) newErrors.TypeConstrainte = 'Le type de contrainte est obligatoire';
    } else if (currentPosition === 2) {
      // if (!currentFunder.CodeBailleur) newErrors.CodeBailleur = 'Le code du bailleur est obligatoire';
      // if (!currentFunder.MontantDecaisser) newErrors.MontantDecaisser = 'Le montant décaissé est obligatoire';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (!validateForm()) return;

    if (isEditingMode && currentPosition === 0) {
      handleUpdateSuivi(); // Fonction pour mettre à jour le suivi existant
      return;
    }
    

    if (currentPosition === 0) {
        setCurrentPosition(1);
    } else if (currentPosition === 1) {
        if (editingConstraintIndex !== null) {
            const updatedConstraints = [...formData.contraintes];
            if (currentConstraint.IntituleConstrainte && currentConstraint.TypeConstrainte) {
                updatedConstraints[editingConstraintIndex] = currentConstraint;
                setFormData((prevData) => ({ ...prevData, contraintes: updatedConstraints }));
            }
            setEditingConstraintIndex(null);
        } else {
            if (currentConstraint.IntituleConstrainte && currentConstraint.TypeConstrainte) {
                setFormData((prevData) => ({
                    ...prevData,
                    contraintes: [...prevData.contraintes, currentConstraint]
                }));
            }
        }
        setCurrentConstraint({ IntituleConstrainte: '', TypeConstrainte: '', Mitigation: '', Delai: '' });
        setCurrentPosition(2);
    } else if (currentPosition === 2) {
        if (editingFunderIndex !== null) {
            const updatedFunders = [...formData.bailleurs];
            if (currentFunder.CodeBailleur && currentFunder.MontantDecaisser) {
                updatedFunders[editingFunderIndex] = currentFunder;
                setFormData((prevData) => ({ ...prevData, bailleurs: updatedFunders }));
            }
            setEditingFunderIndex(null);
        } else {
            if (currentFunder.CodeBailleur && currentFunder.MontantDecaisser) {
                setFormData((prevData) => ({
                    ...prevData,
                    bailleurs: [...prevData.bailleurs, currentFunder]
                }));
            }
        }
        setCurrentFunder({ CodeBailleur: '', MontantDecaisser: '' });

        handleSubmit();
    }
};



  const handleBack = () => {
    setCurrentPosition((prev) => Math.max(prev - 1, 0));
  };
  const confirmSubmit = () => {
    return new Promise((resolve) => {
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir envoyer les données ?",
        [
          {
            text: "Annuler",
            onPress: () => resolve(false),
            style: "cancel"
          },
          {
            text: "Confirmer",
            onPress: () => resolve(true)
          }
        ],
        { cancelable: false }
      );
    });
  };

  const handleSubmit = async () => {
    const isConfirmed = await confirmSubmit();
    if (!isConfirmed) return;

    try {
      await SuiviProjetService.AddSuiviProjet(formData);
      Alert.alert('Succès', 'Suivi projet ajouté avec succès');
      if (onSuccess) onSuccess();
    } catch (error) {
      Alert.alert('Erreur', 'Échec de l\'ajout du suivi projet');
      console.error('Erreur lors de l\'ajout du suivi projet', error);
    }
  };
  const isEditing = suivi !== null;
  useEffect(() => {
    if (suivi) {
      setIsEditingMode(true); // Passe en mode modification si un suivi est fourni
      setFormData({
        DateSuivi: suivi.DateSuivi || '',
        NiveauExecution: suivi.NiveauExecution || '',
        TauxAvancementPhysique: suivi.TauxAvancementPhysique || '',
        StatutProjet: suivi.StatutProjet || '',
        Observations: suivi.Observations || '',
      });
    } else {
      setIsEditingMode(false); // Reste en mode ajout sinon
    }
  }, [suivi]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.DateSuivi) newErrors.DateSuivi = 'La date de suivi est obligatoire';
    if (!formData.NiveauExecution) newErrors.NiveauExecution = 'Le niveau d\'exécution est obligatoire';
    if (!formData.TauxAvancementPhysique) newErrors.TauxAvancementPhysique = 'Le taux d\'avancement physique est obligatoire';
    if (!formData.StatutProjet) newErrors.StatutProjet = 'Le statut du projet est obligatoire';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleUpdateSuivi = async () => {
    const isConfirmed = await confirmUpdate();
    if (!isConfirmed) return;
    if (!validateForm()) return;
 
    try {
       const suiviProjet = {
          id_suivi: suivi.id,  
          DateSuivi: formData.DateSuivi,
          NiveauExecution: formData.NiveauExecution,
          TauxAvancementPhysique: formData.TauxAvancementPhysique,
          CodeProjet: suivi.CodeProjet,  
          StatutProjet: formData.StatutProjet,
          Observations: formData.Observations || null  
       };
       await SuiviProjetService.UpdateSuiviProjet(suiviProjet);
       Alert.alert('Succès', 'Suivi projet mis à jour avec succès');
       if (onSuccess) onSuccess();
    } catch (error) {
       Alert.alert('Erreur', 'Échec de la mise à jour du suivi projet');
       console.error('Erreur lors de la mise à jour du suivi projet:', error);
    }
 };
 
  
  const confirmUpdate = () => {
    return new Promise((resolve) => {
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir modifier ce suivi projet ?",
        [
          {
            text: "Annuler",
            onPress: () => resolve(false),
            style: "cancel"
          },
          {
            text: "Confirmer",
            onPress: () => resolve(true)
          }
        ],
        { cancelable: false }
      );
    });
  };




  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || datePickerDate;
    setShowDatePicker(Platform.OS === 'ios');
    setFormData({
      ...formData,
      DateSuivi: currentDate.toISOString().split('T')[0]
    });
    setDatePickerDate(currentDate);
  };

  const handleDatePickerOpen = () => {
    const initialDate = formData.DateSuivi ? new Date(formData.DateSuivi) : new Date();
    setDatePickerDate(initialDate);
    setShowDatePicker(true);
  };

  const handleStatusSelect = (status) => {
    setFormData({ ...formData, StatutProjet: status });
  };

  const handleConstraintTypeSelect = (type) => {
    setCurrentConstraint({ ...currentConstraint, TypeConstrainte: type });
  };

  const handleEditConstraint = (index) => {
    setCurrentConstraint(formData.contraintes[index]);
    setEditingConstraintIndex(index);
    setCurrentPosition(1);
  };

  const handleEditFunder = (index) => {
    setCurrentFunder(formData.bailleurs[index]);
    setEditingFunderIndex(index);
    setCurrentPosition(2);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background,  }
      ]}
    
    >
      <View style={styles.header}>
        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Ajouter Suivi Projet</Text>
        <MaterialIcons
          size={32}
          name="close"
          onPress={onClose}
          style={[styles.closeModal, { color: theme.colors.primary }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        />
      </View>

      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentPosition}
        labels={labels}
        stepCount={3}
      />

      {currentPosition === 0 && (
        <>
          <View style={styles.formGroup}>
            <View style={styles.datePickerContainer}>
              <Text style={styles.label}>Date de suivi*</Text>
              <TouchableOpacity
                onPress={handleDatePickerOpen}
                style={styles.datePickerButton}
              >
                <Text style={styles.dateText}>
                  {formData.DateSuivi || '   '}
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
            {errors.DateSuivi && <Text style={styles.errorText}>{errors.DateSuivi}</Text>}
            </View>

          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Niveau d'exécution*</Text>
            <TextInput
              placeholder="Niveau d'exécution 0-100"
              value={formData.NiveauExecution}
              keyboardType="numeric"
              onChangeText={(text) => handleChange('NiveauExecution', text)}
              style={[styles.input, { borderColor: theme.colors.border }]}
            />
            {errors.NiveauExecution && <Text style={styles.errorText}>{errors.NiveauExecution}</Text>}
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Taux d'avancement physique*</Text>
            <TextInput
              placeholder="Taux d'avancement physique"
              keyboardType="numeric"
              value={formData.TauxAvancementPhysique}
              onChangeText={(text) => handleChange('TauxAvancementPhysique', text)}
              style={[styles.input, { borderColor: theme.colors.border }]}
            />
            {errors.TauxAvancementPhysique && <Text style={styles.errorText}>{errors.TauxAvancementPhysique}</Text>}
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Statut du projet*</Text>
            <View style={styles.chipContainer}>
              <Chip
                selected={formData.StatutProjet === 'TERMINER'}
                onPress={() => handleStatusSelect('TERMINER')}
                style={[
                  styles.chip,
                  formData.StatutProjet === 'TERMINER' && { backgroundColor: theme.colors.primary }
                ]}
                textStyle={[
                  styles.chipText,
                  formData.StatutProjet === 'TERMINER' && { color: 'white' }
                ]}
              >
                TERMINER
              </Chip>
              <Chip
                selected={formData.StatutProjet === 'EN COURS'}
                onPress={() => handleStatusSelect('EN COURS')}
                style={[
                  styles.chip,
                  formData.StatutProjet === 'EN COURS' && { backgroundColor: theme.colors.primary }
                ]}
                textStyle={[
                  styles.chipText,
                  formData.StatutProjet === 'EN COURS' && { color: 'white' }
                ]}
              >
                EN COURS
              </Chip>
            </View>
            {errors.StatutProjet && <Text style={styles.errorText}>{errors.StatutProjet}</Text>}
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Observations</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, height: 70 }]}
              placeholder="Observations"
              multiline={true}
              value={formData.Observations}
              onChangeText={(value) => handleChange('Observations', value)}
            />
          </View>
        </>
      )}

      {currentPosition === 1 && (
        <>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Contrainte</Text>
            <TextInput
              placeholder="Intitulé de contrainte"
              value={currentConstraint.IntituleConstrainte}
              onChangeText={(text) => setCurrentConstraint({ ...currentConstraint, IntituleConstrainte: text })}
              style={[styles.input, { borderColor: theme.colors.border }]}
            />
            {/* {errors.IntituleConstrainte && <Text style={styles.errorText}>{errors.IntituleConstrainte}</Text>} */}
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Mitigation</Text>
            <TextInput
              style={styles.input}
              value={currentConstraint.Mitigation}
              onChangeText={(text) =>
                setCurrentConstraint({ ...currentConstraint, Mitigation: text })
              }
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Délai</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerButton}
            >
              <Text style={styles.dateText}>
                {currentConstraint.Delai || 'Sélectionner la date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={datePickerDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
                  setCurrentConstraint({ ...currentConstraint, Delai: formattedDate });
                  setShowDatePicker(false);
                }}
              />
            )}
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Type de contrainte</Text>
            <View style={styles.chipContainer}>
              <Chip
                selected={currentConstraint.TypeConstrainte === 'ADMIN'}
                onPress={() => handleConstraintTypeSelect('ADMIN')}
                style={[
                  styles.chip,
                  currentConstraint.TypeConstrainte === 'ADMIN' && { backgroundColor: theme.colors.primary }
                ]}
                textStyle={[
                  styles.chipText,
                  currentConstraint.TypeConstrainte === 'ADMIN' && { color: 'white' }
                ]}
              >
                ADMIN
              </Chip>
              <Chip
                selected={currentConstraint.TypeConstrainte === 'TECH'}
                onPress={() => handleConstraintTypeSelect('TECH')}
                style={[
                  styles.chip,
                  currentConstraint.TypeConstrainte === 'TECH' && { backgroundColor: theme.colors.primary }
                ]}
                textStyle={[
                  styles.chipText,
                  currentConstraint.TypeConstrainte === 'TECH' && { color: 'white' }
                ]}
              >
                TECH
              </Chip>
            </View>
            {/* {errors.TypeConstrainte && <Text style={styles.errorText}>{errors.TypeConstrainte}</Text>} */}
          </View>
          <View style={styles.formGroup}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Button
                title="Ajouter Constrainte"
                color={theme.colors.primary}
                disabled={!currentConstraint.IntituleConstrainte || !currentConstraint.TypeConstrainte}
                onPress={() => {
                  if (validateStep()) {
                    setFormData((prevData) => ({
                      ...prevData,
                      contraintes: [...prevData.contraintes, currentConstraint]
                    }));
                    setCurrentConstraint({ IntituleConstrainte: '', TypeConstrainte: '' });
                  }
                }}
              />
              <MaterialIcons size={32} name="add" style={[styles.closeModal, { color: theme.colors.primary }]} />
            </View>
          </View>
          <View style={styles.constraintList}>
            {formData.contraintes.map((constraint, index) => (
              <View key={index} style={styles.constraintItem}>
                <Text style={styles.constraintText}>
                  {constraint.IntituleConstrainte} - {constraint.TypeConstrainte} - {constraint.Delai} - {constraint.Mitigation}
                </Text>
                <TouchableOpacity onPress={() => handleDeleteConstraint(index)}>
                  {/* <Icon name="delete" size={24} color={theme.colors.error} /> */}
                  <MaterialIcons size={24} name="delete" color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </>
      )}

      {currentPosition === 2 && (
        <>
          <View style={styles.formGroup}>
            {/* <Picker
        selectedValue={selectedBailleur}
        onValueChange={(itemValue, itemIndex) => setSelectedBailleur(itemValue)}
      >
        {bailleurs.map((bailleur) => (
          <Picker.Item
            key={bailleur.id}
            label={bailleur.NomBailleur}
            value={bailleur.CodeBailleur}
          />
        ))}
      </Picker> */}
            <TouchableOpacity style={styles.touc} onPress={openModal} hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Bailleur</Text>

              <TextInput
                style={styles.input}
                value={bailleurs.find(bailleur => bailleur.CodeBailleur === currentFunder.CodeBailleur)?.CodeBailleur || ''}
                editable={false}
                placeholder="Sélectionner un bailleur"
              />
            </TouchableOpacity>
            {errors.CodeBailleur && <Text style={styles.errorText}>{errors.CodeBailleur}</Text>}
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Montant décaissé</Text>
            <TextInput
              placeholder="Montant décaissé"
              value={currentFunder.MontantDecaisser}
              keyboardType="numeric"
              onChangeText={(text) => setCurrentFunder({ ...currentFunder, MontantDecaisser: text })}
              style={[styles.input, { borderColor: theme.colors.border }]}
            />
            {errors.MontantDecaisser && <Text style={styles.errorText}>{errors.MontantDecaisser}</Text>}
          </View>
          <View style={styles.formGroup}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Button
                title="Ajouter Bailleur"
                color={theme.colors.primary}
                disabled={!currentFunder.CodeBailleur || !currentFunder.MontantDecaisser}
                onPress={() => {
                  if (validateStep()) {
                    setFormData((prevData) => ({
                      ...prevData,
                      bailleurs: [...prevData.bailleurs, currentFunder]
                    }));
                    setCurrentFunder({ CodeBailleur: '', MontantDecaisser: '' });
                  }
                }}
              />
              <MaterialIcons size={32} name="add" style={[styles.closeModal, { color: theme.colors.primary }]} />
            </View>
          </View>
          <View style={styles.constraintList}>
            {formData.bailleurs.map((funder, index) => (
              <View key={index} style={styles.constraintItem}>
                <Text style={styles.constraintText}>
                  {funder.CodeBailleur} : {funder.MontantDecaisser} GNF
                </Text>
                <TouchableOpacity onPress={() => handleDeleteFunder(index)}>
                  {/* <Icon name="delete" size={24} color={theme.colors.error} /> */}
                  <MaterialIcons size={24} name="delete" color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </>
      )}

      {/* <View style={styles.buttonContainer}>
        <Button title="Précédent" onPress={handleBack} disabled={currentPosition === 0} />
        <Button title={currentPosition === 2 ? 'Envoyer' : 'Suivant'} onPress={handleNext} />
      </View> */}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleBack} disabled={currentPosition === 0} style={[styles.button, { opacity: currentPosition === 0 ? 0.5 : 1 }]}>
          <Icon name="chevron-left" size={36} style={[styles.button, { color: theme.colors.primary }]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}
        style={[styles.button, { backgroundColor: theme.colors.card }]}
      >
        <Icon
          name={isEditingMode ? (currentPosition === 2 ? "paper-plane" : "pencil") : (currentPosition === 2 ? "paper-plane" : "chevron-right")}
          size={36}
          style={[styles.button, { color: theme.colors.primary }]}
        />
      </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalView}>
          <TextInput
            placeholder="Rechercher un bailleur"
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
          <FlatList
            data={filteredBailleurs}
            keyExtractor={item => item.CodeBailleur}
            renderItem={renderFunderItem}
            style={styles.modalList}
          />
          <Button title="Fermer" onPress={closeModal} />
        </View>
      </Modal>

    </KeyboardAwareScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeModal: {
    padding: 10,
  },
  formGroup: {
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusChip: {
    padding: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeChip: {
    padding: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  constraintList: {
    marginTop: 16,
  },
  constraintItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  editText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  funderList: {
    marginTop: 16,
  },
  funderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
  },
  chip: {
    margin: 5,
  },
  chipText: {
    color: '#000',
  },
  constraintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 5,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 20,
  },
  modalItemText: {
    padding: 10,
    fontSize: 18,
    color: 'white',
  },
  touc: {
    // borderWidth: 1,
    // borderRadius: 8, // Coins arrondis
    // padding: 10, // Espace interne
    // alignItems: 'center', // Centre le texte
    // justifyContent: 'center', // Centre le texte verticalement
    // marginBottom: 10, // Espacement en bas
    // elevation: 2, // Ombre pour Android
    // shadowColor: '#000', // Couleur de l'ombre pour iOS
    // shadowOffset: { width: 0, height: 2 }, // Décalage de l'ombre pour iOS
    // shadowOpacity: 0.1, // Opacité de l'ombre pour iOS
    // shadowRadius: 2, // Rayon de l'ombre pour iOS
  },
  searchInput: {
    width: '100%',
    padding: 10,
    borderColor: '#ddd',
    color: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 30
  },
  datePickerContainer: {
    marginVertical: 10,
  },
  datePickerButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 16,
  },
});

export default AddSuiviForm;
