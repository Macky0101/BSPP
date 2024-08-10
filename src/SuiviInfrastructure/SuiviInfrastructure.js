import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  ProgressBar,
  ActivityIndicator,
  FAB,
  IconButton,
} from 'react-native-paper';
import { Video } from 'expo-video';
import AuthService from '../../services/infrastructure';
import { useTheme } from '../SettingsPage/themeContext';
import SuiviForm from './SuiviForm';

const SuiviInfrastructure = ({ route }) => {
  const { id } = route.params;
  const { theme } = useTheme();
  const [infrastructure, setInfrastructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSuivi, setSelectedSuivi] = useState(null);
  const [fullscreenMedia, setFullscreenMedia] = useState(null);
  const [suivis, setSuivis] = useState([]);

  const updateSuivisList = (newSuivi) => {
    setSuivis(prevSuivis => [newSuivi, ...prevSuivis]);
  };
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await AuthService.detailSuiviInfrastructures(id);
        console.log('API Response:', response);
        if (response && Object.keys(response).length) {
          setInfrastructure(response);
        } else {
          console.log('API did not return expected data:', response);
        }
      } catch (error) {
        console.error('Error loading details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const showModal = (suivi = null) => {
    setSelectedSuivi(suivi);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setSelectedSuivi(null);
    updateSuivisList(selectedSuivi);
  };

  const openFullscreenMedia = (mediaUri) => {
    if (mediaUri) {
      setFullscreenMedia(mediaUri);
    }
  };

  const closeFullscreenMedia = () => {
    setFullscreenMedia(null);
  };

  if (loading) {
    return <ActivityIndicator size="large" color={theme.primary} />;
  }

  if (!infrastructure) {
    return (
      <Text style={{ justifyContent: 'center', alignContent: 'center', color: theme.text }}>
        Aucun donné disponible
      </Text>
    );
  }

  const renderImages = (photos) => {
    const imageUris = photos.split('|');
    if (imageUris.length === 1) {
      return (
        <TouchableOpacity onPress={() => openFullscreenMedia(imageUris[0])}>
          <Image source={{ uri: imageUris[0] }} style={styles.fullImage} />
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.gridContainer}>
          {imageUris.map((photoUri, idx) => (
            <TouchableOpacity key={idx} onPress={() => openFullscreenMedia(photoUri)}>
              <Image source={{ uri: photoUri }} style={styles.gridImage} />
            </TouchableOpacity>
          ))}
        </View>
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.textBold, { color: theme.colors.text }]}>
            {infrastructure.NomInfrastructure}
          </Text>
          <Text style={{ color: theme.colors.text }}>{`Project: ${infrastructure.projet.NomProjet}`}</Text>
          {infrastructure.suivis &&
            infrastructure.suivis.map((suivi, index) => (
              <View key={index} style={[styles.detailCard, { backgroundColor: theme.colors.card }]}>
                {/* Handle multiple images */}
                {suivi.Photos && renderImages(suivi.Photos)}
                {suivi.videos && (
                  <TouchableOpacity onPress={() => openFullscreenMedia(suivi.videos)}>
                    <Video
                      source={{ uri: suivi.videos }}
                      style={styles.video}
                      resizeMode="contain"
                      useNativeControls
                    />
                  </TouchableOpacity>
                )}
                <ProgressBar
                  progress={parseFloat(suivi.TauxAvancementTechnique) / 100}
                  color={theme.primary}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text
                      style={{ color: theme.colors.text }}
                    >{`Avancement Technique: ${suivi.TauxAvancementTechnique}%`}</Text>
                    <Text
                      style={{ color: theme.colors.text }}
                    >{`Montant Décaisser: ${suivi.MontantDecaisser}`}</Text>
                    <Text style={{ color: theme.colors.text }}>{`Difficulté: ${suivi.Difficultes}`}</Text>
                  </View>
                  <View style={{ paddingTop: 10 }}>
                    <IconButton
                      icon="pencil"
                      size={24}
                      color={theme.colors.primary}
                      onPress={() => showModal(suivi)}
                      style={[styles.editer, { backgroundColor: theme.colors.primary }]}
                    />
                  </View>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => showModal()}
      />
      <Modal visible={modalVisible} onRequestClose={hideModal}>
        <View style={styles.modalContainer}>
          <Text style={{ fontSize: 20, fontWeight: '500', paddingBottom: 10 }}>
            Ajouter un suivi
          </Text>
          <IconButton
            icon="close"
            size={30}
            color={theme.colors.text}
            onPress={hideModal}
            style={styles.closeButton}
          />
          <SuiviForm
            codeInfrastructure={infrastructure.CodeInfrastructure}
            closeModal={hideModal}
            existingSuivi={selectedSuivi}
            onSuiviAdded={updateSuivisList}
          />
        </View>
      </Modal>
      {/* Fullscreen Media Modal */}
      <Modal visible={!!fullscreenMedia} transparent={true} onRequestClose={closeFullscreenMedia}>
        <View style={styles.fullscreenContainer}>
          <TouchableOpacity onPress={closeFullscreenMedia} style={styles.fullscreenCloseButton}>
            <Text style={styles.fullscreenCloseText}>fermer</Text>
          </TouchableOpacity>
          {fullscreenMedia && fullscreenMedia.endsWith('.mp4') ? (
            <Video
              source={{ uri: fullscreenMedia }}
              style={styles.fullscreenImage}
              resizeMode="contain"
              useNativeControls
            />
          ) : (
            <Image source={{ uri: fullscreenMedia }} style={styles.fullscreenImage} />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  detailCard: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  fullImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridImage: {
    width: Dimensions.get('window').width / 2 - 20, // Two images per row
    height: 150,
    marginBottom: 10,
    borderRadius: 5,
  },
  video: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Assurez-vous que le bouton est au-dessus des autres éléments
  },
  textBold: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fullscreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  fullscreenCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 10,
    zIndex: 1, // Ensure the button is above the image
  },
  fullscreenCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SuiviInfrastructure;
