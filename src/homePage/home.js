import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Button, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, EvilIcons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../SettingsPage/themeContext';
import AuthService from '../../services/authServices';
import styles from './styles';
import moment from 'moment';
import { Appbar, Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Animated } from 'react-native';
// import * as Font from 'expo-font';
import CustomText from '../../NumberText';
import { ProgressBar, MD3Colors } from 'react-native-paper';

const HomePage = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [profile, setProfileImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [userName, setUserName] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [projetUser, setProjetUser] = useState(null);
  const [indicatorData, setIndicatorData] = useState(null);
  const [infrastructuresData, setinfrastructures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalDecaissement, setTotalDecaissement] = useState(0);
  const [decaissementRate, setDecaissementRate] = useState(0);
  const [dernierSuivi, setDernierSuivi] = useState(null);
  const [projectDuration, setProjectDuration] = useState('');
  const [daysRemaining, setDaysRemaining] = useState({ months: 0, days: 0 });
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const budgetOpacity = useRef(new Animated.Value(0)).current;
  const decaissementOpacity = useRef(new Animated.Value(0)).current;
  const budgetScale = useRef(new Animated.Value(0.8)).current; // Valeur de départ pour le zoom
  const decaissementScale = useRef(new Animated.Value(0.8)).current; // Valeur de départ pour le zoom

  useEffect(() => {
    Animated.sequence([
      Animated.timing(budgetOpacity, {
        toValue: 1,
        duration: 1500,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(decaissementOpacity, {
        toValue: 1,
        duration: 1500,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [totalBudget, totalDecaissement]);


  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission requise pour accéder à la galerie !');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setLoadingImage(true);
      const selectedImageUri = result.assets[0].uri;
      await AsyncStorage.setItem('profileImageUri', selectedImageUri);
      // Créer un formData pour envoyer l'image
      const formData = new FormData();
      formData.append('profile', {
        uri: selectedImageUri,
        name: 'profile.jpg', // Nom de fichier
        type: 'image/jpeg',  // Type de fichier
      });

      try {
        // Appeler la méthode updateUserProfileImage pour envoyer l'image à l'API
        const response = await AuthService.updateUserProfileImage(formData);

        if (response && response.data && response.data.photo) {
          setProfileImage(response.data.photo);
          console.log('Image de profil mise à jour avec succès:', response.data.photo);
        } else {
          console.error('Erreur: URL de l\'image de profil manquante dans la réponse', response);
        }

      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'image de profil:', error.response ? error.response.data : error.message);
      } finally {
        setLoadingImage(false); // Arrêter le chargement
      }
    } else {
      console.log('Sélection d\'image annulée');
    }
  };

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        // Charger l'URI de l'image de profil depuis AsyncStorage
        const savedImageUri = await AsyncStorage.getItem('profileImageUri');
        if (savedImageUri) {
          setProfileImage(savedImageUri);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'image de profil:', error);
      }
    };

    loadProfileImage();
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          const user = JSON.parse(userInfo);
          setUserName(`${user.Prenoms} ${user.Nom}`);
        }

        const userData = await AuthService.getUserInfo();
        setUserDetails(userData);
        setProjectList(userData.projects.map(p => p.projet));

        // Charger les détails du projet sélectionné
        const defaultProjectCode = await AsyncStorage.getItem('codeProjet');
        const defaultProject = userData.projects.find(p => p.projet.id.toString() === defaultProjectCode)?.projet;
        setSelectedProject(defaultProject || userData.projects[0]?.projet);
      } catch (error) {
        console.error('Failed to load user info:', error);
      }
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    const loadProjectData = async () => {
      setLoading(true);
      try {
        if (selectedProject) {
          const project = await AuthService.getProjectDetails();
          setProjetUser(project);

          const total = project.bailleurs.reduce((sum, bailleur) => sum + parseFloat(bailleur.Budget), 0);
          setTotalBudget(total);

          const totalDecaissement = project.bailleurs.reduce((sum, bailleur) => {
            return sum + bailleur.decaissement.reduce((decaisseSum, decaissement) => {
              return decaisseSum + parseFloat(decaissement.montant_decaisser);
            }, 0);
          }, 0);
          setTotalDecaissement(totalDecaissement);

          const decaissementRate = (totalDecaissement / total) * 100;
          setDecaissementRate(decaissementRate.toFixed(2));

          const projectStartDate = moment(project.DateDebut, 'YYYY-MM-DD');
          const projectEndDate = moment(project.DateFin, 'YYYY-MM-DD');
          const totalDuration = projectEndDate.diff(projectStartDate, 'days');
          const now = moment();
          const duration = moment.duration(projectEndDate.diff(now));
          const monthsRemaining = Math.floor(duration.asMonths());
          const daysRemaining = duration.days();

          setProjectDuration(totalDuration);
          setDaysRemaining({ months: monthsRemaining, days: daysRemaining });

          const suivis = project.suivis;
          if (suivis.length > 0) {
            // console.log('Dernier Suivi:', suivis[0]); // Vérifie si le suivi est bien récupéré
            setDernierSuivi(suivis[0]);
          } else {
            setDernierSuivi(null); // Assure-toi de bien gérer le cas sans suivi
          }


          const indicatorData = project.indicateurs
          setIndicatorData(indicatorData);

          const infrastructuresData = project.infrastructures
          // console.log('list infrastructuresData', infrastructuresData)
          setinfrastructures(infrastructuresData);

        }
      } catch (error) {
        console.error('Failed to load project data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [selectedProject]);

  // const selectProject = async (project) => {
  //   await AsyncStorage.setItem('codeProjet', project.id.toString());
  //   setSelectedProject(project);
  //   setModalVisible(false);
  // };

  const selectProject = async (project) => {
    try {
      await AsyncStorage.setItem('codeProjet', project.id.toString());
      await AuthService.updateCodeProjetIndicateur(project.CodeProjet); // Met à jour le codeProjetIndicateur
      setSelectedProject(project);
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to select project:', error);
    }
  };


  const navigateToProjectDetails = () => {
    navigation.navigate('ProjetPage');
  };

  const navigateToIndicator = () => {
    navigation.navigate('IndicatorPage');
  };
  const navigateToInfrastrucutre = () => {
    navigation.navigate('Infrastructure');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DANGER':
        return <FontAwesome name="exclamation-circle" size={24} color="red" />;
      case 'TERMINER':
        return <MaterialIcons name="check-circle" size={24} color="green" />;
      case 'EN COURS':
        return <MaterialIcons name="hourglass-empty" size={24} color="yellow" />;
      default:
        return <MaterialIcons name="help" size={24} color={theme.colors.text} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DANGER':
        return 'red';
      case 'TERMINER':
        return 'green';
      case 'EN COURS':
        return 'yellow';
      default:
        return theme.colors.text;
    }
  };

  const renderProjectDetails = () => {
    if (selectedProject) {
      return (
        <>
          <TouchableOpacity onPress={navigateToProjectDetails}>
            <View style={styles.statsContainer}>
              <View style={[styles.statsCard, { backgroundColor: theme.colors.card }]}>
                <View style={styles.titleCard}>
                  <View>
                    <Text style={[styles.statsLabel, { color: theme.colors.text }]}>Sigle: {selectedProject.Sigle}</Text>
                    <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>{selectedProject.NomProjet}</Text>
                    {/* <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>Durée du projet: <Text style={{ color: 'red' }}>{projectDuration.toLocaleString()} </Text>jours</Text> */}
                    {/* <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>
                      Jours restants: <Text style={{ color: 'red' }}>{daysRemaining.months.toLocaleString()} </Text>mois et <Text style={{ color: 'red' }}>{daysRemaining.days.toLocaleString()} </Text>jours
                    </Text> */}
                    <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>
                      Jours restants:
                      <Text style={{ color: 'red' }}>{Math.max(0, daysRemaining.months).toLocaleString()} </Text>
                      mois et
                      <Text style={{ color: 'red' }}> {Math.max(0, daysRemaining.days).toLocaleString()} </Text>
                      jours
                    </Text>

                    <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>
                      Durée du projet:
                      <Text style={{ color: 'red' }}>
                        {Math.floor(projectDuration / 30 / 12)} ans {Math.floor((projectDuration / 30) % 12)} mois
                      </Text>
                    </Text>

                  </View>
                  <View style={styles.icon}>
                    <EvilIcons name="arrow-right" size={40} style={{ color: theme.colors.primary }} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <View style={[styles.statsContainer]}>
            <View style={[styles.statsSection, { borderBottomColor: theme.colors.primary }]}>
              <Animated.Text style={[styles.statsLabel1, { color: theme.colors.text, opacity: budgetOpacity }]}>
                Budget: <CustomText style={{ fontSize: 24, }}>{totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </CustomText>GNF
              </Animated.Text>
              <Animated.View style={{ opacity: decaissementOpacity }}>
                <CustomText style={[styles.statsLabel1, { color: theme.colors.text }]}>
                  Décaissement: <CustomText style={{ fontSize: 24, }}> {totalDecaissement.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </CustomText>GNF
                </CustomText>
                <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>
                  Taux: <CustomText style={[{ color: 'red', fontSize: 24 },]}>{decaissementRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </CustomText>%
                </Text>
              </Animated.View>
            </View>
          </View>
        </>
      );
    }
    return null;
  };


  const renderIndicators = () => {
    return (
      <View style={styles.indicatorCardContainer}>
        <View style={[styles.indicatorCard, { backgroundColor: theme.colors.card }]}>
          <View className={styles.labelcard}>
            <MaterialIcons name="done" style={[styles.IndicatorNav, { color: theme.colors.primary }]} />
            <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Avancement</Text>
          </View>
          <Text style={[styles.labelText, { color: theme.colors.text }]}></Text>
        </View>
        <View style={[styles.indicatorCard, { backgroundColor: theme.colors.card }]}>
          <View className={styles.labelcard}>
            {dernierSuivi ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {getStatusIcon(dernierSuivi.StatutProjet)}
                <Text style={[{ fontSize: 14, fontWeight: '500', marginLeft: 8 }, { color: getStatusColor(dernierSuivi.StatutProjet) }]}>
                  Statut du projet: {dernierSuivi.StatutProjet}
                </Text>
              </View>
            ) : (
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Aucun suivi disponible</Text>
            )}
          </View>
        </View>
      </View>
    );
  };
  const renderProjectIndicators = () => {
    if (indicatorData && indicatorData.length > 0) {
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollView}>
          {indicatorData.slice(0, 3).map((indicateur, index) => (
            <View key={index} style={[styles.indicatorCard1, { backgroundColor: theme.colors.card }]}>
              <View>
                <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>{indicateur.IntituleIndicateur}</Text>
                <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>{indicateur.CibleFinProjet}</Text>
              </View>
              {/* <MaterialIcons name="list" style={[styles.IndicatorNav, { color: theme.colors.primary }]} /> */}
            </View>
          ))}
        </ScrollView>
      );
    }
    return null;
  };

  //  pour la partie infrastructure
  const renderProjectinfrastructure = () => {
    if (infrastructuresData && infrastructuresData.length > 0) {
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollView}>
          {infrastructuresData.slice(0, 3).map((infrastructures, index) => (
            <View key={index} style={[styles.indicatorCard1, { backgroundColor: theme.colors.card }]}>
              <View>
                <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>{infrastructures.NomInfrastructure}</Text>
                <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>{infrastructures.MaitreOuvrage}</Text>
                <ProgressBar
                  progress={parseFloat(infrastructures.TauxAvancementTechnique) / 100}
                  color={MD3Colors.primary50} 
                  style={{ marginVertical: 10, height: 10 }}
                />
                <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                  Avancement Technique : {infrastructures.TauxAvancementTechnique}%
                </Text>
              </View>
              {/* <MaterialIcons name="list" style={[styles.IndicatorNav, { color: theme.colors.primary }]} /> */}
            </View>
          ))}
        </ScrollView>
      );
    }
    return null;
  };


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={[{ justifyContent: 'space-between' }, { backgroundColor: theme.colors.Appb }]}>
        {/* <Appbar.Content title="Accueil" color={theme.colors.text} /> */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={selectImage}>
            {loadingImage ? (
              <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
              profile ? (
                <Image source={{ uri: profile }} style={styles.profileImage} />
              ) : (
                <MaterialIcons name="account-circle" size={40} color={theme.colors.primary} />
              )
            )}
          </TouchableOpacity>


          <View style={{ flexDirection: 'column' }}>
            <Text style={[styles.welcomeText, { color: theme.colors.text }]}>Bienvenue,</Text>
            <Text style={[styles.userName, { color: theme.colors.text }]}>{userName}</Text>
          </View>
        </View>
        <View style={[styles.selectProjet, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}>
            <View style={styles.topCard}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                {selectedProject ? `Projet : ${selectedProject.Sigle}` : 'Choisir un projet'}
                <MaterialIcons name="arrow-drop-down" size={24} color={theme.colors.primary} />
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Appbar.Header>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>

        {renderProjectDetails()}

        
        {renderIndicators()}
        <View style={styles.indicatorContainer}>
          <Text style={[styles.indicatorTitle, { color: theme.colors.text }]}>infrastructures</Text>
          <TouchableOpacity onPress={navigateToInfrastrucutre}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ paddingTop: 3, paddingRight: 5, fontSize: 20, color: theme.colors.text }}>Voir</Text>
              <MaterialIcons name="add-circle" style={[styles.addButton, { color: theme.colors.primary }]} />
            </View>
          </TouchableOpacity>
        </View>

        {renderProjectinfrastructure()}
        <View style={styles.indicatorContainer}>
          <Text style={[styles.indicatorTitle, { color: theme.colors.text }]}>Indicateurs</Text>
          <TouchableOpacity onPress={navigateToIndicator}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ paddingTop: 3, paddingRight: 5, fontSize: 20, color: theme.colors.text }}>Voir</Text>
              <MaterialIcons name="add-circle" style={[styles.addButton, { color: theme.colors.primary }]} />
            </View>
          </TouchableOpacity>
        </View>
        {renderProjectIndicators()}

      </ScrollView>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Sélectionner un projet</Text>
            {projectList.map((project, index) => (
              <View key={project.id}>
                <TouchableOpacity onPress={() => selectProject(project)} style={styles.modalItem}>
                  <Text style={[styles.modalItemText, { color: theme.colors.text }]}>
                    {project.Sigle} - {project.NomProjet}
                  </Text>
                </TouchableOpacity>
                {index < projectList.length - 1 && <Divider />}
              </View>
            ))}
            <Button title="Annuler" onPress={() => setModalVisible(false)} color={theme.colors.primary} />
          </View>
        </View>
      </Modal>


    </View>
  );
};

export default HomePage;
