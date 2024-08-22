import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import InfrastructureService from '../../services/infrastructure';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Audio, Video } from 'expo-av';
import { useTheme } from '../SettingsPage/themeContext';
import { Chip, Button } from 'react-native-paper';

const SuiviForm = ({ codeInfrastructure, closeModal, existingSuivi , onSuiviAdded}) => {


  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  const [datePickerDate, setDatePickerDate] = useState(
    existingSuivi ? new Date(existingSuivi.DateSuivi) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [suiviDetails, setSuiviDetails] = useState({
    id: existingSuivi ? existingSuivi.id : null, // null pour un nouveau suivi, non-null pour une modification
    DateSuivi: existingSuivi ? existingSuivi.DateSuivi : '',
    CodeInfrastructure: codeInfrastructure,
    NiveauAvancement: existingSuivi ? existingSuivi.NiveauAvancement : '',
    MontantDecaisser: existingSuivi ? existingSuivi.MontantDecaisser : '',
    TauxAvancementTechnique: existingSuivi
      ? existingSuivi.TauxAvancementTechnique
      : '',
    Difficultes: existingSuivi ? existingSuivi.Difficultes : '',
  });

  const [selectedTrimestres, setSelectedTrimestres] = useState(existingSuivi ? existingSuivi.Trimestre || [] : []);
  const [showTrimestreModal, setShowTrimestreModal] = useState(false);

  const [images, setImages] = useState(existingSuivi ? existingSuivi.images || [] : []);
  const [videos, setVideos] = useState(existingSuivi ? existingSuivi.videos || [] : []);

  const [errors, setErrors] = useState({});

  const handleTrimestreSelection = (trimestre) => {
    setSelectedTrimestres((prev) => {
      if (!Array.isArray(prev)) return [trimestre]; // S'assurer que prev est un tableau
      if (prev.includes(trimestre)) {
        return prev.filter((item) => item !== trimestre);
      } else {
        return [...prev, trimestre];
      }
    });
  };






  const handleInputChange = (name, value) => {
    setSuiviDetails({ ...suiviDetails, [name]: value });
  };

  const handleMediaSelect = async (mediaType) => {
    let result;

    if (mediaType === 'image') {
      if (images.length >= 3) {
        Alert.alert('Limite atteinte', 'Vous ne pouvez ajouter que trois images.');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const media = {
        uri: result.assets[0].uri,
        type: result.assets[0].type || 'unknown', // Utilisation d'une valeur par défaut si type n'est pas défini
        name: result.assets[0].fileName || `file_${Date.now()}`, // Utilisation d'un nom de fichier par défaut
      };

      // console.log('Media Selected:', media); // Ajouter un log pour voir les informations du média

      if (mediaType === 'image') {
        setImages((prev) => [...prev, media]);
      } else {
        setVideos((prev) => [...prev, media]);
      }
    } else {
      // console.log('No media selected or cancelled by user.'); // Pour comprendre si aucun média n'a été sélectionné
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || datePickerDate;
    setShowDatePicker(false); // Ferme le sélecteur de date après la sélection
    setSuiviDetails({
      ...suiviDetails,
      DateSuivi: currentDate.toISOString().split('T')[0],
    });
    setDatePickerDate(currentDate); // Met à jour l'état datePickerDate
  };

  const handleDatePickerOpen = () => {
    const initialDate = suiviDetails.DateSuivi
      ? new Date(suiviDetails.DateSuivi)
      : new Date();
    setDatePickerDate(initialDate);
    setShowDatePicker(true);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!suiviDetails.DateSuivi)
      newErrors.DateSuivi = 'La date de suivi est obligatoire';
    if (!suiviDetails.NiveauAvancement)
      newErrors.NiveauAvancement = 'Niveau Avancement est obligatoire';
    if (selectedTrimestres.length === 0)
      newErrors.Trimestre = 'Le trimestre est obligatoire';
    if (!suiviDetails.MontantDecaisser)
      newErrors.MontantDecaisser = 'Montant Decaisser est obligatoire';
    if (!suiviDetails.TauxAvancementTechnique)
      newErrors.TauxAvancementTechnique =
        'Taux Avancement Technique est obligatoire';
    if (images.length === 0) {
      newErrors.images = 'Au moins une image est requise';
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


 

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {

      const suiviData = {
        ...suiviDetails,
        Trimestre: selectedTrimestres,
      };
      console.log(suiviData);

      let response;
      if (suiviDetails.id) {
        // Update existing suivi
        response = await InfrastructureService.updateSuiviInfrastructure(
          suiviData,
          images,
          videos
        );
      } else {
        // Create new suivi
        response = await InfrastructureService.postSuiviInfrastructure(
          suiviData,
          images,
          videos
        );
      }
      if (response) {
        closeModal();
        Alert.alert(
          'Succès',
          suiviDetails.id
            ? 'Suivi mis à jour avec succès'
            : 'Suivi ajouté avec succès'
        );
      }
      onSuiviAdded();
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données :', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de l\'envoi des données'
      );
    } finally {
      setLoading(false); // Arrêter l'indicateur de chargement
    }
  };


  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Date de Suivi*</Text>
        <TouchableOpacity onPress={handleDatePickerOpen}>
          <TextInput
            style={[styles.input, errors.DateSuivi && styles.inputError, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={suiviDetails.DateSuivi}
            placeholder="YYYY-MM-DD"
            editable={false}
            pointerEvents="none" // Permet d'éviter l'édition manuelle
          />
        </TouchableOpacity>
        {errors.DateSuivi && (
          <Text style={styles.error}>{errors.DateSuivi}</Text>
        )}
        {showDatePicker && (
          <DateTimePicker
            value={datePickerDate} // Utilisez l'état datePickerDate
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Niveau d'Avancement*</Text>
        <TextInput
          style={[styles.input, errors.NiveauAvancement && styles.inputError, { borderColor: theme.colors.border, color: theme.colors.text }]}
          value={suiviDetails.NiveauAvancement}
          onChangeText={(text) => handleInputChange('NiveauAvancement', text)}
        />
        {errors.NiveauAvancement && (
          <Text style={styles.error}>{errors.NiveauAvancement}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Montant Décaissé*</Text>
        <TextInput
          style={[styles.input, errors.MontantDecaisser && styles.inputError, { borderColor: theme.colors.border, color: theme.colors.text }]}
          value={suiviDetails.MontantDecaisser}
          onChangeText={(text) => handleInputChange('MontantDecaisser', text)}
          keyboardType="numeric"
        />
        {errors.MontantDecaisser && (
          <Text style={styles.error}>{errors.MontantDecaisser}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Taux d'Avancement Technique*</Text>
        <TextInput
          style={[styles.input, errors.TauxAvancementTechnique && styles.inputError, { borderColor: theme.colors.border, color: theme.colors.text }]}
          value={suiviDetails.TauxAvancementTechnique}
          onChangeText={(text) =>
            handleInputChange('TauxAvancementTechnique', text)
          }
          keyboardType="numeric"
        />
        {errors.TauxAvancementTechnique && (
          <Text style={styles.error}>{errors.TauxAvancementTechnique}</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
  <Text style={[styles.label, { color: theme.colors.text }]}>Trimestre*</Text>
  <View style={styles.chipContainer}>
    {['T1', 'T2', 'T3', 'T4'].map((trimestre) => (
      <Chip
        key={trimestre} // Utilisation de 'key' à la place de 'forKey'
        mode="outlined"
        selected={selectedTrimestres.includes(trimestre)}
        onPress={() => handleTrimestreSelection(trimestre)}
        style={[
          styles.chip,
          selectedTrimestres.includes(trimestre)
            ? { backgroundColor: theme.colors.primary }
            : { backgroundColor: theme.colors.surface },
        ]}
      >
        {trimestre}
      </Chip>
    ))}
  </View>
  {errors.Trimestre && <Text style={styles.error}>{errors.Trimestre}</Text>}
</View>


      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Difficultés</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
          value={suiviDetails.Difficultes}
          onChangeText={(text) => handleInputChange('Difficultes', text)}
          multiline
        />
      </View>
      <Text style={[styles.label, { color: theme.colors.text }]}>Images*</Text>
      {errors.images && (
        <Text style={styles.error}>{errors.images}</Text>
      )}
      <View style={styles.mediaButtonContainer}>
        <Button
          icon="camera"
          mode="outlined"
          onPress={() => handleMediaSelect('image')}
        >
          Ajouter une Image
        </Button>
        <Button
          icon="video"
          mode="outlined"
          onPress={() => handleMediaSelect('video')}
        >
          Ajouter une Vidéo
        </Button>
      </View>
      <View style={styles.mediaPreviewContainer}>
        {images.map((image, index) => (
          <View key={index} style={styles.mediaThumbnailContainer}>
            <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeIcon}>
              <Icon name="cancel" size={24} color="#fff" />
            </TouchableOpacity>
            <Image source={{ uri: image.uri }} style={styles.mediaThumbnail} />
          </View>
        ))}
        {videos.map((video, index) => (
          <View key={index} style={styles.mediaThumbnailContainer}>
            <TouchableOpacity onPress={() => removeVideo(index)} style={styles.removeIcon}>
              <Icon name="cancel" size={24} color="#fff" />
            </TouchableOpacity>
            <Video
              source={{ uri: video.uri }}
              style={styles.mediaThumbnail}
              useNativeControls
              resizeMode="cover"
            />
          </View>
        ))}

      </View>
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
      >
        {loading ? 'Chargement...' : (suiviDetails.id ? 'Mettre à jour le Suivi' : 'Ajouter le Suivi')}
      </Button>


    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    height: 40,
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    color: 'red',
    marginTop: 4,
  },
  mediaButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  mediaPreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mediaThumbnail: {
    width: 80,
    height: 80,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    color: '#000',
    fontWeight: 'bold',
  },
  removeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    zIndex: 1,
    borderRadius: 12,
    padding: 6,
    elevation: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chip: {
    margin: 4,
  },

});

export default SuiviForm;
