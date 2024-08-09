import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  ProgressBar,
  ActivityIndicator,
  FAB,
  IconButton,
} from 'react-native-paper';
import AuthService from '../../services/infrastructure';
import { useTheme } from '../SettingsPage/themeContext';
import SuiviForm from './SuiviForm';

const SuiviInfrastructure = ({ route }) => {
  const { id } = route.params;
  const { theme } = useTheme();
  const [infrastructure, setInfrastructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSuivi, setSelectedSuivi] = useState(null); // New state to track selected suivi

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await AuthService.detailSuiviInfrastructures(id);
        console.log('API Response:', response); // Log the raw API response
        if (response && Object.keys(response).length) {
          setInfrastructure(response); // Adjust here based on actual response structure
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
  };

  if (loading) {
    return <ActivityIndicator size="large" color={theme.primary} />;
  }

  if (!infrastructure) {
    return (
      <Text style={{ justifyContent: 'center', alignContent: 'center' }}>
        Aucun donné disponible
      </Text>
    ); // Changed the message for clarity
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.card}>
          <Text style={[styles.textBold, { color: theme.text }]}>
            {infrastructure.NomInfrastructure}
          </Text>
          <Text style={{ color: theme.text }}>{`Project: ${infrastructure.projet.NomProjet}`}</Text>
          {infrastructure.suivis &&
            infrastructure.suivis.map((suivi, index) => (
              <View key={index} style={styles.detailCard}>
                <Image source={{ uri: suivi.Photos }} style={styles.image} />
                {suivi.videos && (
                  <TouchableOpacity>
                    <Image
                      source={{ uri: suivi.videos }}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                )}
                <ProgressBar
                  progress={parseFloat(suivi.TauxAvancementTechnique) / 100}
                  color={theme.primary}
                />
                <Text
                  style={{ color: theme.text }}
                >{`Technical Progress: ${suivi.TauxAvancementTechnique}%`}</Text>
                <Text
                  style={{ color: theme.text }}
                >{`Amount Disbursed: ${suivi.MontantDecaisser}`}</Text>
                <Text style={{ color: theme.text }}>{`Difficulty: ${suivi.Difficultes}`}</Text>
                <TouchableOpacity onPress={() => showModal(suivi)}>
                  <Text style={{ color: theme.primary }}>Modifier</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </ScrollView>
      <FAB
        style={[styles.fab, { backgroundColor: theme.primary }]}
        small
        icon="plus"
        onPress={() => showModal()} // Open modal for adding new suivi
      />
      <Modal visible={modalVisible} onRequestClose={hideModal}>
        <View style={styles.modalContainer}>
          <IconButton
            icon="close"
            size={30}
            color={theme.text}
            onPress={hideModal}
            style={styles.closeButton}
          />
          <SuiviForm
            codeInfrastructure={infrastructure.CodeInfrastructure}
            closeModal={hideModal}
            existingSuivi={selectedSuivi} // Pass selectedSuivi to the form
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  detailCard: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#eef',
    borderRadius: 8,
  },
  mediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  textBold: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SuiviInfrastructure;
