import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Button, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, EvilIcons, FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../SettingsPage/themeContext';
import AuthService from '../../services/authServices';
import AuthServices from '../../services/indicateursServices';
import styles from './styles';
import moment from 'moment';
import { Appbar, Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Animated } from 'react-native';
// import * as Font from 'expo-font';
import CustomText from '../../NumberText';
import { ProgressBar, MD3Colors } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import AuthServiceInfrast from '../../services/infrastructure';
import ProjectDetailsSkeleton from './composantHome/ProjectDetailsSkeleton';
import InfrastructureSkeletonCard from './composantHome/InfrastructureSkeletonCard';

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
  const [dernierInfrastructure, setDernierdernierInfrastructure] = useState(null);
  const [projectDuration, setProjectDuration] = useState('');
  const [daysRemaining, setDaysRemaining] = useState({ months: 0, days: 0 });
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const budgetOpacity = useRef(new Animated.Value(0)).current;
  const decaissementOpacity = useRef(new Animated.Value(0)).current;
  const budgetScale = useRef(new Animated.Value(0.8)).current; // Valeur de départ pour le zoom
  const decaissementScale = useRef(new Animated.Value(0.8)).current; // Valeur de départ pour le zoom
  const [infrastructureData, setInfrastructureData] = useState([]);
  const [noProjects, setNoProjects] = useState(false);

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

        if (userData.projects.length === 0) {
          setNoProjects(true); // Activer l'affichage du message si aucun projet
        } else {
          setNoProjects(false); // Désactiver le message si des projets sont disponibles
        }
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
          // console.log('Image de profil mise à jour avec succès:', response.data.photo);
        } else {
          console.error('Erreur: URL de l\'image de profil manquante dans la réponse', response);
        }

      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'image de profil:', error.response ? error.response.data : error.message);
      } finally {
        setLoadingImage(false); // Arrêter le chargement
      }
    } else {
      // console.log('Sélection d\'image annulée');
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


          // const indicatorData = project.indicateurs
          // setIndicatorData(indicatorData);

          // const infrastructuresData = project.infrastructures
          // if (infrastructuresData.length > 0) {
          //   // console.log('Dernier infrastructuresData:', infrastructuresData[0]); // Vérifie si le suivi est bien récupéré
          //   setDernierdernierInfrastructure(infrastructuresData[0]);
          // } else {
          //   setDernierdernierInfrastructure(null); // Assure-toi de bien gérer le cas sans suivi
          // }
          // // console.log('list infrastructuresData', infrastructuresData)
          // setinfrastructures(infrastructuresData);

        }
      } catch (error) {
        console.error('Failed to load project data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [selectedProject]);


  useEffect(() => {
    const loadInfrastructureData = async () => {
      try {
        const data = await AuthServiceInfrast.getInfrastructure();
        // console.log('liste des infrastructures', data);
        // Traitement des infrastructures pour récupérer le dernier taux d'avancement
        const infrastructuresWithProgress = data.map((infrastructure) => {
          const latestSuivi = getLastTauxAvancement(infrastructure.suivis);
          return {
            ...infrastructure,
            tauxAvancement: latestSuivi,
            logo: infrastructure.logo || '', // Ajouter une valeur par défaut si le logo est manquant
          };
        });
        setInfrastructureData(infrastructuresWithProgress);

      } catch (error) {
        console.error('Failed to load infrastructure details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInfrastructureData();
  }, [selectedProject]);

  const getLastTauxAvancement = (suivis) => {
    if (suivis && suivis.length > 0) {
      const dernierSuivi = suivis[suivis.length - 1];
      return dernierSuivi.TauxAvancementTechnique || '0.00';
    }
    return '0.00';
  };

  useEffect(() => {
    const fetchIndicator = async () => {
      try {
        const data = await AuthServices.getIndicator();
        // Calculer le taux de réalisation pour chaque indicateur
        const indicateursAvecTaux = data.map(indicateur => {
          const totalRealisation = indicateur.suivis.reduce((sum, suivi) => {
            return sum + parseFloat(suivi.Realisation);
          }, 0);

          const tauxRealisation = Math.min((totalRealisation / parseFloat(indicateur.CibleFinProjet)) * 100, 100);

          return {
            ...indicateur,
            tauxRealisation: tauxRealisation.toFixed(2) // Arrondi à deux décimales
          };
        });

        setIndicatorData(indicateursAvecTaux);
      } catch (error) {
        console.error('Failed to load indicator details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIndicator();
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
        return <MaterialIcons name="hourglass-empty" size={24} color="#F3B530" />;
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
        return '#F3B530';
      default:
        return theme.colors.text;
    }
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
  if (noProjects) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Icon name="alert-circle-outline" size={50} color={theme.colors.primary} />
        <Text style={[styles.errorText, { color: theme.colors.text, marginTop: 20 }]}>Vous n'avez aucun projet associé à ce compte.</Text>
      </View>
    );
  }
  const renderProjectDetails = () => {
    if (loading) {
      return <ProjectDetailsSkeleton />;
    }

    if (selectedProject) {
      return (
        <>
          <TouchableOpacity onPress={navigateToProjectDetails}>
            <View style={styles.statsContainer}>
              <LinearGradient
                colors={['#018F8F', '#018F8F']}
                style={styles.statsCard}
              >
                <View style={styles.titleCard}>
                  <View>
                    <Text style={[styles.statsLabel, { color: '#D2D4D4' }]}>Sigle: {selectedProject.Sigle}</Text>
                    <Text style={[styles.statsLabel1, { color: '#D2D4D4' }]}>{selectedProject.NomProjet}</Text>
                    <Text style={[styles.statsLabel1, { color: '#D2D4D4' }]}>
                      Durée restants:
                      <Text style={{ color: '#FE0606' }}>{Math.max(0, daysRemaining.months).toLocaleString()} </Text>
                      mois et
                      <Text style={{ color: '#FE0606' }}> {Math.max(0, daysRemaining.days).toLocaleString()} </Text>
                      jours
                    </Text>

                    <Text style={[styles.statsLabel1, { color: '#D2D4D4' }]}>
                      Durée du projet:
                      <Text style={{ color: 'red' }}>
                        {Math.floor(projectDuration / 30 / 12)} ans {Math.floor((projectDuration / 30) % 12)} mois
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.icon}>
                    <EvilIcons name="arrow-right" size={40} style={{ color: '#ffffff' }} />
                  </View>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </>
      );
    }
    return null;
  };

  const renderProjectDetailss = () => {
    if (loading) {
      return <ProjectDetailsSkeleton />;
    }

    if (selectedProject) {
      return (
        <>
          <View style={[styles.statsContainerBudeget]}>
            <View style={[styles.statsSection, { borderBottomColor: theme.colors.primary }]}>
              <Animated.View style={{ opacity: budgetOpacity }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 24, color: theme.colors.text }}>Budget:</Text>
                  <CustomText style={{ fontSize: 24, color: theme.colors.text }}>
                    {formatMontant(totalBudget)}
                    <Text style={{ color: 'red', fontSize: 10 }}>GNF</Text>
                  </CustomText>
                </View>
              </Animated.View>

              <Animated.View style={{ opacity: decaissementOpacity }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10 }}>
                  <Text style={{ fontSize: 24, color: theme.colors.text }}>Décaissement:</Text>
                  <CustomText style={{ fontSize: 24, color: theme.colors.text }}>
                    {formatMontant(totalDecaissement)}
                    <Text style={{ color: 'red', fontSize: 10 }}>GNF</Text>
                  </CustomText>
                </View>
                <Divider />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>Taux de décaissement :</Text>
                  <CustomText style={{ color: getTextColor(decaissementRate), fontSize: 16 }}>{decaissementRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %</CustomText>
                </View>

                <ProgressBar
                  progress={decaissementRate / 100}
                  color={getProgressBarColor(decaissementRate)}
                  style={{ height: 10, borderRadius: 5, marginBottom: 10 }}
                />

                {dernierSuivi ? (
                  <View style={styles.suiviContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>Taux d’avancement physique</Text>
                      <CustomText style={{ color: getTextColor(dernierSuivi.TauxAvancementPhysique), fontSize: 16 }}>{dernierSuivi.TauxAvancementPhysique}%</CustomText>
                    </View>

                    <ProgressBar
                      progress={parseFloat(dernierSuivi.TauxAvancementPhysique) / 100}
                      color={getProgressBarColor(parseFloat(dernierSuivi.TauxAvancementPhysique))}
                      style={{ height: 10, borderRadius: 5 }}
                    />
                  </View>
                ) : (
                  <Text style={styles.noSuiviText}>Pas de suivi disponible</Text>
                )}
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
            {/* <MaterialIcons name="done" style={[styles.IndicatorNav, { color: theme.colors.primary }]} /> */}
            {dernierInfrastructure ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[{ fontSize: 14, fontWeight: '500', marginLeft: 8 }]}>
                  Avancement : {dernierInfrastructure.TauxAvancementTechnique}
                </Text>
              </View>
            ) : (
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Aucun suivi disponible</Text>
            )}
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
    if (loading) {
      return (
        <View style={styles.skeletonContainer}>
          <InfrastructureSkeletonCard />
          <InfrastructureSkeletonCard />
          <InfrastructureSkeletonCard />
        </View>
      );
    }
    if (indicatorData && indicatorData.length > 0) {
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollView}>
          {indicatorData.slice(0, 3).map((indicateur, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                // console.log('Indicator selected:',  { indicator: indicateur});
                navigation.navigate('SuiviDetailPage', { indicator: indicateur, CibleFinProjet: indicateur.CibleFinProjet });
              }}
            >
              <View key={index} style={[styles.indicatorCard1, { backgroundColor: theme.colors.card }]}>
                <View style={[{ padding: 7, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 5, backgroundColor: '#018F8F' }]}>
                  <Text style={{ color: '#ffffff' }}>
                    Code: {indicateur.IntituleIndicateur}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Valeur cible: <Text style={{ fontWeight: 700, fontSize: 20 }}>{indicateur.CibleFinProjet}</Text></Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={[{ color: theme.colors.text }]}>Taux de réalisation :</Text>
                  </View>
                  <View>
                    <CustomText style={[{ color: getTextColor(indicateur.tauxRealisation), fontSize: 13 }]}> {indicateur.tauxRealisation}% </CustomText>
                  </View>
                </View>



                <ProgressBar
                  progress={indicateur.tauxRealisation / 100}
                  color={getProgressBarColor(indicateur.tauxRealisation)}
                  style={{ height: 10, borderRadius: 5 }}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }
    return null;
  };




  //  pour la partie infrastructure
  const renderProjectinfrastructure = () => {
    if (loading) {
      return (
        <View style={styles.skeletonContainer}>
          <InfrastructureSkeletonCard />
          <InfrastructureSkeletonCard />
          <InfrastructureSkeletonCard />
        </View>
      );
    }
    if (infrastructureData && infrastructureData.length > 0) {
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollView}>
          {infrastructureData.slice(0, 3).map((infrastructure, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate('SuiviInfrastructure', { id: infrastructure.id })}
            >
              <View style={[styles.indicatorCard1, { backgroundColor: theme.colors.card }]}>
                <View style={styles.logoContainer}>
                  <Image
                    source={infrastructure.Logo ? { uri: infrastructure.Logo } : require('../../assets/icon.png')} // Image par défaut si le logo n'est pas disponible
                    style={styles.logoImage}
                  />
                </View>
                <Text></Text>
                <Text></Text>
                <View>
                  <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>{infrastructure.NomInfrastructure}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                      <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Taux Avancement :</Text>
                    </View>
                    <View>
                      <Text style={{ color: getTextColor(infrastructure.tauxAvancement), fontSize: 13, fontWeight: 700 }}>{infrastructure.tauxAvancement || '0.00'}%</Text>
                    </View>
                  </View>
                  <ProgressBar
                    progress={parseFloat(infrastructure.tauxAvancement) / 100}
                    color={getProgressBarColor(parseFloat(infrastructure.tauxAvancement))}
                    style={{ height: 10, borderRadius: 5 }}

                  />

                  {/* <Text style={styles.tauxAvancement}>Taux d'avancement: {infrastructure.tauxAvancement}%</Text> */}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }
    return null;
  };


  const getStatusBadge = (status) => {
    switch (status) {
      case 'DANGER':
        return <View style={styles.badgeDanger} />;
      case 'TERMINER':
        return <View style={styles.badgeTerminer} />;
      case 'EN COURS':
        return <View style={styles.badgeEnCours} />;
      default:
        return <View style={styles.badgeDefault} />;
    }
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

      {renderProjectDetails()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        {renderProjectDetailss()}
        <Divider />

        {/* <View style={styles.statutContainer}>
          <Text style={[styles.statutTitle, { color: theme.colors.text }]}>Statut du Projet</Text>
          {dernierSuivi ? (
            <View style={styles.statutItem}>
              {getStatusBadge(dernierSuivi.StatutProjet)}
              <Text style={[styles.statutText, { color: getStatusColor(dernierSuivi.StatutProjet) }]}>
                Statut du projet: {dernierSuivi.StatutProjet}
              </Text>
            </View>
          ) : (
            <Text style={[styles.statutText, { color: theme.colors.text }]}>Aucun suivi disponible</Text>
          )}
        </View> */}

        <Divider />
        {/* <View style={styles.avancementContainer}>
  <Text style={[styles.avancementTitle, { color: theme.colors.text }]}>Avancement Technique</Text>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollView}>
  {infrastructuresData.length > 0 ? (
  infrastructuresData.map((infra, index) => (
    <View key={index} style={styles.avancementItem}>
      <Text style={[styles.avancementLabel, { color: theme.colors.text }]}>{infra.NomInfrastructure}</Text>
      <ProgressBar
        progress={parseFloat(infra.TauxAvancementTechnique) / 100}
        color={MD3Colors.primary50}
        style={styles.progressBar}
      />
      <Text style={[styles.avancementPercent, { color: theme.colors.text }]}>
        {infra.TauxAvancementTechnique}%
      </Text>
    </View>
  ))
) : (
  <Text style={[styles.statutText, { color: theme.colors.text }]}>Aucun avancement disponible</Text>
)}

  </ScrollView>
</View> */}
        <Divider />


        {/* {renderIndicators()} */}
        <View >
          <View style={styles.indicatorContainer}>
            <Text style={[styles.indicatorTitle, { color: theme.colors.text }]}>Infrastructures</Text>
            {infrastructureData && infrastructureData.length > 0 ? (
              <TouchableOpacity onPress={navigateToInfrastrucutre}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ paddingTop: 3, paddingRight: 5, fontSize: 20, color: theme.colors.text }}>Voir</Text>
                  <MaterialIcons name="add-circle" style={[styles.addButton, { color: theme.colors.primary }]} />
                </View>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.statutText, { color: theme.colors.text }]}>Aucune infrastructure disponible</Text>
            )}
          </View>
          {renderProjectinfrastructure()}
        </View>

        {/* {renderProjectinfrastructure()} */}
        <View >
          <View style={styles.indicatorContainer}>
            <Text style={[styles.indicatorTitle, { color: theme.colors.text }]}>Indicateurs</Text>
            {indicatorData && indicatorData.length > 0 ? (
              <TouchableOpacity onPress={navigateToIndicator}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ paddingTop: 3, paddingRight: 5, fontSize: 20, color: theme.colors.text }}>Voir</Text>
                  <MaterialIcons name="add-circle" style={[styles.addButton, { color: theme.colors.primary }]} />
                </View>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.statutText, { color: theme.colors.text }]}>Aucun indicateur disponible</Text>
            )}
          </View>
          {renderProjectIndicators()}
        </View>

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
