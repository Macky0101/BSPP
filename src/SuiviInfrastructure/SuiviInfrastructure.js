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
  Alert
} from 'react-native';
import {
  ProgressBar,
  ActivityIndicator,
  FAB,
  IconButton,
} from 'react-native-paper';
import { Video } from 'expo-av';
import AuthService from '../../services/infrastructure';
import { useTheme } from '../SettingsPage/themeContext';
import SuiviForm from './SuiviForm';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonCard from './../suiviProjet/SkeletonCard';

const SuiviInfrastructure = ({ route }) => {
  const { id } = route.params;
  const { theme } = useTheme();
  const [infrastructure, setInfrastructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSuivi, setSelectedSuivi] = useState(null);
  const [fullscreenMedia, setFullscreenMedia] = useState(null);
  const [suivis, setSuivis] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [expandedSuiviId, setExpandedSuiviId] = useState(null);
  const [textLimit, setTextLimit] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);

  const toggleExpand = (id) => {
    setExpandedSuiviId(expandedSuiviId === id ? null : id);
  };

  const refreshData = async () => {
    try {
      const response = await AuthService.detailSuiviInfrastructures(id);
      if (response && Object.keys(response).length) {
        setInfrastructure(response);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error);
    }
  };


  const renderDifficultes = (suivi) => {
    const isExpanded = expandedSuiviId === suivi.id;
    const maxLines = isExpanded ? 0 : 3; // Limitez les lignes quand non étendu
    const isTextLongEnough = suivi.Difficultes && suivi.Difficultes.length > 100; // Exemple de condition pour longueur minimale

    return (
      <>
        <Text
          style={{ color: theme.colors.text }}
          numberOfLines={maxLines}
        >
          {suivi.Difficultes}
        </Text>
        {isTextLongEnough && ( // Affiche "Voir plus" seulement si le texte est assez long
          <TouchableOpacity onPress={() => toggleExpand(suivi.id)}>
            <Text style={{ color: theme.colors.primary }}>
              {isExpanded ? 'Voir moins' : 'Voir plus'}
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  // Récupérer les données du stockage local
  const getLocalData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(`suivi_${id}`);
      if (savedData) {
        setInfrastructure(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données locales:', error);
    }
  };

  useEffect(() => {
    // Écoute les changements de connexion réseau
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Si connecté, récupère les données du serveur et mets à jour localement
      if (isConnected) {
        try {
          const response = await AuthService.detailSuiviInfrastructures(id);
          if (response && Object.keys(response).length) {
            setInfrastructure(response);
            // Sauvegarde des données localement
            await AsyncStorage.setItem(`suivi_${id}`, JSON.stringify(response));
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données du serveur:', error);
        }
      } else {
        // Si hors-ligne, récupère les données locales
        getLocalData();
      }
      setLoading(false);
    };

    fetchData();
  }, [isConnected, id]);




  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await AuthService.detailSuiviInfrastructures(id);
        // console.log('API Response:', response);
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
    refreshData(); 
  };

  const openFullscreenMedia = (mediaUri) => {
    if (mediaUri) {
      setFullscreenMedia(mediaUri);
    }
  };

  const closeFullscreenMedia = () => {
    setFullscreenMedia(null);
  };

  // if (loading) {
  //   return <ActivityIndicator size="large" color={theme.primary} />;
  // }
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
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
    const imageStyle = imageUris.length === 1 ? styles.fullImage : styles.gridImage;
  
    return (
      <View style={imageUris.length === 1 ? styles.fullImageWrapper : styles.gridContainer}>
        {imageUris.map((photoUri, idx) => (
          <View key={idx} style={imageUris.length === 1 ? styles.fullImageWrapper : styles.imageWrapper}>
            {imageLoading && <ActivityIndicator size="large" color={theme.colors.primary} />}
            {photoUri ? (
              <TouchableOpacity onPress={() => openFullscreenMedia(photoUri)}>
                <Image
                  source={{ uri: photoUri }}
                  style={imageStyle}
                  onLoad={() => setImageLoading(false)}
                  onLoadStart={() => setImageLoading(true)}
                />
              </TouchableOpacity>
            ) : (
              <Text style={{ color: theme.colors.text }}>Image non disponible</Text>
            )}
          </View>
        ))}
      </View>
    );
  };


  const handleLongPress = (suiviId) => {
    Alert.alert(
      "Confirmation de suppression",
      "Voulez-vous vraiment supprimer ce suivi ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: async () => {
            setIsDeleting(true); // Affiche le loader
            try {
              const response = await AuthService.deleteSuiviInfrastructure(suiviId);
              if (response) {
                // Supprime le suivi de l'état local
                setInfrastructure(prevInfrastructure => ({
                  ...prevInfrastructure,
                  suivis: prevInfrastructure.suivis.filter(suivi => suivi.id !== suiviId),
                }));
              } else {
                console.error("Échec de la suppression du suivi");
              }
            } catch (error) {
              console.error("Erreur lors de la suppression du suivi:", error);
            } finally {
              setIsDeleting(false); // Cache le loader
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };
  

  const handleSuiviAdded = (newSuivi) => {
    setSuivis((prevSuivis) => [...prevSuivis, newSuivi]);
};

  const formatMontant = (montant) => {
    if (!montant) return '0';
    return montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  const getTextColor = (value) => {
    if (value >= 0 && value <= 30) {
      return 'red';
    } else if (value > 30 && value <= 75) {
      return 'orange';
    } else if (value > 75) {
      return 'green';
    }
    return theme.colors.text; // Couleur par défaut
  };
  const getProgressBarColor = (value) => {
    if (value >= 0 && value <= 30) {
      return 'red';
    } else if (value > 30 && value <= 75) {
      return 'orange';
    } else if (value > 75) {
      return 'green';
    }
    return theme.colors.primary; // Couleur par défaut
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView >
        <View style={[styles.card,]}>
          <Text style={[styles.textBold, { color: theme.colors.text }]}>
            {infrastructure.NomInfrastructure}
          </Text>
          <Text style={{ color: theme.colors.text }}>{`Project: ${infrastructure.projet.NomProjet}`}</Text>

          {infrastructure.suivis &&
  infrastructure.suivis.map((suivi, index) => (
    <TouchableOpacity
      key={suivi.id}  // Ajout de la prop "key" unique ici
      onLongPress={() => handleLongPress(suivi.id)}
      style={styles.suiviContainer}
    >
      <View style={[styles.detailCard, { backgroundColor: theme.colors.card }]}>
        {/* Handle multiple images */}
        {suivi.Photos && renderImages(suivi.Photos)}
        {suivi.videos ? (
          <View style={styles.videoWrapper}>
            {videoLoading && <ActivityIndicator size="large" color={theme.colors.primary} />}
            <TouchableOpacity onPress={() => openFullscreenMedia(suivi.videos)}>
              <Video
                source={{ uri: suivi.videos }}
                style={styles.video}
                resizeMode="contain"
                useNativeControls
                isLooping={false}
                onLoad={() => setVideoLoading(false)}
                onLoadStart={() => setVideoLoading(true)}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={{ color: theme.colors.text }}></Text>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
          <View>
            <Text style={{color: theme.colors.text}}>Avancement Technique: </Text>
          </View>
          <View>
            <Text
              style={{ color: getTextColor(suivi.TauxAvancementTechnique), fontWeight: 'bold', fontSize: 16 }}
            >{suivi.TauxAvancementTechnique}%</Text>
          </View>
        </View>
        <ProgressBar
          progress={isNaN(parseFloat(suivi.TauxAvancementTechnique)) ? 0 : parseFloat(suivi.TauxAvancementTechnique) / 100}
          color={getProgressBarColor(parseFloat(suivi.TauxAvancementTechnique))}
          style={{ height: 10, borderRadius: 5 }}
        />
        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
            <View style={{ paddingTop: 5 }}>
              <Text style={[{ fontSize: 20 },{color: theme.colors.text}]}>Montant Décaisser:</Text>
            </View>
            <View style={{ paddingTop: 5, }}>
              <Text
                style={[{ color: theme.colors.text }, { fontSize: 20, fontWeight: '700' }]}
              >{formatMontant(suivi.MontantDecaisser)}<Text style={{ color: 'red', fontSize: 10 }}>GNF</Text></Text>
            </View>
          </View>
          <Text style={{color: theme.colors.text}}>Trimestre: {suivi.Trimestre}</Text>
          {renderDifficultes(suivi)}
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
    </TouchableOpacity>
  ))}

        </View>
      </ScrollView>
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => showModal()}
      />
      {isDeleting && (
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={styles.loadingIndicator}
          />
        </View>
      )}

      <Modal visible={modalVisible} onRequestClose={hideModal}>
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <Text style={[{ fontSize: 20, fontWeight: '500', paddingBottom: 10 }, { color: theme.colors.text }]}>
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
            onSuiviAdded={refreshData}
          />
        </View>
      </Modal>
      {/* Fullscreen Media Modal */}
      <Modal visible={!!fullscreenMedia} transparent={true} onRequestClose={closeFullscreenMedia}>
        <View style={[styles.fullscreenContainer, { backgroundColor: theme.colors.background }]}>
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
  imageWrapper: {
    position: 'relative',
  },
  videoWrapper: {
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  video: {
    width: '100%',
    height: 300,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
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
    // backgroundColor: 'rgba(0,0,0,0.8)',
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
