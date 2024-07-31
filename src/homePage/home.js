import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal,Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, EvilIcons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../SettingsPage/themeContext';
import AuthService from '../../services/authServices';
import styles from './styles';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';


const HomePage = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [userName, setUserName] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [projetUser, setProjetUser] = useState(null);
  const [indicatorData, setIndicatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalDecaissement, setTotalDecaissement] = useState(0);
  const [decaissementRate, setDecaissementRate] = useState(0);
  const [dernierSuivi, setDernierSuivi] = useState(null);
  const [projectDuration, setProjectDuration] = useState('');
  const [daysRemaining, setDaysRemaining] = useState(0);

  const [selectedProject, setSelectedProject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          const user = JSON.parse(userInfo);
          setUserName(`${user.Prenoms} ${user.Nom}`);
        }

        // const userData = await AuthService.getUserInfo();
        // setUserDetails(userData);
        const userData = await AuthService.getUserInfo();
        setUserDetails(userData);
        setProjectList(userData.projects.map(p => p.projet));
        setSelectedProject(userData.projects[0]?.projet);
      } catch (error) {
        console.error('Failed to load user info:', error);
      }
    };

    const getProjectDetails = async () => {
      try {
        const project = await AuthService.getProjectDetails();
        setProjetUser(project.data);
        const total = project.bailleurs.reduce((sum, bailleur) => {
          return sum + parseFloat(bailleur.Budget);
        }, 0);

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
        const remainingDays = projectEndDate.diff(moment(), 'days');

        const now = moment();
        const duration = moment.duration(projectEndDate.diff(now));
        const monthsRemaining = Math.floor(duration.asMonths());
        const daysRemaining = duration.days();

        setProjectDuration(totalDuration);
        setDaysRemaining({ months: monthsRemaining, days: daysRemaining });

        const response = await AuthService.getProjectDetails();
        const suivis = response.suivis;
        if (suivis.length > 0) {
          setDernierSuivi(suivis[0]);
        }
      } catch (error) {
        console.error('Failed to load project details:', error);
      }
    };

    const fetchIndicator = async () => {
      try {
        const data = await AuthService.getIndicator();
        setIndicatorData(data);
      } catch (error) {
        console.error('Failed to load indicator details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicator();
    getProjectDetails();
    getUserInfo();
  }, []);
  const selectProject = async (project) => {
    setSelectedProject(project);
    setModalVisible(false);
    await AsyncStorage.setItem('codeProjet', project.CodeProjet);
    // Recharger les détails du projet ou naviguer si nécessaire
  };

  const navigateToProjectDetails = () => {
    navigation.navigate('ProjetPage');
  };

  const navigateToIndicator = () => {
    navigation.navigate('IndicatorPage');
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
    if (userDetails && userDetails.projects && userDetails.projects.length > 0) {
      const project = userDetails.projects[0]?.projet;
      if (project) {
        return (
          <>
            <TouchableOpacity onPress={navigateToProjectDetails}>
              <View style={styles.statsContainer}>
                <View style={[styles.statsCard, { backgroundColor: theme.colors.card }]}>
                  <View style={styles.titleCard}>
                    <View>
                      <Text style={[styles.statsLabel, { color: theme.colors.text }]}>Sigle: {project.Sigle}</Text>
                      <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>{project.NomProjet}</Text>
                      {/* <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>Date {project.DateDebut} - {project.DateFin}</Text> */}
                      {/* <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>Durée du projet: {projectDuration} jours</Text> */}
                      {/* <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>Jours restants: {daysRemaining} jours</Text> */}
                      <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>Durée du projet: <Text style={{color:'red'}}>{projectDuration} </Text>jours</Text>
                    <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>
                      Jours restants: <Text style={{color:'red'}}>{daysRemaining.months} </Text>mois et <Text style={{color:'red'}}>{daysRemaining.days} </Text>jours
                    </Text>
                    </View>
                    <View style={styles.icon}>
                      <EvilIcons name="arrow-right" size={40} style={[ { color: theme.colors.primary }]} />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.statsContainer}>
              <View style={[styles.statsCard1, { backgroundColor: theme.colors.card }]}>
                <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>Budget: {totalBudget.toFixed(2)}</Text>
                <View style={styles.titleCard1}>
                  <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>Décaissement: {totalDecaissement.toFixed(2)}           </Text>
                  <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>Taux: <Text style={{ color: 'red' }}>{decaissementRate}</Text>%</Text>
                </View>
              </View>
            </View>
          </>
        );
      }
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
            {/* <MaterialIcons name="done" style={[styles.IndicatorNav, { color: theme.colors.primary }]} /> */}
            {/* <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Statut de Projet</Text> */}

            {dernierSuivi ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {getStatusIcon(dernierSuivi.StatutProjet)}
                <Text style={[{fontSize:16,fontWeight:'500', marginLeft: 8}, { color: getStatusColor(dernierSuivi.StatutProjet) }]}>
                  Statut du projet: {dernierSuivi.StatutProjet}
                </Text>
              </View>
            ) : (
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                Aucun suivi disponible
              </Text>
            )}




          </View>
          <Text style={[styles.labelText, { color: theme.colors.text }]}></Text>
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
              <MaterialIcons name="list" style={[styles.IndicatorNav, { color: theme.colors.primary }]} />
            </View>
          ))}
        </ScrollView>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.welcomeContainer}>
        <View>
          <Text style={[styles.welcomeText, { color: theme.colors.text }]}>Bienvenue,</Text>
          <Text style={[styles.userName, { color: theme.colors.text }]}>{userName}</Text>
          {selectedProject && (
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.selectProjectButton}>
              <Text style={[styles.selectProjectText, { color: theme.colors.primary }]}>
                {selectedProject.NomProjet} (Changer)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsHorizontalScrollIndicator={false}>
        {renderProjectDetails()}
        {renderIndicators()}

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
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Sélectionner un projet</Text>
            {projectList.map((project, index) => (
              <TouchableOpacity key={index} onPress={() => selectProject(project)}>
                <Text style={[styles.projectItem, { color: theme.colors.text }]}>
                  {project.NomProjet}
                </Text>
              </TouchableOpacity>
            ))}
            <Button title="Fermer" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomePage;
