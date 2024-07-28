import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, EvilIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../SettingsPage/themeContext'; 
import AuthService from '../../services/authServices';
import styles from './styles';

const HomePage = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [userName, setUserName] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [projetUser, setProjetUser] = useState(null);
  const [indicatorData, setIndicatorData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error('Failed to load user info:', error);
      }
    };

    const getProjectDetails = async () => {
      try {
        const project = await AuthService.getProjectDetails();
        setProjetUser(project.data); 
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

  const navigateToProjectDetails = () => {
    navigation.navigate('ProjetPage');
  };

  const navigateToIndicator = () => {
    navigation.navigate('IndicatorPage');
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
                      <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>{project.DateDebut} - {project.DateFin}</Text>
                    </View>
                    <View style={styles.icon}>
                      <EvilIcons name="arrow-right" size={40} color="black" />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.statsContainer}>
             <View style={[styles.statsCard1, { backgroundColor: theme.colors.card }]}>
               <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>Budget: </Text>
               <View style={styles.titleCard1}>
                 <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>Décaissement: </Text>
                 <Text style={[styles.statsLabel1, { color: theme.colors.text }]}>Taux: </Text>
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
    if (userDetails) {
      return (
        <View style={styles.indicatorCardContainer}>
          <View style={[styles.indicatorCard, { backgroundColor: theme.colors.card }]}>
            <View className={styles.labelcard}>
              <MaterialIcons name="done" style={[styles.IndicatorNav, { color: theme.colors.primary }]} />
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Avancement</Text>
            </View>
            <Text style={[styles.labelText, { color: theme.colors.text }]}>{userDetails.avancement ? userDetails.avancement : 'N/A'}%</Text>
          </View>
          <View style={[styles.indicatorCard, { backgroundColor: theme.colors.card }]}>
            <View className={styles.labelcard}>
              <MaterialIcons name="done" style={[styles.IndicatorNav, { color: theme.colors.primary }]} />
              <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>Statut de Projet</Text>
            </View>
            <Text style={[styles.labelText, { color: theme.colors.text }]}>{userDetails.statutProjet ? userDetails.statutProjet : 'N/A'}</Text>
          </View>
        </View>
      );
    }
    return null;
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
    </View>
  );
};

export default HomePage;
