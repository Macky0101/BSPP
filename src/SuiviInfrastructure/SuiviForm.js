import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import InfrastructureService from '../../services/infrastructure';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Audio, Video } from 'expo-av';

const SuiviForm = ({ codeInfrastructure, closeModal, existingSuivi, onSuiviAdded }) => {
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
  const [images, setImages] = useState(existingSuivi ? existingSuivi.images || [] : []);
const [videos, setVideos] = useState(existingSuivi ? existingSuivi.videos || [] : []);

  // const [images, setImages] = useState([]);
  // const [videos, setVideos] = useState([]);
  const [errors, setErrors] = useState({});

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

      console.log('Media Selected:', media); // Ajouter un log pour voir les informations du média

      if (mediaType === 'image') {
        setImages((prev) => [...prev, media]);
      } else {
        setVideos((prev) => [...prev, media]);
      }
    } else {
      console.log('No media selected or cancelled by user.'); // Pour comprendre si aucun média n'a été sélectionné
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
    console.log('Détails du Suivi:', suiviDetails);
    console.log('Images:', images);
    console.log('Vidéos:', videos);
    try {
      let response;
      if (suiviDetails.id) {
        // Update existing suivi
        response = await InfrastructureService.updateSuiviInfrastructure(
          suiviDetails, // Pass entire suiviDetails including id
          images,
          videos
        );
      } else {
        // Create new suivi
        response = await InfrastructureService.postSuiviInfrastructure(
          suiviDetails,
          images,
          videos
        );
      }

      if (response) {
        console.log('Réponse de l\'API:', response);
        closeModal();
        Alert.alert(
          'Succès',
          suiviDetails.id
            ? 'Suivi mis à jour avec succès'
            : 'Suivi ajouté avec succès'
        );
      }
      if (onSuiviAdded) {
        onSuiviAdded(response);
      }
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
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date de Suivi</Text>
        <TouchableOpacity onPress={handleDatePickerOpen}>
          <TextInput
            style={[styles.input, errors.DateSuivi && styles.inputError]}
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
        <Text style={styles.label}>Niveau d'Avancement</Text>
        <TextInput
          style={[styles.input, errors.NiveauAvancement && styles.inputError]}
          value={suiviDetails.NiveauAvancement}
          onChangeText={(text) => handleInputChange('NiveauAvancement', text)}
          keyboardType="numeric"
        />
        {errors.NiveauAvancement && (
          <Text style={styles.error}>{errors.NiveauAvancement}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Montant Décaissé</Text>
        <TextInput
          style={[styles.input, errors.MontantDecaisser && styles.inputError]}
          value={suiviDetails.MontantDecaisser}
          onChangeText={(text) => handleInputChange('MontantDecaisser', text)}
          keyboardType="numeric"
        />
        {errors.MontantDecaisser && (
          <Text style={styles.error}>{errors.MontantDecaisser}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Taux d'Avancement Technique</Text>
        <TextInput
          style={[
            styles.input,
            errors.TauxAvancementTechnique && styles.inputError,
          ]}
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
        <Text style={styles.label}>Difficultés</Text>
        <TextInput
          style={styles.input}
          value={suiviDetails.Difficultes}
          onChangeText={(text) => handleInputChange('Difficultes', text)}
          multiline
        />
      </View>
      <Text style={styles.label}>Images</Text>
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
    backgroundColor: '#fff',
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
    borderColor: '#ccc',
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
  }

});

export default SuiviForm;
