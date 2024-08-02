import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity, Platform } from 'react-native';
import SuiviProjetService from '../../services/projetsServices';
import { useTheme } from '../SettingsPage/themeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import { Chip } from 'react-native-paper';

const AddSuiviForm =  ({ onSuccess, onClose })  => {
    const { theme } = useTheme();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formData, setFormData] = useState({
        DateSuivi: '',
        NiveauExecution: '',
        TauxAvancementPhysique: '',
        StatutProjet: '',
        Observations: '',
        IntituleConstrainte: '',
        TypeConstrainte: '',
        MontantDecaisser: ''
    });
    const [datePickerDate, setDatePickerDate] = useState(new Date()); 

    const [errors, setErrors] = useState({});
    const [modalVisible, setModalVisible] = useState(true); // Ajout de modalVisible

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.DateSuivi) newErrors.DateSuivi = 'La date de suivi est obligatoire';
        if (!formData.NiveauExecution) newErrors.NiveauExecution = 'Le niveau d\'exécution est obligatoire';
        if (!formData.TauxAvancementPhysique) newErrors.TauxAvancementPhysique = 'Le taux d\'avancement physique est obligatoire';
        if (!formData.StatutProjet) newErrors.StatutProjet = 'Le statut du projet est obligatoire';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            await SuiviProjetService.AddSuiviProjet(formData);
            Alert.alert('Succès', 'Suivi projet ajouté avec succès');
            if (onSuccess) onSuccess();
        } catch (error) {
            Alert.alert('Erreur', 'Échec de l\'ajout du suivi projet');
            console.error('Erreur lors de l\'ajout du suivi projet', error);
        }
    };

    // const onDateChange = (event, selectedDate) => {
    //     const currentDate = selectedDate || new Date();
    //     setShowDatePicker(Platform.OS === 'ios');
    //     setFormData({
    //         ...formData,
    //         DateSuivi: currentDate.toISOString().split('T')[0] // Format YYYY-MM-DD
    //     });
    // };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || datePickerDate;
        setShowDatePicker(Platform.OS === 'ios');
        setFormData({
            ...formData,
          DateSuivi: currentDate.toISOString().split('T')[0]
        });
        setDatePickerDate(currentDate); // Mettre à jour l'état datePickerDate
      };
    
      const handleDatePickerOpen = () => {
        const initialDate = formData.DateSuivi ? new Date(formData.DateSuivi) : new Date();
        setDatePickerDate(initialDate); // Définir la date initiale du sélecteur
        setShowDatePicker(true);
      };






    const handleStatusSelect = (status) => {
        setFormData({ ...formData, StatutProjet: status });
    };

    const handleConstraintTypeSelect = (type) => {
        setFormData({ ...formData, TypeConstrainte: type });
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={[
                styles.container,
                { backgroundColor: theme.colors.background, paddingBottom: 20 }
            ]}
            enableOnAndroid={true}
            extraScrollHeight={20} // Augmente la marge entre le clavier et le contenu
        >
            <View style={styles.header}>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Ajouter Suivi Projet</Text>
                <MaterialIcons size={32} name="close" onPress={onClose} style={[styles.closeModal, { color: theme.colors.primary }]} />
            </View>

            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Date de suivi</Text>
                <TouchableOpacity 
                onPress={handleDatePickerOpen}>
                    <TextInput
                        placeholder="Date Suivi"
                        value={formData.DateSuivi}
                        editable={false}
                        style={[styles.input, { borderColor: theme.colors.border }]}
                    />
                    {errors.DateSuivi && <Text style={styles.errorText}>{errors.DateSuivi}</Text>}
                    {showDatePicker && (
                        <DateTimePicker
                            value={datePickerDate}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Niveau d'exécution</Text>
                <TextInput
                    style={[styles.input, { borderColor: theme.colors.border }]}
                    placeholder="0-100"
                    keyboardType="numeric"
                    value={formData.NiveauExecution}
                    onChangeText={(value) => handleChange('NiveauExecution', value)}
                />
                {errors.NiveauExecution && <Text style={styles.errorText}>{errors.NiveauExecution}</Text>}
            </View>
            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Taux d'avancement physique</Text>
                <TextInput
                    style={[styles.input, { borderColor: theme.colors.border }]}
                    placeholder="0-100"
                    keyboardType="numeric"
                    value={formData.TauxAvancementPhysique}
                    onChangeText={(value) => handleChange('TauxAvancementPhysique', value)}
                />
                {errors.TauxAvancementPhysique && <Text style={styles.errorText}>{errors.TauxAvancementPhysique}</Text>}
            </View>
            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Statut du projet</Text>
                <View style={styles.chipContainer}>
                    {/* <Chip
                        icon="alert-circle"
                        selected={formData.StatutProjet === 'DANGER'}
                        selectedColor="red"
                        onPress={() => handleStatusSelect('DANGER')}
                    >
                        Danger
                    </Chip> */}
                    <Chip
                        icon="progress-check"
                        selected={formData.StatutProjet === 'EN COURS'}
                        selectedColor="orange"
                        onPress={() => handleStatusSelect('EN COURS')}
                    >
                        En cours
                    </Chip>
                    <Chip
                        icon="check-circle"
                        selected={formData.StatutProjet === 'TERMINER'}
                        selectedColor="green"
                        onPress={() => handleStatusSelect('TERMINER')}
                    >
                        Terminé
                    </Chip>
                </View>
                {errors.StatutProjet && <Text style={styles.errorText}>{errors.StatutProjet}</Text>}
            </View>
            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Observations</Text>
                <TextInput
                    style={[styles.input, { borderColor: theme.colors.border }]}
                    placeholder="Observations"
                    value={formData.Observations}
                    onChangeText={(value) => handleChange('Observations', value)}
                />
            </View>
            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Intitulé de contrainte</Text>
                <TextInput
                    style={[styles.input, { borderColor: theme.colors.border }]}
                    placeholder="Intitulé de contrainte"
                    value={formData.IntituleConstrainte}
                    onChangeText={(value) => handleChange('IntituleConstrainte', value)}
                />
            </View>
            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Type de contrainte</Text>
                <View style={styles.chipContainer}>
                    <Chip
                        icon="account"
                        selected={formData.TypeConstrainte === 'ADMIN'}
                        selectedColor="blue"
                        onPress={() => handleConstraintTypeSelect('ADMIN')}
                    >
                        Admin
                    </Chip>
                    <Chip
                        icon="wrench"
                        selected={formData.TypeConstrainte === 'TECH'}
                        selectedColor="gray"
                        onPress={() => handleConstraintTypeSelect('TECH')}
                    >
                        Tech
                    </Chip>
                </View>
                {errors.TypeConstrainte && <Text style={styles.errorText}>{errors.TypeConstrainte}</Text>}
            </View>
            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Montant décaissé</Text>
                <TextInput
                    style={[styles.input, { borderColor: theme.colors.border }]}
                    placeholder="Montant décaissé"
                    keyboardType="numeric"
                    value={formData.MontantDecaisser}
                    onChangeText={(value) => handleChange('MontantDecaisser', value)}
                />
            </View>
            <Button title="Ajouter Suivi Projet" onPress={handleSubmit} color={theme.colors.primary} />
            {/* <Button title="Annuler" onPress={onClose} color={theme.colors.accent} /> */}
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 100, // Ajout d'espace supplémentaire en bas
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 10,
        minHeight: 60, // Assurez-vous que chaque groupe de formulaire a suffisamment d'espace
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        marginBottom: 10,
        minHeight: 40, // Hauteur minimale pour les champs d'entrée
    },
    errorText: {
        color: 'red',
        marginTop: -10,
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeModal: {
        padding: 10,
    },
    chipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
});

export default AddSuiviForm;